import type { Message } from "@shared/types/chat";
import type { Recipe } from "@shared/schemas/recipe";
import ChatMessageBubble from "./ChatMessageBubble";
import RecipeMessageBubble from "./RecipeMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import HealthAdviceMessageBubble from "./HealthAdviceMessageBubble";

interface MessageBubbleProps {
  message: Message;
  onRecipeClick?: (recipe: Recipe) => void;
}

/**
 * 消息气泡组件
 */
const MessageBubble = ({ message, onRecipeClick }: MessageBubbleProps) => {
  if (message.isUser) {
    return <UserMessageBubble content={message.content} />;
  }

  switch (message.type) {
    case "recipe":
      return (
        <RecipeMessageBubble
          content={message.content}
          recipes={message.recipes || []}
          status={message.status}
          onRecipeClick={onRecipeClick}
        />
      );
    case "health_advice":
      return (
        <HealthAdviceMessageBubble
          content={message.content}
          healthAdvice={message.healthAdvice}
          status={message.status}
        />
      );
    default:
      return <ChatMessageBubble content={message.content} />;
  }
};

export default MessageBubble;
