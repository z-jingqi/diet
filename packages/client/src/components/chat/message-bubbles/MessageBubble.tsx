import type { Message } from "@diet/shared";
import RecipeMessageBubble from "./RecipeMessageBubble";
import HealthAdviceMessageBubble from "./HealthAdviceMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import ChatMessageBubble from "./ChatMessageBubble";

interface MessageBubbleProps {
  message: Message;
  onLike?: (recipeName: string) => void;
  onDislike?: (recipeName: string) => void;
  onSaveHealthAdvice?: (content: string) => void;
}

/**
 * 消息气泡组件
 */
const MessageBubble = ({
  message,
  onLike,
  onDislike,
  onSaveHealthAdvice,
}: MessageBubbleProps) => {
  if (message.isUser) {
    return <UserMessageBubble content={message.content} />;
  }

  if (message.type === "recipe") {
    return (
      <RecipeMessageBubble
        message={message}
        onLike={onLike}
        onDislike={onDislike}
      />
    );
  }

  if (message.type === "health_advice") {
    return (
      <HealthAdviceMessageBubble
        message={message}
        onSave={onSaveHealthAdvice}
      />
    );
  }

  // 普通chat消息
  return <ChatMessageBubble content={message.content} />;
};

export default MessageBubble;
