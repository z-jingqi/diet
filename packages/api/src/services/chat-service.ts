// ChatService provides methods to manage chat sessions and messages
import { DB } from "../db";
import { chat_sessions } from "../db/schema/chat";
import { users } from "../db/schema/auth";
import { eq, and, isNull } from "drizzle-orm";
import type {
  CreateChatSessionRequest,
  UpdateChatSessionRequest,
} from "../types";

type ChatSessionModel = typeof chat_sessions.$inferSelect;

export class ChatService {
  constructor(private db: DB) {}

  async getMyChatSessions(userId: string): Promise<ChatSessionModel[]> {
    return this.db
      .select()
      .from(chat_sessions)
      .where(
        and(eq(chat_sessions.user_id, userId), isNull(chat_sessions.deleted_at))
      )
      .orderBy(chat_sessions.updated_at);
  }

  async getChatSession(id: string): Promise<ChatSessionModel | null> {
    const [session] = await this.db
      .select()
      .from(chat_sessions)
      .where(eq(chat_sessions.id, id))
      .limit(1);
    return session ?? null;
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSessionModel[]> {
    return this.db
      .select()
      .from(chat_sessions)
      .where(
        and(eq(chat_sessions.user_id, userId), isNull(chat_sessions.deleted_at))
      )
      .orderBy(chat_sessions.updated_at);
  }

  async createChatSession(
    data: CreateChatSessionRequest
  ): Promise<ChatSessionModel> {
    const { generateId } = await import("../utils/id");
    const id = generateId();
    const now = new Date().toISOString();

    const [session] = await this.db
      .insert(chat_sessions)
      .values({
        id,
        user_id: data.userId,
        title: data.title,
        messages: data.messages,
        tag_ids: JSON.stringify(data.tagIds ?? []),
        created_at: now,
        updated_at: now,
      })
      .returning();

    return session;
  }

  async updateChatSession(
    id: string,
    data: UpdateChatSessionRequest
  ): Promise<ChatSessionModel | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.messages !== undefined) updateData.messages = data.messages;
    if (data.tagIds !== undefined) {
      updateData.tag_ids = JSON.stringify(data.tagIds ?? []);
    }

    // 每次更新都刷新 updated_at
    updateData.updated_at = new Date().toISOString();

    const [session] = await this.db
      .update(chat_sessions)
      .set(updateData)
      .where(eq(chat_sessions.id, id))
      .returning();
    return session ?? null;
  }

  async deleteChatSession(id: string): Promise<ChatSessionModel | null> {
    const [session] = await this.db
      .update(chat_sessions)
      .set({ deleted_at: new Date().toISOString() })
      .where(eq(chat_sessions.id, id))
      .returning();
    return session ?? null;
  }
}
