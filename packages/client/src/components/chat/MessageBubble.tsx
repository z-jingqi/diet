import type { Message } from "@/types/chat";
import type { Recipe } from "@/types/recipe";
import ChatMessageBubble from "./message-bubbles/ChatMessageBubble";
import FoodAvailabilityMessageBubble from "./message-bubbles/FoodAvailabilityMessageBubble";
import RecipeMessageBubble from "./message-bubbles/RecipeMessageBubble";
import UserMessageBubble from "./message-bubbles/UserMessageBubble";

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
          onRecipeClick={onRecipeClick}
        />
      );
    case "food_availability":
      return (
        <FoodAvailabilityMessageBubble
          content={message.content}
          foodAvailability={message.foodAvailability}
        />
      );
    default:
      return <ChatMessageBubble content={message.content} />;
  }
};

export default MessageBubble;
