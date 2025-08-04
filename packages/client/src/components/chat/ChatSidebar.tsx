import { useState, useEffect } from "react";
import { MutedText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, User, Plus } from "lucide-react";
import SessionHistoryItem from "./SessionHistoryItem";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import { useAuthNavigate } from "@/hooks";
import { createAuthCheck } from "@/utils/auth-utils";
import { categorizeSessions } from "@/utils/time-utils";
import { ChatSession } from "@/lib/gql/graphql";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import {
  useDeleteChatSession,
  useUpdateChatSession,
} from "@/lib/gql/hooks/chat-hooks";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatSidebarProps {
  currentSessionId: string;
  sessions: ChatSession[];
  onCloseSidebar?: () => void;
  isLoading?: boolean;
  onSessionsChange?: () => void;
}

const ChatSidebar = ({
  currentSessionId,
  sessions,
  onCloseSidebar,
  isLoading = false,
  onSessionsChange,
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allowFocus, setAllowFocus] = useState(false);

  const navigate = useNavigate();
  const authNavigate = useAuthNavigate();
  const { requireAuth, user } = useAuth();
  const authCheck = createAuthCheck(
    () => authNavigate({ to: "/login" }),
    requireAuth
  );

  const confirm = useConfirmDialog();
  const { mutateAsync: deleteSession } = useDeleteChatSession();
  const { mutateAsync: updateSession } = useUpdateChatSession();

  // 延迟允许聚焦，避免初始自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllowFocus(true);
    }, 1000); // 1秒后允许聚焦

    return () => clearTimeout(timer);
  }, []);

  const categorizedSessions = categorizeSessions(sessions);

  const timeCategories = [
    { key: "recent", label: "最近", sessions: categorizedSessions.recent },
    {
      key: "threeDaysAgo",
      label: "3天前",
      sessions: categorizedSessions.threeDaysAgo,
    },
    {
      key: "oneWeekAgo",
      label: "一周前",
      sessions: categorizedSessions.oneWeekAgo,
    },
    {
      key: "oneMonthAgo",
      label: "一个月前",
      sessions: categorizedSessions.oneMonthAgo,
    },
    { key: "older", label: "很久的消息", sessions: categorizedSessions.older },
  ];

  const filteredCategories = timeCategories.filter((category) =>
    category.sessions.some((session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChatSelect = (sessionId: string) => {
    // 导航到选中的会话
    navigate({ to: `/${sessionId}` });
    onCloseSidebar?.();
  };

  const handleNewChat = async () => {
    // 创建新会话或导航到根路径以创建临时会话
    navigate({ to: "/" });
    onCloseSidebar?.();
  };

  const handleRenameChat = async (sessionId: string) => {
    const newTitle = prompt("请输入新的标题:");
    if (newTitle) {
      try {
        await updateSession({
          id: sessionId,
          title: newTitle,
        });

        // 通知父组件会话列表已更改
        onSessionsChange?.();
      } catch (error) {
        console.error("Failed to rename session:", error);
        // 即使更新失败，也尝试刷新会话列表以确保数据一致性
        onSessionsChange?.();
      }
    }
  };

  const handleDeleteChatItem = async (sessionId: string) => {
    const ok = await confirm({
      title: "确定要删除这个对话吗？",
      description: "此操作无法撤销，删除后对话将永久丢失。",
      confirmText: "删除",
      cancelText: "取消",
      confirmVariant: "destructive",
    });

    if (ok) {
      try {
        await deleteSession({ id: sessionId });

        // 通知父组件会话列表已更改
        onSessionsChange?.();

        // 如果删除的是当前会话，导航到根路径
        if (sessionId === currentSessionId) {
          navigate({ to: "/" });
        }
      } catch (error) {
        console.error("Failed to delete session:", error);
        // 即使删除失败，也尝试刷新会话列表以确保数据一致性
        onSessionsChange?.();
      }
    }
  };

  const handleUserClick = () => {
    authCheck.checkAuth(() => {
      // 统一行为：都跳转到Profile页面
      authNavigate({ to: "/profile" });
    });
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* 搜索框 */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="搜索聊天记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8 bg-background/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-background"
            autoFocus={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onFocus={(e) => {
              if (!allowFocus) {
                e.target.blur();
              }
            }}
          />
        </div>
      </div>

      {/* 新聊天按钮 */}
      <div className="px-3 pb-2">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start px-2 py-1.5 h-8 text-sm font-normal"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
          新聊天
        </Button>
      </div>

      {/* 聊天记录列表 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-1 px-3 py-2">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <>
            {filteredCategories.map((category) => (
              <div key={category.key} className="px-3 py-1">
                <MutedText className="text-xs font-normal mb-1.5 block px-2 opacity-60">
                  {category.label}
                </MutedText>
                <div className="flex flex-col gap-0.5">
                  {category.sessions
                    .filter((session) =>
                      session.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((session) => (
                      <SessionHistoryItem
                        key={session.id}
                        session={session}
                        isActive={session.id === currentSessionId}
                        onSelectChat={handleChatSelect}
                        onRenameChat={handleRenameChat}
                        onDeleteChat={handleDeleteChatItem}
                      />
                    ))}
                </div>
              </div>
            ))}

            {/* 无搜索结果时显示 */}
            {searchTerm &&
              filteredCategories.every((cat) => cat.sessions.length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="h-6 w-6 text-muted-foreground mb-2 opacity-50" />
                  <MutedText>未找到相关聊天记录</MutedText>
                </div>
              )}

            {/* 空会话列表 */}
            {sessions.length === 0 && !searchTerm && (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                <MessageSquare className="h-6 w-6 text-muted-foreground mb-2 opacity-50" />
                <MutedText>没有聊天记录</MutedText>
                <p className="text-xs text-muted-foreground mt-1 opacity-60">
                  开始一个新的聊天吧
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 用户昵称 */}
      <div className="px-3 py-3 border-t border-border/40">
        <Button
          variant="ghost"
          className="w-full justify-start h-8 p-2 font-normal"
          onClick={handleUserClick}
        >
          <div className="flex items-center w-full">
            <User className="mr-2 h-4 w-4 flex-shrink-0 opacity-60" />
            <div className="flex-1 min-w-0 text-left">
              <span className="block truncate text-sm">
                {user?.nickname || user?.username || "访客"}
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
