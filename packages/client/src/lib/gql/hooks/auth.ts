import { useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedClient, graphqlClient } from "../client";
import { QUERY_KEYS } from "./common";
import {
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} from "../graphql";

// 获取当前用户信息
export function useMe() {
  const client = createAuthenticatedClient();
  const result = useGetMeQuery(client);

  return {
    ...result,
    isAuthenticated: !!result.data?.me,
  };
}

// 用户登录
export function useLogin() {
  const queryClient = useQueryClient();

  return useLoginMutation(graphqlClient, {
    onSuccess: (data) => {
      // 刷新用户信息
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_ME });
    },
  });
}

// 用户登出
export function useLogout() {
  const queryClient = useQueryClient();

  const client = createAuthenticatedClient();

  return useLogoutMutation(client, {
    onSuccess: () => {
      // 清除查询缓存
      queryClient.clear();
    },
  });
}

// 注册用户
export function useRegister() {
  const queryClient = useQueryClient();

  return useRegisterMutation(graphqlClient, {
    onSuccess: () => {
      // 注册成功后可能需要刷新相关查询
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_ME });
    },
  });
}

// 综合认证 hook - 替代 auth store
export function useAuthState() {
  const client = createAuthenticatedClient();
  const {
    data: meData,
    isLoading: meLoading,
    error: meError,
    refetch: refetchMe,
  } = useMe();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const queryClient = useQueryClient();

  const isAuthenticated = !!meData?.me;
  const user = meData?.me || null;

  // 登录函数 - 使用 GraphQL
  const login = async (username: string, password: string) => {
    return loginMutation.mutateAsync({ username, password });
  };

  // 登出函数 - 使用 GraphQL
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
    } catch (error) {
      console.error("Logout error:", error);
      queryClient.clear();
    }
  };

  // 检查认证状态
  const checkAuth = async () => {
    try {
      await refetchMe();
      return true;
    } catch {
      return false;
    }
  };

  return {
    // 状态
    user,
    isAuthenticated,
    isLoading: meLoading,
    error: meError,

    // 方法
    login,
    logout,
    register: registerMutation.mutate,
    checkAuth,
    refetchMe,

    // 登录状态
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // 登出状态
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // 注册状态
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
