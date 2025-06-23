import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Typography, MutedText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, User, Plus } from "lucide-react";
import SessionHistoryItem from "./SessionHistoryItem";
import ProfileDialog from "@/components/profile/ProfileDialog";
import { useConfirmDialog } from "@/components/providers/ConfirmDialogProvider";
import { ChatSession } from "@diet/shared";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onCreateNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onCloseSidebar?: () => void;
}

const ChatSidebar = ({
  sessions,
  currentSessionId,
  onCreateNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
  onCloseSidebar,
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [allowFocus, setAllowFocus] = useState(false);
  const navigate = useNavigate();

  const confirm = useConfirmDialog();

  // 检测设备类型
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md断点
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // 延迟允许聚焦，避免初始自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllowFocus(true);
    }, 1000); // 1秒后允许聚焦

    return () => clearTimeout(timer);
  }, []);

  // 按时间分类会话
  const categorizeSessions = (sessions: any[]) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDays = 3 * oneDay;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const categorized = {
      recent: [] as any[],
      threeDaysAgo: [] as any[],
      oneWeekAgo: [] as any[],
      oneMonthAgo: [] as any[],
      older: [] as any[],
    };

    sessions.forEach((session) => {
      const timeDiff = now.getTime() - session.updatedAt.getTime();

      if (timeDiff <= oneDay) {
        categorized.recent.push(session);
      } else if (timeDiff <= threeDays) {
        categorized.threeDaysAgo.push(session);
      } else if (timeDiff <= oneWeek) {
        categorized.oneWeekAgo.push(session);
      } else if (timeDiff <= oneMonth) {
        categorized.oneMonthAgo.push(session);
      } else {
        categorized.older.push(session);
      }
    });

    return categorized;
  };

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
    onSelectSession?.(sessionId);
  };

  const handleNewChat = () => {
    // 检查当前会话是否有消息
    const currentSession = sessions.find(
      (session) => session.id === currentSessionId
    );

    if (currentSession && currentSession.messages.length === 0) {
      // 如果当前会话没有消息，只关闭侧边栏
      onCloseSidebar?.();
      return;
    }

    onCreateNewSession?.();
  };

  const handleRenameChat = (sessionId: string) => {
    // TODO: 实现重命名功能，可能需要弹出一个输入框
    const newTitle = prompt("请输入新的标题:");
    if (newTitle) {
      onRenameSession?.(sessionId);
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
      onDeleteSession?.(sessionId);
    }
  };

  const handleUserClick = () => {
    if (isMobile) {
      // 移动端：打开Profile对话框
      setProfileDialogOpen(true);
    } else {
      // 桌面端：跳转到Profile页面
      navigate({ to: "/profile" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 搜索框 */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索聊天记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          新聊天
        </Button>
      </div>

      {/* 聊天记录列表 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.key} className="p-4 border-b last:border-b-0">
            <MutedText className="text-xs font-medium mb-2 block">
              {category.label}
            </MutedText>
            <div className="flex flex-col gap-2">
              {category.sessions
                .filter((session) =>
                  session.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
              <MutedText>未找到相关聊天记录</MutedText>
            </div>
          )}
      </div>

      {/* 用户昵称 */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-2"
          onClick={handleUserClick}
        >
          <div className="flex items-center w-full">
            <User className="mr-2 h-4 w-4 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <Typography variant="span" className="block truncate">
                用户昵称
              </Typography>
            </div>
          </div>
        </Button>
      </div>

      {/* Profile对话框 - 移动端 */}
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default ChatSidebar;
