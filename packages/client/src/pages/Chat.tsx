import { useState } from "react";
import { motion } from "framer-motion";
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import TypingPrompt from '@/components/chat/TypingPrompt';
import useChatStore from '@/store/chat';
import useRecipeStore from '@/store/recipe';

const prompts = ["今天想吃什么？", "有什么饮食禁忌吗？", "想了解什么食材？", "需要营养建议吗？"];

const ChatPage = () => {
  const { messages, sendMessage } = useChatStore();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const [showTyping, setShowTyping] = useState(true);
  const [, setIsTyping] = useState(true);

  const handleSendMessage = async (content: string) => {
    setShowTyping(false);
    await sendMessage(content, setCurrentRecipe);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center w-full px-4">
          {showTyping && <TypingPrompt prompts={prompts} onStartTyping={() => setIsTyping(true)} onStopTyping={() => setIsTyping(false)} />}
          <div className="w-full max-w-2xl mt-8">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ChatMessages />
          </div>
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="w-full max-w-2xl mx-auto px-4 py-4"
          >
            <ChatInput onSendMessage={handleSendMessage} />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
