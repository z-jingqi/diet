import { useMemo } from "react";
import { Text, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import {
  useUpdateChatSession,
  useDeleteChatSession,
  useChatSessions,
} from "@/lib/gql/hooks/chat-hooks";
import { useNavigate } from "@tanstack/react-router";

interface ChatHeaderProps {
  onMenuClick: () => void;
  currentSessionId: string;
}

const ChatHeader = ({ onMenuClick, currentSessionId }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const confirm = useConfirmDialog();

  // 使用新的hooks
  const { sessions } = useChatSessions();
  const { mutateAsync: updateChatSession } = useUpdateChatSession();
  const { mutateAsync: deleteChatSession } = useDeleteChatSession();

  // 使用 useMemo 获取当前会话标题
  const sessionTitle = useMemo(() => {
    if (!currentSessionId) return "新对话";
    const currentSession = sessions.find((s) => s.id === currentSessionId);
    return currentSession?.title || "新对话";
  }, [currentSessionId, sessions]);

  return (
    <header className="flex items-center justify-between px-4 py-1.5 bg-background min-h-0 h-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-6 w-6"
      >
        <Text className="h-4 w-4" />
      </Button>

      {/* 中间标题区域 */}
      <div className="flex-1 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto p-1 hover:bg-accent flex items-center"
            >
              <Typography variant="span" className="text-base font-normal">
                {sessionTitle}
              </Typography>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-32">
            <DropdownMenuItem
              onClick={() => {
                if (!currentSessionId) {
                  return;
                }
                const newTitle = prompt("请输入新的标题:");
                if (newTitle) {
                  updateChatSession({
                    id: currentSessionId,
                    title: newTitle,
                  }).catch((error) => {
                    console.error("Failed to rename session:", error);
                  });
                }
              }}
            >
              <Typography variant="span" className="text-sm">
                重命名
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (!currentSessionId) {
                  return;
                }
                const ok = await confirm({
                  title: "确定要清空当前对话吗？",
                  description:
                    "此操作无法撤销，当前对话的所有消息将被永久删除。",
                  confirmText: "清空",
                  cancelText: "取消",
                  confirmVariant: "destructive",
                });
                if (ok) {
                  updateChatSession({
                    id: currentSessionId,
                    messages: "[]",
                  }).catch((error) => {
                    console.error("Failed to clear messages:", error);
                  });
                }
              }}
            >
              <Typography variant="span" className="text-sm">
                清空聊天
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (!currentSessionId) {
                  return;
                }
                const ok = await confirm({
                  title: "确定要删除这个对话吗？",
                  description: "此操作无法撤销，删除后对话将永久丢失。",
                  confirmText: "删除",
                  cancelText: "取消",
                  confirmVariant: "destructive",
                });
                if (ok) {
                  try {
                    await deleteChatSession({ id: currentSessionId });
                    // 删除成功后，重定向到根路径
                    navigate({ to: "/" });
                  } catch (error) {
                    console.error("Failed to delete session:", error);
                  }
                }
              }}
              className="text-destructive"
            >
              <Typography variant="span" className="text-sm">
                删除聊天
              </Typography>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
