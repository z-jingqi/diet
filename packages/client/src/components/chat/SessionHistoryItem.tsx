import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ChatSession } from "@/lib/gql/graphql";

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
  return (
    <div
      className={`group relative flex items-center w-full px-2 py-1 rounded-sm transition-colors ${
        isActive ? "bg-accent/70" : "hover:bg-accent/50"
      }`}
    >
      <Button
        variant="ghost"
        className="flex-1 justify-start h-7 p-0 font-normal"
        onClick={() => onSelectChat(session.id ?? "")}
      >
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 text-left">
            <span className="block truncate text-sm">
              {session.title}
            </span>
          </div>
        </div>
      </Button>

      {/* Action按钮 - 移动端一直显示，桌面端hover时显示 */}
      <div className="transition-opacity ml-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onRenameChat?.(session.id ?? "")}>
              <Edit className="mr-2 h-3 w-3" />
              <span className="text-sm">重命名</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteChat?.(session.id ?? "")}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              <span className="text-sm">删除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SessionHistoryItem;
