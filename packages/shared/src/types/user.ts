export interface User {
  id: string;
  username: string;
  email?: string;
  nickname?: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OAuthAccount {
  id: string;
  user_id: string;
  provider: 'wechat' | 'qq' | 'github';
  provider_user_id: string;
  provider_user_data?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token: string;
  session_expires_at: string;
  refresh_expires_at: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface CsrfToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
  nickname?: string;
}

export interface WechatLoginRequest {
  code: string;
  state?: string;
}

export interface LoginResponse {
  user: User;
  session_token: string;
  refresh_token: string;
  session_expires_at: string;
  refresh_expires_at: string;
  csrf_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  session_token: string;
  session_expires_at: string;
  csrf_token: string;
}

export interface CsrfTokenResponse {
  csrf_token: string;
  expires_at: string;
}

export interface AuthContext {
  user: User;
  session: UserSession;
} 