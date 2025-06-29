import { nanoid } from "nanoid";
import type {
  ChatSession,
  Message,
  MessageStatus,
  Tag,
  RecipeDetail,
} from "@diet/shared";
import type { StateCreator } from "zustand";
import { generateSessionTitle } from "./chat-utils";
import type { FullChatStore } from "./types";

// Utilities that depend on set/get will be defined inside factory

export interface ChatActionSlice {
  // core synchronous reducers / selectors
  addMessage: (message: Message) => void;
  clearSession: (sessionId: string) => void;
  createSession: () => string;
  createTemporarySession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  updateSessionTags: (tags: Tag[]) => void;
  updateMessageRecipeDetails: (
    messageId: string,
    recipeDetails: RecipeDetail[]
  ) => void;
  getCurrentSession: () => ChatSession | null;
  getCurrentMessages: () => Message[];
  getSessions: () => ChatSession[];
  canSendMessage: () => boolean;
  // expose internal utils for effects layer
  updateMessageStatus: (
    messageId: string,
    status: MessageStatus,
    extra?: Partial<Message>
  ) => void;
  updateCurrentSessionMessages: (
    updater: (messages: Message[]) => Message[]
  ) => void;
  updateLastAIMessageStatus: (
    status: MessageStatus,
    additionalProps?: Partial<Message>
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
      messageId: string,
      status: MessageStatus,
      additionalProps: Partial<Message> = {}
    ) => {
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
      additionalProps: Partial<Message> = {}
    ) => {
      set((state: FullChatStore) => {
        const currentMessages = get().getCurrentMessages();
        const updatedMessages = currentMessages.map((msg, idx, arr) =>
          !msg.isUser && idx === arr.length - 1
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

    updateCurrentSessionMessages: (updater: (msg: Message[]) => Message[]) => {
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
  const addMessage = (message: Message) => {
    const { currentSessionId, isTemporarySession } = get();

    // ensure session exists
    if (!currentSessionId) {
      const newId = createSession();
      set({ currentSessionId: newId });
    }

    sessionUtils.updateCurrentSession((session) => {
      let newTitle = session.title;
      if (session.title === "新对话") {
        newTitle = generateSessionTitle([...session.messages, message]);
      }
      return {
        ...session,
        messages: [...session.messages, message],
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
      updatedAt: new Date(),
    }));
  };

  const createSession = (): string => {
    const id = nanoid();
    const now = new Date();
    const newSession: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      currentTags: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state: FullChatStore) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: id,
    }));
    return id;
  };

  const createTemporarySession = (): string => {
    const id = nanoid();
    const now = new Date();
    const newSession: ChatSession = {
      id,
      title: "新对话",
      messages: [],
      currentTags: [],
      createdAt: now,
      updatedAt: now,
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
  };

  const renameSession = (sessionId: string, title: string) => {
    sessionUtils.updateSession(sessionId, (s) => ({
      ...s,
      title,
      updatedAt: new Date(),
    }));
  };

  const updateSessionTags = (tags: Tag[]) => {
    sessionUtils.updateCurrentSession((s) => ({
      ...s,
      currentTags: tags,
      updatedAt: new Date(),
    }));
  };

  const updateMessageRecipeDetails = (
    messageId: string,
    recipeDetails: RecipeDetail[]
  ) => {
    set((state: FullChatStore) => {
      const current = get().getCurrentMessages();
      const updated = current.map((m) =>
        m.id === messageId ? { ...m, recipeDetails } : m
      );
      return {
        sessions: state.sessions.map((s) =>
          s.id === state.currentSessionId ? { ...s, messages: updated } : s
        ),
      } as any;
    });
  };

  const getCurrentSession = () => {
    const { sessions, currentSessionId } = get();
    return currentSessionId
      ? sessions.find((s: ChatSession) => s.id === currentSessionId) || null
      : null;
  };

  const getCurrentMessages = () => {
    const session = getCurrentSession();
    return session ? session.messages : [];
  };

  const getSessions = () => {
    const { sessions, currentSessionId, isTemporarySession } = get();
    return sessions.filter(
      (s: ChatSession) => !(isTemporarySession && s.id === currentSessionId)
    );
  };

  const canSendMessage = () => {
    const { gettingIntent } = get();
    const messages = getCurrentMessages();
    if (messages.length === 0) return !gettingIntent;
    const last = messages[messages.length - 1];
    if (last.isUser) return false;
    if (last.status === "pending" || last.status === "streaming") return false;
    if (gettingIntent) return false;
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
    updateMessageRecipeDetails,
    getCurrentSession,
    getCurrentMessages,
    getSessions,
    canSendMessage,
    updateMessageStatus: messageUtils.updateMessageStatus,
    updateCurrentSessionMessages: messageUtils.updateCurrentSessionMessages,
    updateLastAIMessageStatus: messageUtils.updateLastAIMessageStatus,
  };
};
