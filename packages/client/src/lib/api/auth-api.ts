import { API_BASE } from "@/lib/constants";
import { LoginRequest, RegisterRequest, WechatLoginRequest, LoginResponse, User } from "@diet/shared";
import { fetchWithRefresh, setCsrfToken, clearCsrfToken } from "./base-api";

// 检查是否为游客模式
const isGuestMode = (): boolean => {
  return localStorage.getItem('guest_mode') === 'true';
};

// 设置游客模式
const setGuestMode = (isGuest: boolean): void => {
  if (isGuest) {
    localStorage.setItem('guest_mode', 'true');
  } else {
    localStorage.removeItem('guest_mode');
  }
};

// 用户注册
export const register = async (request: RegisterRequest): Promise<{ success: boolean; message: string; user?: User }> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/register`, {
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
  setGuestMode(false);
  return data;
};

// 用户登录
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/login`, {
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
  
  // 存储 CSRF token
  if (data.csrf_token) {
    setCsrfToken(data.csrf_token);
  }
  
  setGuestMode(false);
  return data;
};

// 微信登录
export const wechatLogin = async (request: WechatLoginRequest): Promise<LoginResponse> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/wechat-login`, {
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
  
  // 存储 CSRF token
  if (data.csrf_token) {
    setCsrfToken(data.csrf_token);
  }
  
  setGuestMode(false);
  return data;
};

// 用户注销
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/logout`, {
    method: 'POST',
  });
  const data = await response.json();
  
  // 清除 CSRF token
  clearCsrfToken();
  setGuestMode(false);
  
  if (!response.ok) {
    throw new Error(data.message || '注销失败');
  }
  return data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/me`, {
    method: 'GET',
  });
  const data = await response.json();
  if (!response.ok) {
    clearCsrfToken();
    setGuestMode(false);
    throw new Error(data.message || '获取用户信息失败');
  }
  return data.user;
};

// 检查是否已登录（通过尝试获取用户信息）
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

// 检查是否为游客模式
export const checkGuestMode = (): boolean => {
  return isGuestMode();
};

// 启用游客模式
export const enableGuestMode = (): void => {
  setGuestMode(true);
  clearCsrfToken();
};

// 禁用游客模式
export const disableGuestMode = (): void => {
  localStorage.removeItem('guest_mode');
}; 