import { builder } from "../builder";
import { chat_sessions } from "../../db/schema/chat";
import { users } from "../../db/schema/auth";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { UserRef } from "./auth"; // Import UserRef from auth.ts

// Drizzle model types
type ChatSessionModel = InferSelectModel<typeof chat_sessions>;
type UserModel = InferSelectModel<typeof users>;

// Chat message type for GraphQL
type ChatMessage = {
  role: string;
  content: string;
  timestamp: string;
};

// Chat response type
interface ChatResponse {
  response: string;
  sessionId?: string | null;
}

// ----------------------
// ChatMessage type
// ----------------------
export const ChatMessageRef = builder
  .objectRef<ChatMessage>("ChatMessage")
  .implement({
    fields: (t) => ({
      role: t.exposeString("role"),
      content: t.exposeString("content"),
      timestamp: t.exposeString("timestamp"),
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
      currentTags: t.field({
        type: ["String"],
        nullable: true,
        resolve: (parent) => {
          if (!parent.current_tags) return null;
          try {
            return JSON.parse(parent.current_tags);
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
      createdAt: t.exposeString("created_at", { nullable: true }),
      updatedAt: t.exposeString("updated_at", { nullable: true }),
      deletedAt: t.exposeString("deleted_at", { nullable: true }),

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
  // Create chat session
  createChatSession: t.field({
    type: ChatSessionRef,
    args: {
      userId: t.arg.id({ required: true }),
      title: t.arg.string({ required: true }),
      messages: t.arg.string({ required: true }), // JSON string
      currentTags: t.arg.string(), // JSON string
    },
    resolve: async (_root, args, ctx) => {
      return ctx.services.chat.createChatSession(args);
    },
  }),

  // Update chat session
  updateChatSession: t.field({
    type: ChatSessionRef,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string(),
      messages: t.arg.string(), // JSON string
      currentTags: t.arg.string(), // JSON string
    },
    resolve: async (_root, args, ctx) => {
      return ctx.services.chat.updateChatSession(args.id, {
        title: args.title ?? undefined,
        messages: args.messages ?? undefined,
        currentTags: args.currentTags ?? undefined,
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
      return ctx.services.chat.deleteChatSession(id);
    },
  }),
}));
