import { create } from "zustand";
import { User } from "@diet/shared";
import { graphqlClient, createAuthenticatedClient } from "@/lib/gql/client";
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  type LoginMutationVariables,
  type LogoutMutationVariables,
  type RegisterMutationVariables
} from "@/lib/gql/graphql";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 认证方法
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  enableGuest: () => void;
  
  // 状态检查
  canUseFeatures: () => boolean;
  requireAuth: () => boolean;
  
  // 清除错误
  clearError: () => void;
}

// 获取认证客户端
function getAuthClient() {
  const sessionToken = localStorage.getItem('session_token');
  return sessionToken ? createAuthenticatedClient(sessionToken) : graphqlClient;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuestMode: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = getAuthClient();
      const variables: LoginMutationVariables = { username, password };
      
      // 使用生成的 mutation fetcher
      const result = await useLoginMutation.fetcher(client, variables)();
      
      if (!result.login) {
        throw new Error('登录失败');
      }
      
      const { user, sessionToken, csrfToken } = result.login;
      
      // 保存 tokens
      if (sessionToken) {
        localStorage.setItem('session_token', sessionToken);
      }
      if (csrfToken) {
        localStorage.setItem('csrf_token', csrfToken);
      }
      
      set({
        user: user as User,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '登录失败',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = getAuthClient();
      const variables: RegisterMutationVariables = { username, password };
      
      // 使用生成的 mutation fetcher
      await useRegisterMutation.fetcher(client, variables)();
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '注册失败',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const client = getAuthClient();
      const variables: LogoutMutationVariables = {};
      
      // 使用生成的 mutation fetcher
      await useLogoutMutation.fetcher(client, variables)();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 清除本地存储
      localStorage.removeItem('session_token');
      localStorage.removeItem('csrf_token');
      
      set({
        user: null,
        isAuthenticated: false,
        isGuestMode: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        set({
          user: null,
          isAuthenticated: false,
          isGuestMode: false,
          isLoading: false,
        });
        return;
      }

      const client = getAuthClient();
      
      // 使用生成的 query fetcher
      const result = await useGetMeQuery.fetcher(client)();
      
      if (!result.me) {
        throw new Error('获取用户信息失败');
      }
      
      set({
        user: result.me as User,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
    } catch {
      // 获取用户信息失败，说明未登录
      localStorage.removeItem('session_token');
      localStorage.removeItem('csrf_token');
      
      set({
        user: null,
        isAuthenticated: false,
        isGuestMode: false,
        isLoading: false,
      });
    }
  },

  enableGuest: () => {
    set({
      user: null,
      isAuthenticated: false,
      isGuestMode: true,
      isLoading: false,
    });
  },

  canUseFeatures: () => {
    const { isAuthenticated } = get();
    return isAuthenticated;
  },

  requireAuth: () => {
    const { isAuthenticated } = get();
    return !isAuthenticated;
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore; 
