import type { StateCreator } from "zustand";
import { getIntent } from "@/lib/api/chat-api";
import { toAIMessages } from "@/utils/chat-utils";
import type { FullChatStore } from "./types";

// 只拆分两大异步方法示例：abortCurrentMessage & sendMessage
export interface ChatEffectSlice {
  abortCurrentMessage: () => void;
  sendMessage: (content: string) => Promise<void>;
}

export const createChatEffects: StateCreator<
  FullChatStore,
  [],
  [],
  ChatEffectSlice
> = (set, get) => {
  return {
    abortCurrentMessage: () => {
      const { abortController } = get();
      if (abortController) {
        abortController.abort();
        set({ abortController: undefined, gettingIntent: false });
        get().updateLastAIMessageStatus("abort", { finishedAt: new Date() });
      }
    },

    sendMessage: async (content: string) => {
      const {
        handleUserMessage,
        getCurrentMessages,
        getCurrentSession,
        handleRecipeChatIntent,
        handleHealthAdviceChatIntent,
        handleChatIntent,
        handleError,
        canSendMessage,
        _persistSession,
      } = get();

      if (!canSendMessage()) {
        console.warn(
          "Message sending is currently disabled or already in progress"
        );
        return;
      }

      const authState = await import("@/store/auth-store").then((m) =>
        m.default.getState()
      );
      const { isGuestMode } = authState;
      const wasTemporarySession = get().isTemporarySession;

      // 1. 用户消息
      handleUserMessage(content);

      if (wasTemporarySession) {
        const session = getCurrentSession();
        if (session) {
          await _persistSession(session, true);
        }
      }

      const AIMessages = toAIMessages(
        [...getCurrentMessages()],
        getCurrentSession()?.currentTags || []
      );
      const controller = new AbortController();
      set({ abortController: controller });

      try {
        set({ gettingIntent: true });
        const intent = await getIntent(
          AIMessages,
          controller.signal,
          isGuestMode
        );
        set({ gettingIntent: false, abortController: undefined });

        switch (intent) {
          case "recipe":
            await handleRecipeChatIntent(AIMessages, isGuestMode);
            break;
          case "health_advice":
            await handleHealthAdviceChatIntent(AIMessages, isGuestMode);
            break;
          default:
            await handleChatIntent(AIMessages, isGuestMode);
        }
      } catch (error) {
        handleError(error, get().addMessage);
      }
    },
  };
};
