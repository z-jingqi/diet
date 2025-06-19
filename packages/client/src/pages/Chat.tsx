import { useState } from "react";
import { motion } from "framer-motion";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import useChatStore from "@/store/chat";
import useTagsStore from "@/store/tags";

const prompts = [
  "今天想吃什么？",
  "有什么饮食禁忌吗？",
  "想了解什么食材？",
  "需要营养建议吗？",
];

const ChatPage = () => {
  const {
    messages,
    sendMessage,
    resetMessages,
    canSendMessage,
    abortCurrentMessage,
  } = useChatStore();

  const { clearTags, selectedTags } = useTagsStore();

  const [showTyping, setShowTyping] = useState(true);
  const [, setIsTyping] = useState(true);

  const handleSendMessage = async (content: string) => {
    setShowTyping(false);
    await sendMessage(content, selectedTags);
  };

  const handleReset = () => {
    resetMessages();
    clearTags();
    setShowTyping(true);
  };

  // 判断是否可终止
  const canAbort =
    messages.length > 0 &&
    (() => {
      const last = messages[messages.length - 1];
      return (
        !last.isUser &&
        (last.status === "pending" || last.status === "streaming")
      );
    })();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center w-full px-4">
          {showTyping && (
            <TypingPrompt
              prompts={prompts}
              onStartTyping={() => setIsTyping(true)}
              onStopTyping={() => setIsTyping(false)}
            />
          )}
          <div className="w-full max-w-2xl mt-8">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!canSendMessage()}
              canAbort={canAbort}
              onAbort={abortCurrentMessage}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0">
            <div className="max-w-4xl mx-auto w-full px-4 h-full flex flex-col">
              <div className="flex justify-end pt-4 flex-shrink-0">
                <button
                  className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded px-2 py-1 transition-colors"
                  onClick={handleReset}
                >
                  重置会话
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatMessages />
              </div>
            </div>
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
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!canSendMessage()}
              canAbort={canAbort}
              onAbort={abortCurrentMessage}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
