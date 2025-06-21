import {
  createBrowserRouter,
} from "react-router-dom";
import ChatPage from '@/pages/Chat';
import RecipePage from '@/pages/Recipe';
import ProfilePage from '@/pages/Profile';
import KitchenToolsPage from '@/pages/KitchenTools';
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
