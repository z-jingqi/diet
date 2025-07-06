import {
  sendChatMessage,
  sendRecipeChatMessage,
  sendHealthAdviceChatMessage,
  getIntent,
} from "@/lib/api/chat-api";
import { ChatCompletionMessageParam } from "openai/resources";
import { MessageType } from "@/lib/gql/graphql";

/**
 * Service for handling chat messaging operations
 */
class ChatServiceV2 {
  /**
   * Get the intent of a user's message
   */
  async determineIntent(
    messages: ChatCompletionMessageParam[],
    abortSignal?: AbortSignal,
    isGuestMode = false
  ): Promise<MessageType> {
    try {
      return await getIntent(messages, abortSignal, isGuestMode);
    } catch (error) {
      console.error("Error determining intent:", error);
      // Default to regular chat if intent detection fails
      return MessageType.Chat;
    }
  }

  /**
   * Send a regular chat message
   */
  async sendChatMessage(
    messages: ChatCompletionMessageParam[],
    onChunk: (data: { response?: string; done: boolean }) => void,
    onError: (error: Error) => void,
    abortSignal?: AbortSignal,
    isGuestMode = false
  ): Promise<void> {
    return sendChatMessage(
      messages,
      onChunk,
      onError,
      abortSignal,
      isGuestMode
    );
  }

  /**
   * Send a recipe chat message
   */
  async sendRecipeMessage(
    messages: ChatCompletionMessageParam[],
    onChunk: (data: { response?: string; done: boolean }) => void,
    onError: (error: Error) => void,
    abortSignal?: AbortSignal,
    isGuestMode = false
  ): Promise<void> {
    return sendRecipeChatMessage(
      messages,
      onChunk,
      onError,
      abortSignal,
      isGuestMode
    );
  }

  /**
   * Send a health advice chat message
   */
  async sendHealthAdviceMessage(
    messages: ChatCompletionMessageParam[],
    onChunk: (data: { response?: string; done: boolean }) => void,
    onError: (error: Error) => void,
    abortSignal?: AbortSignal,
    isGuestMode = false
  ): Promise<void> {
    return sendHealthAdviceChatMessage(
      messages,
      onChunk,
      onError,
      abortSignal,
      isGuestMode
    );
  }
}

// Export singleton instance
export default new ChatServiceV2();
