import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "@/pages/ChatPage";

// 将组件提取为命名的 React 组件，避免 eslint 对 hooks 的警告
const SessionRouteComponent = () => {
  const { sessionId } = Route.useParams();
  return <ChatPage sessionId={sessionId} />;
};

export const Route = createFileRoute("/$sessionId")({
  component: SessionRouteComponent,
});
