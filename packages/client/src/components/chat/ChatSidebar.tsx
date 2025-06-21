import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, MutedText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, User } from "lucide-react";
import ChatHistoryItem from "./ChatHistoryItem";
import ProfileDialog from "@/components/profile/ProfileDialog";

interface ChatSidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

const ChatSidebar = ({ 
  onNewChat, 
  onSelectChat, 
  onRenameChat, 
  onDeleteChat,
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  // 检测设备类型
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md断点
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // 模拟数据，按时间分类
  const mockChatHistories = {
    recent: [
      { id: "1", title: "关于健康饮食的建议", timestamp: "2024-01-15" },
      { id: "2", title: "减肥食谱推荐", timestamp: "2024-01-14" },
    ],
    threeDaysAgo: [
      { id: "3", title: "营养搭配咨询", timestamp: "2024-01-12" },
      { id: "4", title: "早餐搭配建议", timestamp: "2024-01-11" },
    ],
    oneWeekAgo: [
      { id: "5", title: "运动饮食计划", timestamp: "2024-01-08" },
      { id: "6", title: "素食营养咨询", timestamp: "2024-01-07" },
    ],
    oneMonthAgo: [
      { id: "7", title: "糖尿病饮食指导", timestamp: "2023-12-15" },
      { id: "8", title: "孕期营养建议", timestamp: "2023-12-10" },
    ],
    older: [
      { id: "9", title: "儿童营养搭配", timestamp: "2023-11-20" },
      { id: "10", title: "老年人饮食建议", timestamp: "2023-10-15" },
    ],
  };

  const timeCategories = [
    { key: "recent", label: "最近", chatHistories: mockChatHistories.recent },
    {
      key: "threeDaysAgo",
      label: "3天前",
      chatHistories: mockChatHistories.threeDaysAgo,
    },
    {
      key: "oneWeekAgo",
      label: "一周前",
      chatHistories: mockChatHistories.oneWeekAgo,
    },
    {
      key: "oneMonthAgo",
      label: "一个月前",
      chatHistories: mockChatHistories.oneMonthAgo,
    },
    {
      key: "older",
      label: "很久的消息",
      chatHistories: mockChatHistories.older,
    },
  ];

  const filteredCategories = timeCategories.filter((category) =>
    category.chatHistories.some((chatHistory) =>
      chatHistory.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChatSelect = (chatId: string) => {
    onSelectChat?.(chatId);
  };

  const handleUserClick = () => {
    if (isMobile) {
      // 移动端：打开Profile对话框
      setProfileDialogOpen(true);
    } else {
      // 桌面端：跳转到Profile页面
      navigate("/profile");
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
          />
        </div>
      </div>

      {/* 聊天记录列表 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.key} className="p-4 border-b last:border-b-0">
            <MutedText className="text-xs font-medium mb-2 block">
              {category.label}
            </MutedText>
            <div className="space-y-1">
              {category.chatHistories
                .filter((chatHistory) =>
                  chatHistory.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((chatHistory) => (
                  <ChatHistoryItem
                    key={chatHistory.id}
                    chatHistory={chatHistory}
                    onSelectChat={handleChatSelect}
                    onRenameChat={onRenameChat}
                    onDeleteChat={onDeleteChat}
                  />
                ))}
            </div>
          </div>
        ))}
        
        {/* 无搜索结果时显示 */}
        {searchTerm &&
          filteredCategories.every((cat) => cat.chatHistories.length === 0) && (
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
