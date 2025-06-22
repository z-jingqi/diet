import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "./routes";
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
