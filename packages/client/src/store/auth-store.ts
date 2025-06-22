import { create } from "zustand";
import { User } from "@diet/shared";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  isLoggedIn,
  checkGuestMode,
  enableGuestMode,
  disableGuestMode,
} from "@/lib/api/auth-api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 认证方法
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  enableGuest: () => void;
  
  // 状态检查
  canUseFeatures: () => boolean;
  requireAuth: () => boolean;
  
  // 清除错误
  clearError: () => void;
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
      const response = await apiLogin({ username, password });
      set({
        user: response.user,
        isAuthenticated: true,
        isGuestMode: false,
        isLoading: false,
      });
      // 登录成功后禁用游客模式
      disableGuestMode();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '登录失败',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username: string, email: string, password: string, nickname?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRegister({ username, email, password, nickname });
      if (response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isGuestMode: false,
          isLoading: false,
        });
        // 注册成功后禁用游客模式
        disableGuestMode();
      } else {
        set({ isLoading: false });
      }
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
      await apiLogout();
      set({
        user: null,
        isAuthenticated: false,
        isGuestMode: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '注销失败',
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // 检查是否已登录
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const user = await getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isGuestMode: false,
          isLoading: false,
        });
      } else {
        // 检查是否为游客模式
        const isGuest = checkGuestMode();
        set({
          user: null,
          isAuthenticated: false,
          isGuestMode: isGuest,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isGuestMode: false,
        isLoading: false,
      });
    }
  },

  enableGuest: () => {
    enableGuestMode();
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