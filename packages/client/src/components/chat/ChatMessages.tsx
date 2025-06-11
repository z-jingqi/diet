import useChatStore from '@/store/chat';
import { useNavigate } from "react-router-dom";
import useRecipeStore from '@/store/recipe';
import type { Recipe } from '@shared/types/recipe';
import MessageBubble from './MessageBubble';
import { useEffect, useRef, useState } from 'react';

const ChatMessages = () => {
  const { messages } = useChatStore();
  const navigate = useNavigate();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageIdRef = useRef<string>('');

  // 处理滚动事件
  const handleScroll = () => {
    if (!containerRef.current) {
      return;
    }
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // 如果用户向上滚动超过 100px，禁用自动滚动
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (!messagesEndRef.current || !shouldAutoScroll) {
      return;
    }
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听消息变化
  useEffect(() => {
    // 如果有新消息，启用自动滚动
    if (messages.length > 0 && messages[messages.length - 1].id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = messages[messages.length - 1].id;
      setShouldAutoScroll(true);
    }
    scrollToBottom();
  }, [messages]);

  const handleRecipeClick = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    navigate("/recipe");
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      onScroll={handleScroll}
    >
      {messages.map((message) => {
        return (
          <MessageBubble
            key={message.id}
            message={message}
            onRecipeClick={handleRecipeClick}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
