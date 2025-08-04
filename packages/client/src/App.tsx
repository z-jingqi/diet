import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "./router";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import useWeChatAutoLogin from "@/hooks/useWeChatAutoLogin";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AppContent = () => {
  const { checkAuth, isAuthenticated, isGuestMode, requireAuth } = useAuth();
  const { wechatAutoLoginLoading, wechatAutoLoginError, retryWechatLogin } =
    useWeChatAutoLogin();
  const showRetry = !!wechatAutoLoginError && !isAuthenticated;

  useEffect(() => {
    // 应用启动时检查认证状态
    checkAuth();
  }, [checkAuth]);

  if (wechatAutoLoginLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <Loader2 className={cn("h-8 w-8 animate-spin text-primary")} />
        <span className="text-muted-foreground text-sm">正在登录...</span>
      </div>
    );
  }

  if (showRetry) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <span className="text-red-500 text-sm">自动登录失败，请重试</span>
        <button
          onClick={() => {
            retryWechatLogin();
            window.location.reload(); // 重新加载以获取新的 code
          }}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          重新登录
        </button>
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{
        isAuthenticated,
        isGuestMode,
        requireAuth,
      }}
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
