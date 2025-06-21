import { useState } from "react";
import { Typography, MutedText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MessageSquare, User, MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface ChatSidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onUserClick?: () => void;
  onRenameChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

const ChatSidebar = ({ 
  onNewChat, 
  onSelectChat, 
  onUserClick, 
  onRenameChat, 
  onDeleteChat 
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // 模拟数据，按时间分类
  const mockChats = {
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
    { key: "recent", label: "最近", chats: mockChats.recent },
    { key: "threeDaysAgo", label: "3天前", chats: mockChats.threeDaysAgo },
    { key: "oneWeekAgo", label: "一周前", chats: mockChats.oneWeekAgo },
    { key: "oneMonthAgo", label: "一个月前", chats: mockChats.oneMonthAgo },
    { key: "older", label: "很久的消息", chats: mockChats.older },
  ];

  const filteredCategories = timeCategories.filter(category => 
    category.chats.some(chat => 
      chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChatPress = (chatId: string) => {
    setActiveChatId(activeChatId === chatId ? null : chatId);
  };

  const handleChatSelect = (chatId: string) => {
    onSelectChat?.(chatId);
    setActiveChatId(null);
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
              {category.chats
                .filter(chat => 
                  chat.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    className="group relative flex items-center w-full p-2 rounded-md hover:bg-accent transition-colors"
                    onTouchStart={() => handleChatPress(chat.id)}
                  >
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start h-auto p-0"
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <div className="flex items-center w-full">
                        <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <Typography variant="span" className="block truncate text-sm">
                            {chat.title}
                          </Typography>
                          <MutedText className="text-xs">
                            {chat.timestamp}
                          </MutedText>
                        </div>
                      </div>
                    </Button>
                    
                    {/* Action按钮 - hover时显示，移动端触摸时也显示 */}
                    <div className={`transition-opacity ml-2 ${
                      activeChatId === chat.id 
                        ? 'opacity-100' 
                        : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => onRenameChat?.(chat.id)}>
                            <Edit className="mr-2 h-3 w-3" />
                            <Typography variant="span" className="text-sm">重命名</Typography>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteChat?.(chat.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            <Typography variant="span" className="text-sm">删除</Typography>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
        
        {/* 无搜索结果时显示 */}
        {searchTerm && filteredCategories.every(cat => cat.chats.length === 0) && (
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
          onClick={onUserClick}
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
    </div>
  );
};

export default ChatSidebar; 