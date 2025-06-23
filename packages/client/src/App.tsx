import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "./router";
import useAuthStore from "@/store/auth-store";

const App = () => {
  const { checkAuth, isAuthenticated, isGuestMode, requireAuth } = useAuthStore();

  useEffect(() => {
    // 应用启动时检查认证状态
    checkAuth();
  }, [checkAuth]);

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

export default App;
