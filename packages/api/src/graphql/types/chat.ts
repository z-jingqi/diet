import { builder } from "../builder";
import { chat_sessions } from "../../db/schema/chat";
import { users } from "../../db/schema/auth";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { UserRef } from "./auth"; // Import UserRef from auth.ts
import { DateTimeScalar } from "../builder";

// Drizzle model types
type ChatSessionModel = InferSelectModel<typeof chat_sessions>;
type UserModel = InferSelectModel<typeof users>;

type ChatMessage = {
  id: string;
  type: "CHAT" | "RECIPE" | "HEALTH_ADVICE";
  content: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  createdAt: string;
  status: "PENDING" | "STREAMING" | "DONE" | "ERROR" | "ABORT";
};

interface ChatResponse {
  response: string;
  sessionId?: string | null;
}

// ----------------------
// Enums for message metadata
// ----------------------

// Message type enum
export const MessageTypeEnum = builder.enumType("MessageType", {
  values: {
    CHAT: { value: "CHAT" },
    RECIPE: { value: "RECIPE" },
    HEALTH_ADVICE: { value: "HEALTH_ADVICE" },
  },
});

// Message role enum
export const MessageRoleEnum = builder.enumType("MessageRole", {
  values: {
    USER: { value: "USER" },
    ASSISTANT: { value: "ASSISTANT" },
    SYSTEM: { value: "SYSTEM" },
  },
});

// Message status enum
export const MessageStatusEnum = builder.enumType("MessageStatus", {
  values: {
    PENDING: { value: "PENDING" },
    STREAMING: { value: "STREAMING" },
    DONE: { value: "DONE" },
    ERROR: { value: "ERROR" },
    ABORT: { value: "ABORT" },
  },
});

// ----------------------
// ChatMessage type
// ----------------------
export const ChatMessageRef = builder
  .objectRef<ChatMessage>("ChatMessage")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      type: t.expose("type", { type: MessageTypeEnum }),
      content: t.exposeString("content"),
      role: t.expose("role", { type: MessageRoleEnum }),
      createdAt: t.expose("createdAt", { type: DateTimeScalar }),
      status: t.expose("status", { type: MessageStatusEnum }),
    }),
  });

// ----------------------
// ChatResponse type
// ----------------------
export const ChatResponseRef = builder
  .objectRef<ChatResponse>("ChatResponse")
  .implement({
    fields: (t) => ({
      response: t.exposeString("response"),
      sessionId: t.exposeString("sessionId", { nullable: true }),
    }),
  });

// ----------------------
// ChatSession type
// ----------------------
export const ChatSessionRef = builder
  .objectRef<ChatSessionModel>("ChatSession")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      title: t.exposeString("title"),
      tagIds: t.field({
        type: ["String"],
        nullable: true,
        resolve: (parent) => {
          if (!parent.tag_ids) return null;
          try {
            return JSON.parse(parent.tag_ids);
          } catch {
            return null;
          }
        },
      }),
      messages: t.field({
        type: [ChatMessageRef],
        nullable: true,
        resolve: (parent) => {
          if (!parent.messages) return null;
          try {
            return JSON.parse(parent.messages);
          } catch {
            return null;
          }
        },
      }),
      createdAt: t.expose("created_at", {
        type: DateTimeScalar,
        nullable: true,
      }),
      updatedAt: t.expose("updated_at", {
        type: DateTimeScalar,
        nullable: true,
      }),
      deletedAt: t.expose("deleted_at", {
        type: DateTimeScalar,
        nullable: true,
      }),

      // Relations
      user: t.field({
        type: UserRef,
        resolve: async (parent, _args, ctx) => {
          const [user] = await ctx.db
            .select()
            .from(users)
            .where(eq(users.id, parent.user_id))
            .limit(1);
          return user ? toGraphQLUser(user) : null;
        },
      }),
    }),
  });

// Helper function to convert database user to GraphQL user
function toGraphQLUser(user: UserModel) {
  const { password_hash, ...graphQLUser } = user;
  return graphQLUser;
}

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Get current user's chat sessions
  myChatSessions: t.field({
    type: [ChatSessionRef],
    resolve: async (_root, _args, ctx) => {
      const auth = requireAuth(ctx);
      return ctx.services.chat.getMyChatSessions(auth.user.id);
    },
  }),

  // Get chat session by ID
  chatSession: t.field({
    type: ChatSessionRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      return ctx.services.chat.getChatSession(id);
    },
  }),

  // Get chat sessions for a specific user
  chatSessions: t.field({
    type: [ChatSessionRef],
    args: {
      userId: t.arg.id({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return ctx.services.chat.getChatSessionsByUser(userId);
    },
  }),
}));

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  // Create chat session (authenticated)
  createChatSession: t.field({
    type: ChatSessionRef,
    args: {
      title: t.arg.string({ required: true }),
      messages: t.arg.string({ required: true }), // JSON string
      tagIds: t.arg.idList(),
    },
    resolve: async (_root, { title, messages, tagIds }, ctx) => {
      const { user } = requireAuth(ctx);
      return ctx.services.chat.createChatSession({
        userId: user.id,
        title,
        messages,
        tagIds,
      });
    },
  }),

  // Update chat session
  updateChatSession: t.field({
    type: ChatSessionRef,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string(),
      messages: t.arg.string(), // JSON string
      tagIds: t.arg.idList(),
    },
    resolve: async (_root, args, ctx) => {
      const { tagIds, ...rest } = args;
      return ctx.services.chat.updateChatSession(args.id, {
        title: rest.title ?? undefined,
        messages: rest.messages ?? undefined,
        tagIds: tagIds ?? undefined,
      });
    },
  }),

  // Delete chat session (soft delete)
  deleteChatSession: t.field({
    type: "Boolean",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const result = await ctx.services.chat.deleteChatSession(id);
      return result !== null;
    },
  }),
}));
