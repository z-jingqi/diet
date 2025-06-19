import useChatStore from '@/store/chat';
import { useNavigate } from "react-router-dom";
import useRecipeStore from '@/store/recipe';
import type { Recipe } from '@shared/schemas/recipe';
import MessageBubble from './message-bubbles/MessageBubble';
import { useEffect, useRef, useState } from 'react';

const ChatMessages = () => {
  const { messages } = useChatStore();
  const navigate = useNavigate();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageIdRef = useRef<string>('');
  const lastMessageLengthRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

  // 处理滚动事件
  const handleScroll = () => {
    if (!containerRef.current) {
      return;
    }
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // 如果用户向上滚动超过 100px，禁用自动滚动
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    // 如果用户手动滚动，标记为用户滚动状态
    if (!isNearBottom && shouldAutoScroll) {
      isUserScrollingRef.current = true;
    }
    
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
    const currentMessageCount = messages.length;
    const lastMessage = messages[currentMessageCount - 1];
    
    // 检查是否有新消息（消息数量增加）
    const hasNewMessage = currentMessageCount > lastMessageLengthRef.current;
    
    // 检查是否是新的消息ID（新消息开始）
    const isNewMessageId = lastMessage && lastMessage.id !== lastMessageIdRef.current;
    
    if (hasNewMessage || isNewMessageId) {
      // 新消息开始时，重置用户滚动状态并启用自动滚动
      if (isNewMessageId) {
        isUserScrollingRef.current = false;
        setShouldAutoScroll(true);
      }
      
      // 更新引用
      lastMessageLengthRef.current = currentMessageCount;
      if (lastMessage) {
        lastMessageIdRef.current = lastMessage.id;
      }
    }
    
    // 只有在用户没有主动滚动时才自动滚动
    if (!isUserScrollingRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const handleRecipeClick = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    navigate("/recipe");
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto py-6 space-y-6"
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
