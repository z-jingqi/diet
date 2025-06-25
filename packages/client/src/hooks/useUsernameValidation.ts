import { useState, useCallback, useRef } from 'react';
import { checkUsername } from '@/lib/api/auth-api';

interface UsernameValidationState {
  isValidating: boolean;
  isAvailable: boolean | null;
  error: string | null;
}

export const useUsernameValidation = () => {
  const [state, setState] = useState<UsernameValidationState>({
    isValidating: false,
    isAvailable: null,
    error: null,
  });

  const timeoutRef = useRef<number | null>(null);

  const validateUsername = useCallback(async (username: string) => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 基本验证
    if (!username.trim()) {
      setState({
        isValidating: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    if (username.length < 3) {
      setState({
        isValidating: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    if (username.length > 20) {
      setState({
        isValidating: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    // 设置验证中状态
    setState(prev => ({
      ...prev,
      isValidating: true,
      error: null,
    }));

    // 延迟500ms执行，避免频繁请求
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const result = await checkUsername(username);
        setState({
          isValidating: false,
          isAvailable: result.available,
          error: null,
        });
      } catch (error) {
        setState({
          isValidating: false,
          isAvailable: null,
          error: error instanceof Error ? error.message : '检查用户名失败',
        });
      }
    }, 500);
  }, []);

  const resetValidation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({
      isValidating: false,
      isAvailable: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    validateUsername,
    resetValidation,
  };
}; 
