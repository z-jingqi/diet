import {
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import HomePage from "@/pages/home";
import ChatPage from "@/pages/chat";
import RecipePage from "@/pages/recipe";
import BottomNav from "@/components/layout/bottom-nav";

// 布局组件
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen h-screen">
      {/* 主内容区域 */}
      <main className="flex flex-col flex-1 min-h-0 pb-[var(--bottom-nav-height)]">
        <Outlet />
      </main>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "recipe",
        element: <RecipePage />,
      },
      {
        path: "favorites",
        element: <div>收藏页面</div>,
      },
      {
        path: "profile",
        element: <div>个人页面</div>,
      },
    ],
  },
]);
