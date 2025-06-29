import { create } from "zustand";
import { buildMessage, buildUserMessage } from "@/utils/message-builder";
import type { Message, ChatSession, Tag, RecipeDetail } from "@diet/shared";
import {
  sendChatMessage,
  sendRecipeChatMessage,
  sendHealthAdviceChatMessage,
} from "@/lib/api/chat-api";
import { extractRecipeDetails } from "@/utils/recipe-parser";
import { ChatCompletionMessageParam } from "openai/resources";
import useAuthStore from "@/store/auth-store";
import { graphqlClient } from "@/lib/gql/client";
import {
  CreateChatSessionDocument,
  UpdateChatSessionDocument,
  type CreateChatSessionMutation,
  type CreateChatSessionMutationVariables,
  type UpdateChatSessionMutationVariables,
} from "@/lib/gql/graphql";
import { initialChatState } from "./chat/chat-state";
import { generateSessionTitle } from "./chat/chat-utils";
import { createChatActions, ChatActionSlice } from "./chat/chat-actions";
import { createChatEffects, ChatEffectSlice } from "./chat/chat-effects";

interface ChatState {
  // --- core data ---
  sessions: ChatSession[];
  currentSessionId: string | null;
  gettingIntent: boolean;
  isTemporarySession: boolean;
  isLoading: boolean;
  error: string | null;

  // --- async/effects provided by chat-effects ---
  sendMessage: (content: string) => Promise<void>;
  abortCurrentMessage: () => void;

  // --- high-level handlers (remain in chat-store) ---
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

  // --- util & persistence ---
  generateSessionTitle: (messages: Message[]) => string;
  loadSessionsFromGraphQL: (graphqlSessions: any[]) => void;
  _persistSession: (session: ChatSession, isNew: boolean) => Promise<void>;
}

const useChatStore = create<
  ChatState &
    ChatActionSlice &
    ChatEffectSlice & {
      abortController?: AbortController;
    }
>((set, get, api) => {
  return {
    ...initialChatState,
    abortController: undefined,
    generateSessionTitle,

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
        const { updateCurrentSessionMessages, updateMessageStatus } = get();
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
              updateCurrentSessionMessages((messages) =>
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
        updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
          recipeDetails: recipeDetails,
        });

        // 持久化会话更新
        const currentSession = get().getCurrentSession();
        if (currentSession) {
          await get()._persistSession(currentSession, false);
        }
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          get().updateLastAIMessageStatus("error", {
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
              get().updateCurrentSessionMessages((messages) =>
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
        get().updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
        });

        // 持久化会话更新
        const currentSession = get().getCurrentSession();
        if (currentSession) {
          await get()._persistSession(currentSession, false);
        }
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          get().updateLastAIMessageStatus("error", {
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
              get().updateCurrentSessionMessages((messages) =>
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
        get().updateMessageStatus(message.id, "done", {
          finishedAt: new Date(),
        });

        // 持久化会话更新
        const currentSession = get().getCurrentSession();
        if (currentSession) {
          await get()._persistSession(currentSession, false);
        }
      } catch (error) {
        set({ abortController: undefined });
        // 检查是否是因为abort导致的错误
        const isAbortError =
          error instanceof Error && error.name === "AbortError";

        if (!isAbortError) {
          // 使用公共方法更新最后一条AI消息状态为错误
          get().updateLastAIMessageStatus("error", {
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
          get().updateLastAIMessageStatus("error", {
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

    // 内部辅助：将当前会话持久化到后端
    _persistSession: async (session: ChatSession, isNew: boolean) => {
      // 仅在已登录且非游客模式下持久化
      const { isAuthenticated, isGuestMode, user } = useAuthStore.getState();
      if (!isAuthenticated || isGuestMode || !user || !user.id) {
        return;
      }

      try {
        if (isNew) {
          // 创建会话
          const variables: CreateChatSessionMutationVariables = {
            userId: user.id as string,
            title: session.title,
            messages: JSON.stringify(session.messages),
            currentTags: JSON.stringify(session.currentTags ?? []),
          };
          const result = await graphqlClient.request<CreateChatSessionMutation>(
            CreateChatSessionDocument,
            variables
          );

          const newId = result.createChatSession?.id;
          if (newId) {
            // 更新本地会话 ID
            set((state) => ({
              sessions: state.sessions.map((s) =>
                s.id === session.id ? { ...s, id: newId } : s
              ),
              currentSessionId:
                state.currentSessionId === session.id
                  ? newId
                  : state.currentSessionId,
            }));
          }
        } else {
          // 更新会话
          const variables: UpdateChatSessionMutationVariables = {
            id: session.id,
            title: session.title,
            messages: JSON.stringify(session.messages),
            currentTags: JSON.stringify(session.currentTags ?? []),
          };
          await graphqlClient.request(UpdateChatSessionDocument, variables);
        }
      } catch (err) {
        console.error("Failed to persist chat session:", err);
      }
    },

    // 挂载同步 actions与异步 effects
    ...createChatActions(set, get, api),
    ...createChatEffects(set, get, api),
  };
});

export default useChatStore;
