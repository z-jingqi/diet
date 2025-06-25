import { builder } from '../builder';
import { chatSessions } from '../../db/schema/chat';
import { users } from '../../db/schema/auth';
import { eq, isNull, and } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import { UserRef } from './auth'; // Import UserRef from auth.ts

// Drizzle model types
type ChatSessionModel = InferSelectModel<typeof chatSessions>;
type UserModel = InferSelectModel<typeof users>;

// Message type for parsed messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Chat response type
interface ChatResponse {
  response: string;
  sessionId?: string | null;
}

// ----------------------
// ChatMessage type
// ----------------------
export const ChatMessageRef = builder.objectRef<ChatMessage>('ChatMessage').implement({
  fields: (t) => ({
    role: t.exposeString('role'),
    content: t.exposeString('content'),
    timestamp: t.exposeString('timestamp', { nullable: true }),
  }),
});

// ----------------------
// ChatResponse type
// ----------------------
export const ChatResponseRef = builder.objectRef<ChatResponse>('ChatResponse').implement({
  fields: (t) => ({
    response: t.exposeString('response'),
    sessionId: t.exposeString('sessionId', { nullable: true }),
  }),
});

// ----------------------
// ChatSession type
// ----------------------
export const ChatSessionRef = builder.objectRef<ChatSessionModel>('ChatSession').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    updatedAt: t.exposeString('updatedAt', { nullable: true }),
    
    // Parse messages from JSON string
    messages: t.field({
      type: [ChatMessageRef],
      resolve: (parent) => {
        try {
          return JSON.parse(parent.messages) as ChatMessage[];
        } catch {
          return [];
        }
      },
    }),
    
    // Parse current tags from JSON string
    currentTags: t.field({
      type: ['String'],
      resolve: (parent) => {
        if (!parent.currentTags) return [];
        try {
          return JSON.parse(parent.currentTags) as string[];
        } catch {
          return [];
        }
      },
    }),
    
    // User relation
    user: t.field({
      type: UserRef,
      resolve: async (parent, _args, ctx) => {
        const [user] = await ctx.context.db
          .select()
          .from(users)
          .where(eq(users.id, parent.userId))
          .limit(1);
        return user ? toGraphQLUser(user) : null;
      },
    }),
  }),
});

// Helper function to convert database user to GraphQL user (import from auth.ts)
function toGraphQLUser(user: UserModel): any {
  const { passwordHash, ...graphQLUser } = user;
  return graphQLUser;
}

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Fetch chat sessions for a user
  chatSessions: t.field({
    type: [ChatSessionRef],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return await ctx.context.db
        .select()
        .from(chatSessions)
        .where(and(eq(chatSessions.userId, userId), isNull(chatSessions.deletedAt)));
    },
  }),

  // Fetch single chat session by ID
  chatSession: t.field({
    type: ChatSessionRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [session] = await ctx.context.db
        .select()
        .from(chatSessions)
        .where(and(eq(chatSessions.id, id as string), isNull(chatSessions.deletedAt)))
        .limit(1);
      return session ?? null;
    },
  }),

  // Get current user's chat sessions
  myChatSessions: t.field({
    type: [ChatSessionRef],
    resolve: async (_root, _args, ctx) => {
      const auth = requireAuth(ctx);
      return await ctx.context.db
        .select()
        .from(chatSessions)
        .where(and(eq(chatSessions.userId, auth.user.id), isNull(chatSessions.deletedAt)));
    },
  }),
}));

// ----------------------
// Mutations (Only Chat Session Management)
// ----------------------
builder.mutationFields((t) => ({
  // Create new chat session
  createChatSession: t.field({
    type: ChatSessionRef,
    args: {
      userId: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      messages: t.arg.string({ required: true }),
      currentTags: t.arg.string({ required: false }),
    },
    resolve: async (_root, { userId, title, messages, currentTags }, ctx) => {
      const [session] = await ctx.context.db
        .insert(chatSessions)
        .values({
          id: crypto.randomUUID(),
          userId,
          title,
          messages,
          currentTags: currentTags ?? null,
        })
        .returning();
      
      return session;
    },
  }),

  // Update chat session
  updateChatSession: t.field({
    type: ChatSessionRef,
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string({ required: false }),
      messages: t.arg.string({ required: false }),
      currentTags: t.arg.string({ required: false }),
    },
    resolve: async (_root, { id, title, messages, currentTags }, ctx) => {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (messages !== undefined) updateData.messages = messages;
      if (currentTags !== undefined) updateData.currentTags = currentTags;
      updateData.updatedAt = new Date().toISOString();

      const [session] = await ctx.context.db
        .update(chatSessions)
        .set(updateData)
        .where(eq(chatSessions.id, id as string))
        .returning();
      
      return session ?? null;
    },
  }),

  // Soft delete chat session
  deleteChatSession: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [session] = await ctx.context.db
        .update(chatSessions)
        .set({ deletedAt: new Date().toISOString() })
        .where(eq(chatSessions.id, id as string))
        .returning();
      
      return !!session;
    },
  }),
})); 
