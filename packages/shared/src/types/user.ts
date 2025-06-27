export interface User {
  id: string;
  username: string;
  email?: string | null;
  nickname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  isActive: boolean | null;
  isVerified: boolean | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: 'wechat' | 'qq' | 'github';
  providerUserId: string;
  providerUserData?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: string;
  refreshExpiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string | null;
  updatedAt?: string | null;
}

export interface CsrfToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface WechatLoginRequest {
  code: string;
  state?: string;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: string;
  refreshExpiresAt: string;
  csrfToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  sessionToken: string;
  sessionExpiresAt: string;
  csrfToken: string;
}

export interface CsrfTokenResponse {
  csrfToken: string;
  expiresAt: string;
}

export interface AuthContext {
  user: User;
  session: UserSession;
} 