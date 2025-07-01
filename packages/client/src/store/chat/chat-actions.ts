import { nanoid } from "nanoid";
import type { StateCreator } from "zustand";
import { generateSessionTitle } from "./chat-utils";
import type { FullChatStore } from "./types";
import type { ChatMessage, ChatSession, Tag } from "@/lib/gql/graphql";
import { MessageRole, MessageStatus } from "@/lib/gql/graphql";
import { chatSessionSdk } from "@/lib/gql/sdk/chat-session";
import useAuthStore from "@/store/auth-store";

// Utilities that depend on set/get will be defined inside factory

export interface ChatActionSlice {
  // core synchronous reducers / selectors
  addMessage: (message: ChatMessage) => void;
  clearSession: (sessionId: string) => void;
  createSession: () => string;
  createTemporarySession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  updateSessionTags: (tags: Tag[]) => void;
  getCurrentSession: () => ChatSession | null;
  getCurrentMessages: () => ChatMessage[];
  canSendMessage: () => boolean;
  // expose internal utils for effects layer
  updateMessageStatus: (
    messageId: string | undefined | null,
    status: MessageStatus,
    extra?: Partial<ChatMessage>
  ) => void;
  updateCurrentSessionMessages: (
    updater: (messages: ChatMessage[]) => ChatMessage[]
  ) => void;
  updateLastAIMessageStatus: (
    status: MessageStatus,
    additionalProps?: Partial<ChatMessage>
  ) => void;
}

export const createChatActions: StateCreator<
  FullChatStore,
  [],
  [],
  ChatActionSlice
> = (set, get) => {
  /* ---------------- message utils (local) ---------------- */
  const messageUtils = {
    updateMessageStatus: (
      messageId: string | undefined | null,
      status: MessageStatus,
      additionalProps: Partial<ChatMessage> = {}
    ) => {
      if (!messageId) {
        return;
      }
      set((state: FullChatStore) => {
        const current = get().getCurrentMessages();
        const updated = current.map((msg) =>
          msg.id === messageId ? { ...msg, status, ...additionalProps } : msg
        );
        const sessions = state.sessions.map((s) =>
          s.id === state.currentSessionId ? { ...s, messages: updated } : s
        );
        return { sessions } as any;
      });
    },

    updateLastAIMessageStatus: (
      status: MessageStatus,
      additionalProps: Partial<ChatMessage> = {}
    ) => {
      set((state: FullChatStore) => {
        const currentMessages = get().getCurrentMessages();
        const updatedMessages = currentMessages.map((msg, idx, arr) =>
          msg.role !== MessageRole.User && idx === arr.length - 1
            ? { ...msg, status, ...additionalProps }
            : msg
        );

        return {
          sessions: state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: updatedMessages }
              : session
          ),
        };
      });
    },

    updateCurrentSessionMessages: (
      updater: (msg: ChatMessage[]) => ChatMessage[]
    ) => {
      set((state: FullChatStore) => {
        const current = get().getCurrentMessages();
        const updated = updater(current);
        const sessions = state.sessions.map((s) =>
          s.id === state.currentSessionId ? { ...s, messages: updated } : s
        );
        return { sessions } as any;
      });
    },
  };

  /* ---------------- session utils (local) ---------------- */
  const sessionUtils = {
    updateSession: (
      sessionId: string,
      updater: (session: ChatSession) => ChatSession
    ) => {
      set((state: FullChatStore) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? updater(s) : s
        ),
      }));
    },
    updateCurrentSession: (updater: (session: ChatSession) => ChatSession) => {
      set((state: FullChatStore) => ({
        sessions: state.sessions.map((s) =>
          s.id === state.currentSessionId ? updater(s) : s
        ),
      }));
    },
  };

  /* ---------------- reducers ---------------- */
  const addMessage = (message: ChatMessage) => {
    const { currentSessionId, isTemporarySession } = get();

    // ensure session exists
    if (!currentSessionId) {
      const newId = createSession();
      set({ currentSessionId: newId });
    }

    sessionUtils.updateCurrentSession((session) => {
      let newTitle = session.title;
      if (session.title === "新对话") {
        newTitle = generateSessionTitle([...(session.messages || []), message]);
      }
      return {
        ...session,
        messages: [...(session.messages || []), message],
        updatedAt: new Date(),
        title: newTitle,
      };
    });

    if (isTemporarySession) {
      set({ isTemporarySession: false });
    }
  };

  const clearSession = (sessionId: string) => {
    sessionUtils.updateSession(sessionId, (session) => ({
      ...session,
      messages: [],
    }));

    // 后端更新
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session && !get().isTemporarySession) {
      void chatSessionSdk
        .update({ id: sessionId, messages: "[]" })
        .catch((e) => console.error("clearSession update error", e));
    }
  };

  const createSession = (): string => {
    const id = nanoid();
    const newSession: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    // 先本地写入，保证 UI 及时更新
    set((state: FullChatStore) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: id,
    }));

    // 若已登录且非游客模式，立即持久化
    const { isAuthenticated, isGuestMode } = useAuthStore.getState();
    if (isAuthenticated && !isGuestMode) {
      void chatSessionSdk
        .create({
          title: newSession.title ?? "",
          messages: JSON.stringify(newSession.messages),
          tagIds: newSession.tagIds ?? [],
        })
        .then((result) => {
          const created = result.createChatSession;
          if (created) {
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === newSession.id
                  ? {
                      ...s,
                      id: created.id,
                      createdAt: new Date(created.createdAt),
                      updatedAt: new Date(created.updatedAt),
                    }
                  : s
              ),
              currentSessionId:
                state.currentSessionId === newSession.id
                  ? created.id
                  : state.currentSessionId,
            }));
          }
        })
        .catch((err) => console.error("createSession create error", err));
    }

    return id;
  };

  const createTemporarySession = (): string => {
    const id = nanoid();
    const now = new Date();
    const newSession: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      tagIds: [],
      createdAt: now,
    };
    set((state: FullChatStore) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: id,
      isTemporarySession: true,
    }));
    return id;
  };

  const switchSession = (sessionId: string) => {
    const { isTemporarySession, currentSessionId } = get();
    if (
      isTemporarySession &&
      currentSessionId &&
      currentSessionId !== sessionId
    ) {
      set((state: FullChatStore) => ({
        sessions: state.sessions.filter((s) => s.id !== currentSessionId),
        currentSessionId: sessionId,
        isTemporarySession: false,
      }));
      return;
    }
    set({ currentSessionId: sessionId, isTemporarySession: false });
  };

  const deleteSession = (sessionId: string) => {
    set((state: FullChatStore) => {
      const updated = state.sessions.filter((s) => s.id !== sessionId);
      return {
        sessions: updated,
        currentSessionId: updated.length ? updated[0].id : null,
      } as any;
    });

    const { isAuthenticated, isGuestMode } = useAuthStore.getState();
    if (!isAuthenticated || isGuestMode) {
      return;
    }

    // 向后端删除（忽略结果）
    void chatSessionSdk
      .delete(sessionId)
      .catch((err) => console.error("deleteSession error", err));
  };

  const renameSession = (sessionId: string, title: string) => {
    sessionUtils.updateSession(sessionId, (s) => ({
      ...s,
      title,
    }));

    const session = get().sessions.find((s) => s.id === sessionId);
    if (session && !get().isTemporarySession) {
      void chatSessionSdk
        .update({ id: sessionId, title })
        .catch((e) => console.error("renameSession update error", e));
    }
  };

  const updateSessionTags = (tags: Tag[]) => {
    const tagIds = tags.flatMap((t) => (t.id ? [t.id] : []));
    sessionUtils.updateCurrentSession((s) => ({
      ...s,
      tagIds,
    }));

    const session = get().getCurrentSession();
    if (session && !get().isTemporarySession) {
      void chatSessionSdk
        .update({ id: session.id!, tagIds })
        .catch((e) => console.error("updateSessionTags update error", e));
    }
  };

  const getCurrentSession = () => {
    const { sessions, currentSessionId } = get();
    return currentSessionId
      ? sessions.find((s: ChatSession) => s.id === currentSessionId) || null
      : null;
  };

  const getCurrentMessages = () => {
    const session = getCurrentSession();
    return session?.messages?.length ? session.messages : [];
  };

  const canSendMessage = () => {
    const { gettingIntent } = get();
    const messages = getCurrentMessages();
    if (messages.length === 0) {
      return !gettingIntent;
    }
    const last = messages[messages.length - 1];
    if (last.role === MessageRole.User) {
      return false;
    }
    if (
      last.status === MessageStatus.Pending ||
      last.status === MessageStatus.Streaming
    ) {
      return false;
    }
    if (gettingIntent) {
      return false;
    }
    return true;
  };

  return {
    addMessage,
    clearSession,
    createSession,
    createTemporarySession,
    switchSession,
    deleteSession,
    renameSession,
    updateSessionTags,
    getCurrentSession,
    getCurrentMessages,
    canSendMessage,
    updateMessageStatus: messageUtils.updateMessageStatus,
    updateCurrentSessionMessages: messageUtils.updateCurrentSessionMessages,
    updateLastAIMessageStatus: messageUtils.updateLastAIMessageStatus,
  };
};
