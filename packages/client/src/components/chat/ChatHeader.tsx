import { useState, useCallback, useMemo } from "react";
import { Text, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";
import useChatMessageStoreV2 from "@/store/chat-message-store-v2";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import { useUpdateChatSession, useDeleteChatSession } from "@/lib/gql/hooks";
import { useChatSessionsV2 } from "@/lib/gql/hooks/chat-v2";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  // 使用 V2 版本的 store
  const currentSessionId = useChatSessionStoreV2(
    (state) => state.currentSessionId
  );
  const isTemporarySession = useChatSessionStoreV2(
    (state) => state.isTemporarySession
  );
  const renameSession = useChatSessionStoreV2((state) => state.renameSession);
  const deleteSession = useChatSessionStoreV2((state) => state.deleteSession);

  // 使用消息 store 来清除消息
  const clearMessages = useChatMessageStoreV2((state) => state.clearMessages);

  // 获取会话列表以查找当前会话标题
  const { sessions } = useChatSessionsV2();

  // 使用 useMemo 获取当前会话标题
  const sessionTitle = useMemo(() => {
    const currentSession = sessions.find((s) => s.id === currentSessionId);
    return currentSession?.title || "新对话";
  }, [currentSessionId, sessions]);

  const confirm = useConfirmDialog();
  const { mutateAsync: updateChatSession } = useUpdateChatSession();
  const { mutateAsync: deleteChatSession } = useDeleteChatSession();

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
                  if (isTemporarySession) {
                    renameSession(currentSessionId, newTitle);
                  } else {
                    void updateChatSession({
                      id: currentSessionId,
                      title: newTitle,
                    });
                  }
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
                  if (isTemporarySession) {
                    clearMessages(currentSessionId);
                  } else {
                    void updateChatSession({
                      id: currentSessionId,
                      messages: "[]",
                    });
                  }
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
                  if (isTemporarySession) {
                    deleteSession(currentSessionId);
                  } else {
                    void deleteChatSession({ id: currentSessionId });
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
