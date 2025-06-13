import type { Message } from "@shared/types/chat";
import type { Recipe } from "@shared/types/recipe";
import ChatMessageBubble from "./ChatMessageBubble";
import RecipeMessageBubble from "./RecipeMessageBubble";
import UserMessageBubble from "./UserMessageBubble";

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
    case "health_advice":
      // TODO: 健康建议消息气泡
      return <div>健康建议消息气泡</div>;
    default:
      return <ChatMessageBubble content={message.content} />;
  }
};

export default MessageBubble;
