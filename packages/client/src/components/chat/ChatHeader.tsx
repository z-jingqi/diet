import { useState } from "react";
import { Text, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChatStore from "@/store/chat-store";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 从 store 中一次性选择所需值，避免多次订阅
  const {
    currentSessionId,
    sessionTitle,
    renameSession,
    clearSession,
    deleteSession,
  } = useChatStore((state) => ({
    currentSessionId: state.currentSessionId,
    sessionTitle: state.getCurrentSession()?.title || "新对话",
    renameSession: state.renameSession,
    clearSession: state.clearSession,
    deleteSession: state.deleteSession,
  }));

  const confirm = useConfirmDialog();

  return (
    <header className="flex items-center justify-between px-4 py-1.5 bg-background min-h-0 h-10">
      {/* 左侧菜单按钮 */}
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
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
                  renameSession(currentSessionId, newTitle);
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
                  clearSession(currentSessionId);
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
                  deleteSession(currentSessionId);
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
