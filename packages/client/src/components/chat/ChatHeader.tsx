import { useState } from "react";
import { Text, ChevronRight, UserIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "@/store/auth-store";

interface ChatHeaderProps {
  onMenuClick: () => void;
  title?: string;
  onRenameSession?: () => void;
  onClearSession?: () => void;
  onDeleteSession?: () => void;
}

const ChatHeader = ({
  onMenuClick,
  title = "新对话",
  onRenameSession,
  onClearSession,
  onDeleteSession,
}: ChatHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isGuestMode } = useAuthStore();

  const handleLoginClick = () => {
    navigate({ to: "/login" });
  };

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
              <Typography variant="span" className="text-base font-normal mr-1">
                {title}
              </Typography>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-32">
            <DropdownMenuItem onClick={onRenameSession}>
              <Typography variant="span" className="text-sm">
                重命名
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClearSession}>
              <Typography variant="span" className="text-sm">
                清空聊天
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDeleteSession}
              className="text-destructive"
            >
              <Typography variant="span" className="text-sm">
                删除聊天
              </Typography>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 右侧占位符，保持布局平衡 */}
      <div className="w-6" />

      {/* 用户状态指示器 - 只在游客模式时显示 */}
      {isGuestMode && (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <UserIcon className="w-3 h-3" />
            <span>游客模式</span>
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLoginClick}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <LogInIcon className="w-4 h-4 mr-1" />
            登录
          </Button>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
