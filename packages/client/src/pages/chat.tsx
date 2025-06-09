import { useState } from "react";
import { motion } from "framer-motion";
import ChatInput from "../components/chat/chat-input";
import ChatMessages from "../components/chat/chat-messages";
import TypingPrompt from "../components/chat/typing-prompt";
import useChatStore from "@/store/chat";
import useRecipeStore from "@/store/recipe";
import type { Message, AIResponse } from "@/types/chat";
import CHAT_PROMPT from "@/prompts/chat-prompt";
import { mockRecipes } from "@/mock/recipe";
import {
  buildMessageFromAIResponse,
  buildUserMessage,
} from "@/utils/message-builder";

const prompts = [
  "今天想吃什么？",
  "有什么饮食禁忌吗？",
  "想了解什么食材？",
  "需要营养建议吗？",
];

const ChatPage = () => {
  const { messages, addMessage, setLoading } = useChatStore();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const [showTyping, setShowTyping] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage = buildUserMessage(content);
    addMessage(userMessage);
    setLoading(true);
    setShowTyping(false);

    try {
      // 使用模板格式化用户输入

      // 模拟 AI 响应
      setTimeout(() => {
        // 随机选择一个菜谱作为响应
        const randomRecipe =
          mockRecipes[Math.floor(Math.random() * mockRecipes.length)];

        // 设置当前菜谱
        setCurrentRecipe(randomRecipe);

        // 创建模拟的 AI 响应
        const mockResponse: AIResponse = {
          intent_type: "recipe",
          content_body: {
            description: `我为您推荐一道${randomRecipe.name}，这是一道${randomRecipe.difficulty}的菜品，适合${randomRecipe.dietNote}。\n\n主要食材：\n${randomRecipe.ingredients.map((ing) => `- ${ing.name} ${ing.amount}`).join("\n")}\n\n烹饪时间：${randomRecipe.cookingTime}\n份量：${randomRecipe.servings}人份\n\n点击查看详细菜谱 👉`,
            recipes: [randomRecipe],
          },
        };

        // 使用消息构建器创建消息
        const recipeMessage = buildMessageFromAIResponse(mockResponse);
        addMessage(recipeMessage);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

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
