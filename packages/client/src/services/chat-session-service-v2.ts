import { nanoid } from "nanoid";
import { chatSessionSdkV2 } from "@/lib/gql/sdk/chat-session-v2";
import { 
  ChatMessage, 
  ChatSession,
  MessageRole,
  MessageStatus,
  MessageType,
  Tag
} from "@/lib/gql/graphql";
import { 
  createEmptyChatSessionV2, 
  generateChatSessionTitleV2 
} from "@/utils/chat-utils-v2";

/**
 * Service for managing chat sessions
 */
class ChatSessionServiceV2 {
  /**
   * Create a new chat session
   */
  async createSession(
    title: string = "New Chat", 
    initialMessages: ChatMessage[] = [],
    tagIds: string[] = []
  ): Promise<ChatSession> {
    try {
      // Generate title from first message if available
      const autoTitle = initialMessages.length > 0 
        ? generateChatSessionTitleV2(initialMessages) 
        : title;
      
      const result = await chatSessionSdkV2.create({
        title: autoTitle,
        messages: JSON.stringify(initialMessages),
        tagIds,
      });
      
      const createdSession = result.createChatSession;
      
      if (!createdSession) {
        throw new Error("Failed to create chat session");
      }
      
      return {
        id: createdSession.id,
        title: createdSession.title || autoTitle,
        messages: initialMessages,
        tagIds: createdSession.tagIds || [],
        createdAt: createdSession.createdAt,
        updatedAt: createdSession.updatedAt,
      } as ChatSession;
    } catch (error) {
      console.error("Error creating chat session:", error);
      // Create local fallback for error cases
      return {
        ...createEmptyChatSessionV2(),
        title,
        messages: initialMessages,
        tagIds,
      };
    }
  }
  
  /**
   * Update a chat session
   */
  async updateSession(
    id: string,
    updates: {
      title?: string;
      messages?: ChatMessage[];
      tagIds?: string[];
    }
  ): Promise<void> {
    try {
      const updateVars: any = { id };
      
      if (updates.title !== undefined) {
        updateVars.title = updates.title;
      }
      
      if (updates.messages !== undefined) {
        updateVars.messages = JSON.stringify(updates.messages);
      }
      
      if (updates.tagIds !== undefined) {
        updateVars.tagIds = updates.tagIds;
      }
      
      await chatSessionSdkV2.update(updateVars);
    } catch (error) {
      console.error(`Error updating chat session ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a chat session
   */
  async deleteSession(id: string): Promise<void> {
    try {
      await chatSessionSdkV2.delete(id);
    } catch (error) {
      console.error(`Error deleting chat session ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a temporary in-memory session (for guest mode)
   */
  createTemporarySession(): ChatSession {
    return createEmptyChatSessionV2();
  }
  
  /**
   * Update session tags
   */
  async updateSessionTags(id: string, tags: Tag[]): Promise<void> {
    const tagIds = tags.filter(tag => tag.id).map(tag => tag.id!);
    await this.updateSession(id, { tagIds });
  }
  
  /**
   * Clear all messages in a session
   */
  async clearSessionMessages(id: string): Promise<void> {
    await this.updateSession(id, { messages: [] });
  }
  
  /**
   * Add a message to a session's message list
   */
  async addMessageToSession(
    id: string, 
    message: ChatMessage,
    allMessages: ChatMessage[]
  ): Promise<void> {
    await this.updateSession(id, { messages: allMessages });
  }
  
  /**
   * Update a specific message in a session
   */
  async updateSessionMessage(
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
    allMessages: ChatMessage[]
  ): Promise<void> {
    // We need to update the complete messages array, no patch update available
    const updatedMessages = allMessages.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    
    await this.updateSession(sessionId, { messages: updatedMessages });
  }
}

// Export singleton instance
export default new ChatSessionServiceV2(); 
