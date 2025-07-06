import { useAuth } from "@/contexts/AuthContext";
import { useAuthNavigate } from "./useAuthNavigate";
import { showAuthPrompt } from "@/utils/auth-utils";

export const useAuthCheck = () => {
  const { requireAuth } = useAuth();
  const authNavigate = useAuthNavigate();

  const checkAuthAndExecute = (
    action: () => void,
    options?: {
      showToast?: boolean;
      toastMessage?: string;
      toastDescription?: string;
    }
  ) => {
    const {
      showToast = true,
      toastMessage = "需要登录才能访问此功能",
      toastDescription = "请先登录您的账户",
    } = options || {};

    // 检查是否需要认证
    if (requireAuth()) {
      if (showToast) {
        showAuthPrompt(() => authNavigate({ to: "/login" }), {
          message: toastMessage,
          description: toastDescription,
        });
      }

      // 不执行操作
      return false;
    }

    // 执行操作
    action();
    return true;
  };

  return { checkAuthAndExecute };
};
