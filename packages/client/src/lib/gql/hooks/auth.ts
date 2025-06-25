import { useQueryClient } from '@tanstack/react-query';
import { createAuthenticatedClient, graphqlClient } from '../client';
import {
  useGetMeQuery,
  useRegisterMutation,
  useCheckUsernameMutation,
  useLoginMutation,
  useLogoutMutation
} from '../graphql';

// 获取用户认证状态
function useAuth() {
  const sessionToken = localStorage.getItem('session_token');
  return { sessionToken, isAuthenticated: !!sessionToken };
}

// 获取当前用户信息
export function useMe() {
  const { sessionToken } = useAuth();
  
  const client = sessionToken ? createAuthenticatedClient(sessionToken) : graphqlClient;
  const result = useGetMeQuery(client);
  
  if (!sessionToken) {
    return {
      ...result,
      data: null,
      error: new Error('Not authenticated'),
      isAuthenticated: false
    };
  }
  
  return {
    ...result,
    isAuthenticated: true
  };
}

// 用户登录
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useLoginMutation(graphqlClient, {
    onSuccess: (data) => {
      // 保存 session token 和 csrf token
      if (data.login?.sessionToken) {
        localStorage.setItem('session_token', data.login.sessionToken);
      }
      if (data.login?.csrfToken) {
        localStorage.setItem('csrf_token', data.login.csrfToken);
      }
      
      // 刷新用户信息
      queryClient.invalidateQueries({ queryKey: ['GetMe'] });
    },
  });
}

// 用户登出
export function useLogout() {
  const queryClient = useQueryClient();
  const { sessionToken } = useAuth();
  
  const client = sessionToken ? createAuthenticatedClient(sessionToken) : graphqlClient;
  
  return useLogoutMutation(client, {
    onSuccess: () => {
      // 清除本地存储
      localStorage.removeItem('session_token');
      localStorage.removeItem('csrf_token');
      
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
      queryClient.invalidateQueries({ queryKey: ['GetMe'] });
    },
  });
}

// 检查用户名是否可用
export function useCheckUsername() {
  return useCheckUsernameMutation(graphqlClient);
}

// 综合认证 hook - 替代 auth store
export function useAuthState() {
  const { sessionToken } = useAuth();
  const { data: meData, isLoading: meLoading, error: meError, refetch: refetchMe } = useMe();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const queryClient = useQueryClient();
  
  const isAuthenticated = !!sessionToken && !!meData?.me;
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
      console.error('Logout error:', error);
      // 即使 GraphQL 调用失败，也要清除本地存储
      localStorage.removeItem('session_token');
      localStorage.removeItem('csrf_token');
      queryClient.clear();
    }
  };

  // 检查认证状态
  const checkAuth = async () => {
    if (!sessionToken) {
      return false;
    }
    
    try {
      await refetchMe();
      return true;
    } catch {
      // 清除无效的 token
      localStorage.removeItem('session_token');
      localStorage.removeItem('csrf_token');
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
