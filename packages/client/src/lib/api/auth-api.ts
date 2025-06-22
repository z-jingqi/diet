import { API_BASE } from "@/lib/constants";
import { LoginRequest, RegisterRequest, WechatLoginRequest, LoginResponse, User } from "@diet/shared";

// 获取存储的会话令牌
const getSessionToken = (): string | null => {
  return localStorage.getItem('session_token');
};

// 存储会话令牌
const setSessionToken = (token: string): void => {
  localStorage.setItem('session_token', token);
};

// 清除会话令牌
const clearSessionToken = (): void => {
  localStorage.removeItem('session_token');
};

// 用户注册
export const register = async (request: RegisterRequest): Promise<{ success: boolean; message: string; user?: User }> => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || '注册失败');
  }

  return data;
};

// 用户登录
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || '登录失败');
  }

  // 存储会话令牌
  if (data.session_token) {
    setSessionToken(data.session_token);
  }

  return data;
};

// 微信登录
export const wechatLogin = async (request: WechatLoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE}/auth/wechat-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || '微信登录失败');
  }

  // 存储会话令牌
  if (data.session_token) {
    setSessionToken(data.session_token);
  }

  return data;
};

// 用户注销
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const sessionToken = getSessionToken();
  
  if (!sessionToken) {
    clearSessionToken();
    return { success: true, message: '已注销' };
  }

  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
    },
  });

  const data = await response.json();
  
  // 无论成功与否都清除本地存储的令牌
  clearSessionToken();

  if (!response.ok) {
    throw new Error(data.message || '注销失败');
  }

  return data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const sessionToken = getSessionToken();
  
  if (!sessionToken) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    // 如果获取用户信息失败，可能是令牌过期，清除本地存储
    clearSessionToken();
    throw new Error(data.message || '获取用户信息失败');
  }

  return data.user;
};

// 检查是否已登录
export const isLoggedIn = (): boolean => {
  return getSessionToken() !== null;
};

// 获取认证头
export const getAuthHeaders = (): Record<string, string> => {
  const sessionToken = getSessionToken();
  return sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {};
};

// 带认证的API调用
export const authenticatedFetch = async (url: string, options: { headers?: Record<string, string>; method?: string; body?: string } = {}): Promise<Response> => {
  const sessionToken = getSessionToken();
  
  if (!sessionToken) {
    throw new Error('未登录');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${sessionToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 如果返回401，清除本地存储的令牌
  if (response.status === 401) {
    clearSessionToken();
    throw new Error('会话已过期，请重新登录');
  }

  return response;
}; 