import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "./router";
import useAuthStore from "@/store/auth-store";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // 应用启动时检查认证状态
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
};

export default App;
