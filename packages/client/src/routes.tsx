import {
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import HomePage from '@/pages/Home';
import ChatPage from '@/pages/Chat';
import RecipePage from '@/pages/Recipe';
import ProfilePage from '@/pages/Profile';
import KitchenToolsPage from '@/pages/KitchenTools';
import BottomNav from '@/components/layout/BottomNav';

// 布局组件
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen h-screen">
      {/* 主内容区域 */}
      <main className="flex flex-col flex-1 min-h-0 pb-[var(--bottom-nav-height)] md:pt-16 md:pb-0">
        <Outlet />
      </main>

      {/* 响应式导航栏 */}
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
        element: <ProfilePage />,
      },
      {
        path: "kitchen-tools",
        element: <KitchenToolsPage />,
      },
    ],
  },
]);
