import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// 定义认证上下文类型
interface AuthContext {
  isAuthenticated: boolean;
  isGuestMode: boolean;
  requireAuth: () => boolean;
}

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
    isGuestMode: false,
    requireAuth: () => false,
  } as AuthContext,
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
