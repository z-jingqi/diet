import type { StateCreator } from "zustand";
import { getIntent } from "@/lib/api/chat-api";
import { toAIMessages } from "@/utils/chat-utils";
import type { FullChatStore } from "./types";
import { MessageStatus, MessageType } from "@/lib/gql/graphql";
import { chatSessionSdk } from "@/lib/gql/sdk/chat-session";

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
        get().updateLastAIMessageStatus(MessageStatus.Done);
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
        if (session && !isGuestMode) {
          try {
            const result = await chatSessionSdk.create({
              title: session.title ?? "",
              messages: JSON.stringify(session.messages),
              tagIds: session.tagIds ?? [],
            });
            const newSession = result.createChatSession;
            if (newSession) {
              set((state) => ({
                sessions: state.sessions.map((s) =>
                  s.id === session.id
                    ? {
                        ...s,
                        id: newSession.id,
                        createdAt: new Date(newSession.createdAt),
                        updatedAt: new Date(newSession.updatedAt),
                      }
                    : s
                ),
                currentSessionId:
                  state.currentSessionId === session.id
                    ? newSession.id
                    : state.currentSessionId,
              }));
            }
          } catch (err) {
            console.error("Failed to create chat session:", err);
          }
        }
      }
      const tagIds = getCurrentSession()?.tagIds || [];
      // TODO: 需要从 tagIds 中获取 tags
      const tags = tagIds.map((id) => ({ id }));
      const AIMessages = toAIMessages([...getCurrentMessages()], tags);
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
          case MessageType.Recipe:
            await handleRecipeChatIntent(AIMessages, isGuestMode);
            break;
          case MessageType.HealthAdvice:
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
