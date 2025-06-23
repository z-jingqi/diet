import { toast } from 'sonner';
import useAuthStore from '@/store/auth-store';

// 统一的认证提示函数
export const showAuthPrompt = (navigateToLogin: () => void, options?: {
  message?: string;
  description?: string;
}) => {
  const {
    message = '需要登录才能访问此功能',
    description = '请先登录您的账户'
  } = options || {};

  toast(message, {
    description,
    action: {
      label: '去登录',
      onClick: navigateToLogin,
    },
    duration: 5000,
  });
};

export const createAuthCheck = (navigateToLogin: () => void) => {
  const { requireAuth } = useAuthStore();
  
  return {
    checkAuth: (
      action: () => void,
      options?: {
        showToast?: boolean;
        toastMessage?: string;
        toastDescription?: string;
      }
    ) => {
      const {
        showToast = true,
        toastMessage = '需要登录才能访问此功能',
        toastDescription = '请先登录您的账户'
      } = options || {};

      // 检查是否需要认证
      if (requireAuth()) {
        if (showToast) {
          showAuthPrompt(navigateToLogin, {
            message: toastMessage,
            description: toastDescription
          });
        }
        
        // 不执行操作
        return false;
      }
      
      // 执行操作
      action();
      return true;
    }
  };
}; 
