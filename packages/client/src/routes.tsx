import {
  createBrowserRouter,
} from "react-router-dom";
import ChatPage from '@/pages/ChatPage';
import RecipePage from '@/pages/RecipePage';
import ProfilePage from '@/pages/ProfilePage';
import KitchenToolsPage from '@/pages/KitchenToolsPage';
import Layout from '@/components/layout/Layout';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
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
