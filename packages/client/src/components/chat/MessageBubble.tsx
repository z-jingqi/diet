import type { Message } from '@/types/Chat';
import type { Recipe } from '@/types/Recipe';
import UserMessageBubble from "./message-bubbles/user-message-bubble";
import ChatMessageBubble from "./message-bubbles/chat-message-bubble";
import RecipeMessageBubble from "./message-bubbles/recipe-message-bubble";
import FoodAvailabilityMessageBubble from "./message-bubbles/food-availability-message-bubble";

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
    case 'recipe':
      return (
        <RecipeMessageBubble 
          content={message.content} 
          recipes={message.recipes || []} 
          onRecipeClick={onRecipeClick}
        />
      );
    case 'food_availability':
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
