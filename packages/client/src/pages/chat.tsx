import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInput } from '../components/chat/chat-input';
import { ChatMessages } from '../components/chat/chat-messages';
import { useChatStore } from '../store/chat';

const prompts = [
  '今天想吃什么？',
  '有什么饮食禁忌吗？',
  '想了解什么食材？',
  '需要营养建议吗？',
];

export function ChatPage() {
  const messages = useChatStore((state) => state.messages);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // 如果有消息，立即清空文字并停止动画
    if (messages.length > 0) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    const currentPromptText = prompts[currentPrompt];

    const typeText = () => {
      if (currentIndex < currentPromptText.length) {
        setDisplayText(currentPromptText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, 100);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setCurrentPrompt((prev) => (prev + 1) % prompts.length);
          setDisplayText('');
          setIsTyping(true);
        }, 2000);
      }
    };

    // 只在组件挂载和 currentPrompt 变化时启动动画
    if (isTyping) {
      typeText();
    }
  }, [currentPrompt, messages.length]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          智能饮食助手
        </h1>
      </header>

      <div className="flex-1 relative">
        <div className={`h-full flex flex-col ${messages.length === 0 ? 'justify-center' : ''}`}>
          <motion.div
            layout
            className={`overflow-hidden ${messages.length > 0 ? 'flex-1' : ''}`}
            initial={{ height: 0 }}
            animate={{ height: messages.length > 0 ? 'auto' : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-full overflow-y-auto">
              <ChatMessages />
            </div>
          </motion.div>

          <div className="flex flex-col items-center">
            {messages.length === 0 && displayText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <motion.div
                  className="text-2xl font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[2rem]"
                >
                  {displayText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-1 h-6 bg-current ml-1"
                    />
                  )}
                </motion.div>
              </motion.div>
            )}

            <motion.div
              layout
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
              }}
              className="w-full max-w-2xl px-4 py-4"
            >
              <ChatInput />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
