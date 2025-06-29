import { create } from "zustand";
import { buildMessage, buildUserMessage } from "@/utils/message-builder";
import { toAIMessages } from "@/utils/chat-utils";
import type {
  Message,
  ChatSession,
  Tag,
  MessageStatus,
  RecipeDetail,
} from "@diet/shared";
import {
  getIntent,
  sendChatMessage,
  sendRecipeChatMessage,
  sendHealthAdviceChatMessage,
} from "@/lib/api/chat-api";
import { extractRecipeDetails } from "@/utils/recipe-parser";
import { nanoid } from "nanoid";
import { ChatCompletionMessageParam } from "openai/resources";

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  gettingIntent: boolean; // 正在获取意图的状态
  isTemporarySession: boolean; // 当前是否为临时会话
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearSession: (sessionId: string) => void;
  canSendMessage: () => boolean;
  // 会话管理方法
  createSession: () => string;
  createTemporarySession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, title: string) => void;
  updateSessionTags: (tags: Tag[]) => void;
  getCurrentSession: () => ChatSession | null;
  getCurrentMessages: () => Message[];
  getSessions: () => ChatSession[];
  // 新增：从 GraphQL 加载会话
  loadSessionsFromGraphQL: (graphqlSessions: any[]) => void;
  // 消息更新方法
  updateMessageRecipeDetails: (
    messageId: string,
    recipeDetails: RecipeDetail[]
  ) => void;
  // 工具方法
  generateSessionTitle: (messages: Message[]) => string;
  // 私有方法（重构后的内部方法）
  handleUserMessage: (content: string) => void;
  handleRecipeChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleHealthAdviceChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleChatIntent: (
    AIMessages: ChatCompletionMessageParam[],
    isGuestMode?: boolean
  ) => Promise<void>;
  handleError: (error: unknown, addMessage: (message: Message) => void) => void;
}

const useChatStore = create<
  ChatState & {
    abortController?: AbortController;
    abortCurrentMessage: () => void;
  }
>((set, get) => {
  // 消息更新工具方法
  const messageUtils = {
    // 更新指定消息的状态和属性
    updateMessageStatus: (
      messageId: string,
      status: MessageStatus,
      additionalProps: Partial<Message> = {}
    ) => {
      set((state) => {
        const currentMessages = get().getCurrentMessages();
        const updatedMessages = currentMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status, ...additionalProps } : msg
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

    // 更新最后一条AI消息的状态和属性
    updateLastAIMessageStatus: (
      status: MessageStatus,
      additionalProps: Partial<Message> = {}
    ) => {
      set((state) => {
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

    // 更新当前会话的消息
    updateCurrentSessionMessages: (
      updater: (messages: Message[]) => Message[]
    ) => {
      set((state) => {
        const currentMessages = get().getCurrentMessages();
        const updatedMessages = updater(currentMessages);

        return {
          sessions: state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: updatedMessages }
              : session
          ),
        };
      });
    },
  };

  // 会话管理工具方法
  const sessionUtils = {
    // 更新指定会话
    updateSession: (
      sessionId: string,
      updater: (session: ChatSession) => ChatSession
    ) => {
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId ? updater(session) : session
        ),
      }));
    },

    // 更新当前会话
    updateCurrentSession: (updater: (session: ChatSession) => ChatSession) => {
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === state.currentSessionId ? updater(session) : session
        ),
      }));
    },

    // 清空指定会话的消息
    clearSessionMessages: (sessionId: string) => {
      sessionUtils.updateSession(sessionId, (session) => ({
        ...session,
        messages: [],
        updatedAt: new Date(),
      }));
    },

    // 清空当前会话的消息
    clearCurrentSessionMessages: () => {
      sessionUtils.updateCurrentSession((session) => ({
        ...session,
        messages: [],
        updatedAt: new Date(),
      }));
    },
  };

  return {
    sessions: [],
    currentSessionId: null,
    gettingIntent: false,
    isTemporarySession: false,
    isLoading: false,
    error: null,
    abortController: undefined,

    addMessage: (message) => {
      const { currentSessionId, isTemporarySession, generateSessionTitle } =
        get();
      if (!currentSessionId) {
        // 如果没有当前会话，创建一个新会话
        const newSessionId = get().createSession();
        set({ currentSessionId: newSessionId });
      }

      // 使用公共方法更新当前会话，添加消息
      sessionUtils.updateCurrentSession((session) => {
        let newTitle = session.title;

        // 如果session使用的是默认标题，从消息数组生成新标题
        if (session.title === "新对话") {
          const allMessages = [...session.messages, message];
          newTitle = generateSessionTitle(allMessages);
        }

        return {
          ...session,
          messages: [...session.messages, message],
          updatedAt: new Date(),
          title: newTitle,
        };
      });

      // 如果当前是临时会话，发送任意消息后将其转为正式会话
      if (isTemporarySession) {
        set({ isTemporarySession: false });
      }
    },

    abortCurrentMessage: () => {
      const { abortController } = get();
      if (abortController) {
        abortController.abort();
        set({ abortController: undefined, gettingIntent: false });

        // 使用公共方法更新最后一条AI消息状态
        messageUtils.updateLastAIMessageStatus("abort", {
          finishedAt: new Date(),
        });
      }
    },

    // 处理用户消息和标签更新
    handleUserMessage: (content: string) => {
      const { addMessage } = get();

      // 1. 先把用户消息加到本地消息队列（保持原始内容）
      const userMessage = buildUserMessage(content);
      addMessage(userMessage);
    },

    // 处理菜谱聊天意图
    handleRecipeChatIntent: async (
      AIMessages: ChatCompletionMessageParam[],
      isGuestMode = false
    ) => {
      const { addMessage } = get();
      const message = buildMessage("recipe");
      message.status = "streaming";
      addMessage(message);

      const newController = new AbortController();
      set({ abortController: newController });

      let result = "";

      try {
        await sendRecipeChatMessage(
          AIMessages,
          (data) => {
            // 检查流是否结束
            if (data.done) {
              set({ abortController: undefined });
              return;
            }

            if (data.response !== null && data.response !== undefined) {
              result += data.response;

              // 使用公共方法更新消息内容
              messageUtils.updateCurrentSessionMessages((messages) =>
                messages.map((msg) => {
                  if (msg.id === message.id) {
                    return { ...msg, content: result };
                  }
                  return msg;
                })
              );
            }
          },
          (error: Error) => {
            set({ abortController: undefined });
            throw error;
          },
          newController.signal,
          isGuestMode
        );

        set({ abortController: undefined });

        // 使用公共方法更新消息状态为完成，并添加recipeDetails
        const recipeDetails = extractRecipeDetails(result);
        messageUtils.updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
          recipeDetails: recipeDetails,
        });
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          messageUtils.updateLastAIMessageStatus("error", {
            finishedAt: new Date(),
          });
        }
        throw error;
      }
    },

    // 处理健康建议聊天意图
    handleHealthAdviceChatIntent: async (
      AIMessages: ChatCompletionMessageParam[],
      isGuestMode = false
    ) => {
      const { addMessage } = get();
      const message = buildMessage("health_advice");
      message.status = "streaming";
      addMessage(message);

      const newController = new AbortController();
      set({ abortController: newController });

      let result = "";

      try {
        await sendHealthAdviceChatMessage(
          AIMessages,
          (data) => {
            // 检查流是否结束
            if (data.done) {
              set({ abortController: undefined });
              return;
            }

            if (data.response !== null && data.response !== undefined) {
              result += data.response;

              // 使用公共方法更新消息内容
              messageUtils.updateCurrentSessionMessages((messages) =>
                messages.map((msg) => {
                  if (msg.id === message.id) {
                    return { ...msg, content: result };
                  }
                  return msg;
                })
              );
            }
          },
          (error: Error) => {
            set({ abortController: undefined });
            throw error;
          },
          newController.signal,
          isGuestMode
        );

        set({ abortController: undefined });

        // 使用公共方法更新消息状态为完成
        messageUtils.updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
        });
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          messageUtils.updateLastAIMessageStatus("error", {
            finishedAt: new Date(),
          });
        }
        throw error;
      }
    },

    // 处理聊天意图
    handleChatIntent: async (
      AIMessages: ChatCompletionMessageParam[],
      isGuestMode = false
    ) => {
      const { addMessage } = get();
      const message = buildMessage("chat");
      message.status = "streaming";
      addMessage(message);

      const newController = new AbortController();
      set({ abortController: newController });

      let result = "";

      try {
        await sendChatMessage(
          AIMessages,
          (data) => {
            // 检查流是否结束
            if (data.done) {
              set({ abortController: undefined });
              return;
            }

            if (data.response !== null && data.response !== undefined) {
              result += data.response;

              // 使用公共方法更新消息内容
              messageUtils.updateCurrentSessionMessages((messages) =>
                messages.map((msg) => {
                  if (msg.id === message.id) {
                    return { ...msg, content: result };
                  }
                  return msg;
                })
              );
            }
          },
          (error: Error) => {
            set({ abortController: undefined });
            throw error;
          },
          newController.signal,
          isGuestMode
        );

        set({ abortController: undefined });

        // 使用公共方法更新消息状态为完成
        messageUtils.updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
        });
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          messageUtils.updateLastAIMessageStatus("error", {
            finishedAt: new Date(),
          });
        }
        throw error;
      }
    },

    // 处理错误
    handleError: (error: unknown, addMessage: (message: Message) => void) => {
      console.error("Error:", error);
      set({ gettingIntent: false, abortController: undefined });

      // 检查是否是因为abort导致的错误
      const isAbortError =
        error instanceof Error && error.name === "AbortError";

      // 检查是否已经有 AI 消息（可能是在 getIntent 之后添加的）
      const { getCurrentMessages } = get();
      const messages = getCurrentMessages();
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && !lastMessage.isUser) {
        // 如果最后一条是 AI 消息，且不是因为abort导致的错误，才标记为 error
        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          messageUtils.updateLastAIMessageStatus("error", {
            finishedAt: new Date(),
          });
        }
      } else {
        // 如果没有 AI 消息（比如 getIntent 失败），且不是因为abort导致的错误，才添加错误消息
        if (!isAbortError) {
          const errorMessage = buildMessage("chat");
          errorMessage.status = "error";
          errorMessage.content = "抱歉，处理您的消息时出现了问题，请重试。";
          errorMessage.finishedAt = new Date();
          addMessage(errorMessage);
        }
      }
    },

    sendMessage: async (content: string) => {
      const {
        addMessage,
        handleUserMessage,
        getCurrentMessages,
        getCurrentSession,
        handleRecipeChatIntent,
        handleHealthAdviceChatIntent,
        handleChatIntent,
        handleError,
        canSendMessage,
      } = get();

      // 防重复调用保护
      if (!canSendMessage()) {
        console.warn(
          "Message sending is currently disabled or already in progress"
        );
        return;
      }

      // 获取游客模式状态
      const { isGuestMode } = await import("@/store/auth-store").then((m) =>
        m.default.getState()
      );

      // 1. 处理用户消息和标签更新
      handleUserMessage(content);

      // 2. 组装上下文（所有历史消息+当前用户消息）
      const allMessages = [...getCurrentMessages()];
      const currentTags = getCurrentSession()?.currentTags || [];
      const AIMessages = toAIMessages(allMessages, currentTags);

      // 3. 创建 AbortController
      const controller = new AbortController();
      set({ abortController: controller });

      try {
        // 4. 获取意图
        set({ gettingIntent: true });
        const intent = await getIntent(
          AIMessages,
          controller.signal,
          isGuestMode
        );
        set({ gettingIntent: false, abortController: undefined });

        // 5. 根据意图处理消息
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
        handleError(error, addMessage);
      }
    },

    clearSession: (sessionId: string) => {
      // 使用公共方法清空指定会话的消息
      sessionUtils.clearSessionMessages(sessionId);
    },

    canSendMessage: () => {
      const { getCurrentMessages, gettingIntent } = get();
      const messages = getCurrentMessages();
      if (messages.length === 0) {
        return !gettingIntent;
      }
      const last = messages[messages.length - 1];
      // 如果最后一条是用户消息，说明AI还没回复
      if (last.isUser) {
        return false;
      }
      // 如果最后一条AI消息还在处理中
      if (last.status === "pending" || last.status === "streaming") {
        return false;
      }
      // 如果正在获取意图，也不能发送消息
      if (gettingIntent) {
        return false;
      }
      return true;
    },

    createSession: () => {
      const id = nanoid();
      const now = new Date();

      const newSession: ChatSession = {
        id,
        title: "新对话", // 默认标题，会在添加第一个用户消息时更新
        messages: [],
        currentTags: [],
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        sessions: [...state.sessions, newSession],
        currentSessionId: id,
      }));
      return id;
    },

    createTemporarySession: () => {
      const id = nanoid();
      const now = new Date();

      const newSession: ChatSession = {
        id,
        title: "新对话", // 默认标题，会在添加第一个用户消息时更新
        messages: [],
        currentTags: [],
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({
        sessions: [...state.sessions, newSession],
        currentSessionId: id,
        isTemporarySession: true,
      }));
      return id;
    },

    switchSession: (sessionId: string) => {
      const { sessions, isTemporarySession, currentSessionId } = get();

      // 如果当前是临时会话且要切换到其他会话，删除临时会话
      if (
        isTemporarySession &&
        currentSessionId &&
        currentSessionId !== sessionId
      ) {
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.id !== currentSessionId
          ),
          currentSessionId: sessionId,
          isTemporarySession: false,
        }));
        return;
      }

      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        set({
          currentSessionId: sessionId,
          isTemporarySession: false,
        });
      }
    },

    deleteSession: (sessionId: string) => {
      set((state) => {
        const updatedSessions = state.sessions.filter(
          (session) => session.id !== sessionId
        );
        const newCurrentSessionId =
          updatedSessions.length > 0 ? updatedSessions[0].id : null;

        return {
          sessions: updatedSessions,
          currentSessionId: newCurrentSessionId,
        };
      });
    },

    renameSession: (sessionId: string, title: string) => {
      // 使用公共方法更新指定会话的标题
      sessionUtils.updateSession(sessionId, (session) => ({
        ...session,
        title,
        updatedAt: new Date(),
      }));
    },

    getCurrentSession: () => {
      const { sessions, currentSessionId } = get();
      return currentSessionId
        ? sessions.find((session) => session.id === currentSessionId) || null
        : null;
    },

    getCurrentMessages: () => {
      const { sessions, currentSessionId } = get();
      const session = sessions.find((s) => s.id === currentSessionId);
      return session ? session.messages : [];
    },

    getSessions: () => {
      const { sessions, currentSessionId, isTemporarySession } = get();
      // 过滤掉临时会话：如果当前会话是临时会话，则不包含在返回的列表中
      return sessions.filter((session) => {
        if (isTemporarySession && session.id === currentSessionId) {
          return false;
        }
        return true;
      });
    },

    updateSessionTags: (tags: Tag[]) => {
      // 使用公共方法更新当前会话的标签
      sessionUtils.updateCurrentSession((session) => ({
        ...session,
        currentTags: tags,
        updatedAt: new Date(),
      }));
    },

    updateMessageRecipeDetails: (
      messageId: string,
      recipeDetails: RecipeDetail[]
    ) => {
      set((state) => {
        const currentMessages = get().getCurrentMessages();
        const updatedMessages = currentMessages.map((msg) =>
          msg.id === messageId ? { ...msg, recipeDetails } : msg
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

    generateSessionTitle: (messages: Message[]) => {
      // 找到第一个用户消息
      const firstUserMessage = messages.find((msg) => msg.isUser);

      if (!firstUserMessage || !firstUserMessage.content) {
        return "新对话";
      }

      // 取前20个字符作为标题，如果超过20个字符则加上省略号
      const maxLength = 20;
      const content = firstUserMessage.content.trim();

      if (content.length <= maxLength) {
        return content;
      } else {
        return content.substring(0, maxLength) + "...";
      }
    },

    // 新增：从 GraphQL 加载会话
    loadSessionsFromGraphQL: (graphqlSessions: any[]) => {
      const convertedSessions: ChatSession[] = graphqlSessions.map(
        (session) => ({
          id: session.id,
          title: session.title || "新对话",
          messages: session.messages || [],
          currentTags: session.currentTags || [],
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        })
      );

      if (convertedSessions.length > 0) {
        // 仅当后端返回了会话列表时才覆盖本地会话
        set((state) => ({
          sessions: convertedSessions,
          // 如果没有当前会话且加载的会话不为空，选择第一个会话
          currentSessionId: state.currentSessionId || convertedSessions[0].id,
          isTemporarySession: false,
        }));
      }
    },
  };
});

export default useChatStore;
