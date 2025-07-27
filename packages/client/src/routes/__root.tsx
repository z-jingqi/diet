import { createRootRouteWithContext } from "@tanstack/react-router";
import Layout from "@/components/layout/Layout";

// 定义认证上下文类型
interface AuthContext {
  isAuthenticated: boolean;
  isGuestMode: boolean;
  requireAuth: () => boolean;
}

export const Route = createRootRouteWithContext<AuthContext>()({
  component: Layout,
});
