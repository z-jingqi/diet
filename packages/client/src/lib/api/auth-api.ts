import { API_BASE } from "@/lib/constants";
import { LoginRequest, RegisterRequest, WechatLoginRequest, LoginResponse, User } from "@diet/shared";
import { fetchWithRefresh, setCsrfToken, clearCsrfToken } from "./base-api";

// 用户登录
export const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "登录失败");
  }

  const data = await response.json();
  
  // 设置 CSRF token
  if (data.csrf_token) {
    setCsrfToken(data.csrf_token);
  }
  
  return data;
};

// 用户注册
export const register = async (registerRequest: RegisterRequest): Promise<{ success: boolean; message: string; user?: User }> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "注册失败");
  }
  
  return data;
};

// 微信登录
export const wechatLogin = async (wechatLoginRequest: WechatLoginRequest): Promise<LoginResponse> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/wechat-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wechatLoginRequest),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "微信登录失败");
  }

  const data = await response.json();
  
  // 设置 CSRF token
  if (data.csrf_token) {
    setCsrfToken(data.csrf_token);
  }
  
  return data;
};

// 用户登出
export const logout = async (): Promise<void> => {
  await fetchWithRefresh(`${API_BASE}/auth/logout`, {
    method: "POST",
  });
  
  // 清除 CSRF token
  clearCsrfToken();
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetchWithRefresh(`${API_BASE}/auth/me`);
  if (!response.ok) {
    throw new Error("获取用户信息失败");
  }
  const data = await response.json();
  return data.user;
};
