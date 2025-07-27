import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { createAuthenticatedClient } from "@/lib/gql/client";

// Auth Action Types Enum
enum AuthActionType {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_AUTH = "SET_AUTH",
  CLEAR_AUTH = "CLEAR_AUTH",
  ENABLE_GUEST = "ENABLE_GUEST",
}

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  enableGuest: () => void;
  canUseFeatures: () => boolean;
  requireAuth: () => boolean;
  clearError: () => void;
  clearSession: () => void;
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuestMode: true,
  isLoading: false,
  error: null,
};

// Action types
type AuthAction =
  | { type: AuthActionType.SET_LOADING; payload: boolean }
  | { type: AuthActionType.SET_ERROR; payload: string | null }
  | {
      type: AuthActionType.SET_AUTH;
      payload: { user: User; isAuthenticated: boolean };
    }
  | { type: AuthActionType.CLEAR_AUTH }
  | { type: AuthActionType.ENABLE_GUEST };

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AuthActionType.SET_ERROR:
      return { ...state, error: action.payload };
    case AuthActionType.SET_AUTH:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isGuestMode: false,
      };
    case AuthActionType.CLEAR_AUTH:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isGuestMode: true,
      };
    case AuthActionType.ENABLE_GUEST:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isGuestMode: true,
      };
    default:
      return state;
  }
};

// Get auth client helper
function getAuthClient() {
  return createAuthenticatedClient();
}

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      dispatch({ type: AuthActionType.SET_LOADING, payload: true });
      dispatch({ type: AuthActionType.SET_ERROR, payload: null });

      try {
        const client = getAuthClient();
        const variables: LoginMutationVariables = { username, password };

        const result = await useLoginMutation.fetcher(client, variables)();

        if (!result.login) {
          throw new Error("登录失败");
        }

        // 清空之前的缓存，避免游客/旧用户数据污染
        queryClient.clear();

        dispatch({
          type: AuthActionType.SET_AUTH,
          payload: {
            user: result.login.user as User,
            isAuthenticated: true,
          },
        });
      } catch (error) {
        dispatch({
          type: AuthActionType.SET_ERROR,
          payload: error instanceof Error ? error.message : "登录失败",
        });
        // 登录失败时设置为游客模式
        dispatch({ type: AuthActionType.CLEAR_AUTH });
        throw error;
      } finally {
        dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      }
    },
    [],
  );

  const register = useCallback(
    async (username: string, password: string): Promise<void> => {
      dispatch({ type: AuthActionType.SET_LOADING, payload: true });
      dispatch({ type: AuthActionType.SET_ERROR, payload: null });

      try {
        const client = getAuthClient();
        const variables: RegisterMutationVariables = { username, password };

        const res = await useRegisterMutation.fetcher(client, variables)();

        if (!res.register || !res.register.user) {
          throw new Error("注册失败");
        }

        queryClient.clear();

        dispatch({
          type: AuthActionType.SET_AUTH,
          payload: {
            user: res.register.user as User,
            isAuthenticated: true,
          },
        });
      } catch (error) {
        dispatch({
          type: AuthActionType.SET_ERROR,
          payload: error instanceof Error ? error.message : "注册失败",
        });
        // 注册失败时设置为游客模式
        dispatch({ type: AuthActionType.CLEAR_AUTH });
        throw error;
      } finally {
        dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });
    dispatch({ type: AuthActionType.SET_ERROR, payload: null });

    try {
      const client = getAuthClient();
      const variables: LogoutMutationVariables = {};

      await useLogoutMutation.fetcher(client, variables)();
      // 登出后清空所有缓存
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: AuthActionType.CLEAR_AUTH });
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    dispatch({ type: AuthActionType.SET_LOADING, payload: true });

    try {
      const client = getAuthClient();
      const result = await useGetMeQuery.fetcher(client)();

      if (!result.me) {
        throw new Error("获取用户信息失败");
      }

      dispatch({
        type: AuthActionType.SET_AUTH,
        payload: {
          user: result.me as User,
          isAuthenticated: true,
        },
      });
    } catch {
      // 获取用户信息失败，说明未登录，设置为游客模式
      dispatch({ type: AuthActionType.CLEAR_AUTH });
    } finally {
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    }
  }, []);

  const enableGuest = useCallback((): void => {
    dispatch({ type: AuthActionType.ENABLE_GUEST });
  }, []);

  const canUseFeatures = useCallback((): boolean => {
    return state.isAuthenticated;
  }, [state.isAuthenticated]);

  const requireAuth = useCallback((): boolean => {
    return !state.isAuthenticated;
  }, [state.isAuthenticated]);

  const clearError = useCallback((): void => {
    dispatch({ type: AuthActionType.SET_ERROR, payload: null });
  }, []);

  const clearSession = useCallback((): void => {
    // 清除 session token
  }, []);

  const contextValue: AuthContextType = {
    ...state,
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

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
