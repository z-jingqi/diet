import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatHistoryItemProps {
  chatHistory: ChatHistory;
  onSelectChat: (chatId: string) => void;
  onRenameChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

const ChatHistoryItem = ({
  chatHistory,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: ChatHistoryItemProps) => {
  return (
    <div className="group relative flex items-center w-full px-2 py-1 rounded-md hover:bg-accent transition-colors">
      <Button
        variant="ghost"
        className="flex-1 justify-start h-auto p-0"
        onClick={() => onSelectChat(chatHistory.id)}
      >
        <div className="flex items-center w-full">
          <div className="flex-1 min-w-0 text-left">
            <Typography variant="span" className="block truncate text-sm">
              {chatHistory.title}
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
            <DropdownMenuItem onClick={() => onRenameChat?.(chatHistory.id)}>
              <Edit className="mr-2 h-3 w-3" />
              <Typography variant="span" className="text-sm">
                重命名
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteChat?.(chatHistory.id)}
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

export default ChatHistoryItem;
