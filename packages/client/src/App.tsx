import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "./router";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";

const AppContent = () => {
  const { checkAuth, isAuthenticated, isGuestMode, requireAuth } = useAuth();

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

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
