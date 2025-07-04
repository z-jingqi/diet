import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ChatSession } from "@diet/shared";

interface SessionHistoryItemProps {
  session: ChatSession;
  isActive?: boolean;
  onSelectChat: (sessionId: string) => void;
  onRenameChat?: (sessionId: string) => void;
  onDeleteChat?: (sessionId: string) => void;
}

const SessionHistoryItem = ({
  session,
  isActive = false,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: SessionHistoryItemProps) => {
  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) {
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } else if (diff < 7 * oneDay) {
      return date.toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={`group relative flex items-center w-full px-2 py-1 rounded-md transition-colors ${
        isActive ? "bg-accent/50 border border-accent" : "hover:bg-accent"
      }`}
    >
      <Button
        variant="ghost"
        className="flex-1 justify-start h-auto p-0"
        onClick={() => onSelectChat(session.id)}
      >
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 text-left">
            <Typography variant="span" className="block truncate text-sm">
              {session.title}
            </Typography>
            <Typography
              variant="span"
              className="block truncate text-xs text-muted-foreground"
            >
              {formatTime(session.updatedAt)}
            </Typography>
          </div>
        </div>
      </Button>

      {/* Action按钮 - 移动端一直显示，桌面端hover时显示 */}
      <div className="transition-opacity ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onRenameChat?.(session.id)}>
              <Edit className="mr-2 h-3 w-3" />
              <Typography variant="span" className="text-sm">
                重命名
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteChat?.(session.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              <Typography variant="span" className="text-sm">
                删除
              </Typography>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SessionHistoryItem;
