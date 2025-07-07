import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthenticatedClient } from "@/lib/gql/client";
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  User,
  useRegisterMutation,
  type LoginMutationVariables,
  type LogoutMutationVariables,
  type RegisterMutationVariables,
} from "@/lib/gql/graphql";

// 1. 定义状态接口
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  isLoading: boolean;
  error: string | null;
}

// 2. 定义行为接口
interface AuthActions {
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

  // 清除 session
  clearSession: () => void;
}

// 3. 合并完整的Store类型
export type AuthStore = AuthState & AuthActions;

// 4. 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuestMode: false,
  isLoading: false,
  error: null,
};

// 获取认证客户端
function getAuthClient() {
  return createAuthenticatedClient();
}

// 5. 创建行为工厂函数 - 提供静态引用点
const createAuthActions = (set: any, get: any): AuthActions => ({
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = getAuthClient();
      const variables: LoginMutationVariables = { username, password };

      // 使用生成的 mutation fetcher
      const result = await useLoginMutation.fetcher(client, variables)();

      if (!result.login) {
        throw new Error("登录失败");
      }

      const { user } = result.login;

      set({
        user: user as User,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "登录失败",
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

      const res = await useRegisterMutation.fetcher(client, variables)();

      if (!res.register || !res.register.user) {
        throw new Error("注册失败");
      }

      set({
        user: res.register.user as User,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "注册失败",
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
      console.error("Logout error:", error);
    } finally {
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
      const client = getAuthClient();

      // 使用生成的 query fetcher
      const result = await useGetMeQuery.fetcher(client)();

      if (!result.me) {
        throw new Error("获取用户信息失败");
      }

      set({
        user: result.me as User,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
    } catch {
      // 获取用户信息失败，说明未登录
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

  clearSession: () => {
    // 清除 session token
  },
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const authSelectors = {
  // 状态选择器
  user: (state: AuthStore) => state.user,
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,
  isGuestMode: (state: AuthStore) => state.isGuestMode,
  isLoading: (state: AuthStore) => state.isLoading,
  error: (state: AuthStore) => state.error,

  // 行为选择器
  login: (state: AuthStore) => state.login,
  register: (state: AuthStore) => state.register,
  logout: (state: AuthStore) => state.logout,
  checkAuth: (state: AuthStore) => state.checkAuth,
  enableGuest: (state: AuthStore) => state.enableGuest,
  canUseFeatures: (state: AuthStore) => state.canUseFeatures,
  requireAuth: (state: AuthStore) => state.requireAuth,
  clearError: (state: AuthStore) => state.clearError,
  clearSession: (state: AuthStore) => state.clearSession,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const useAuth = () => {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isGuestMode = useAuthStore(authSelectors.isGuestMode);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const error = useAuthStore(authSelectors.error);

  const login = useAuthStore(authSelectors.login);
  const register = useAuthStore(authSelectors.register);
  const logout = useAuthStore(authSelectors.logout);
  const checkAuth = useAuthStore(authSelectors.checkAuth);
  const enableGuest = useAuthStore(authSelectors.enableGuest);
  const canUseFeatures = useAuthStore(authSelectors.canUseFeatures);
  const requireAuth = useAuthStore(authSelectors.requireAuth);
  const clearError = useAuthStore(authSelectors.clearError);
  const clearSession = useAuthStore(authSelectors.clearSession);

  return {
    // 状态
    user,
    isAuthenticated,
    isGuestMode,
    isLoading,
    error,

    // 行为
    login,
    register,
    logout,
    checkAuth,
    enableGuest,
    canUseFeatures,
    requireAuth,
    clearError,
    clearSession,
  };
};

// 8. 创建Store
const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createAuthActions(set, get),
    }),
    {
      name: "auth-store",
    }
  )
);

export default useAuthStore;
