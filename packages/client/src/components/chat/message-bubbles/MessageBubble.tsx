import type { Message } from "@diet/shared";
import StreamingMessageBubble from "./StreamingMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import ChatMessageBubble from "./ChatMessageBubble";

interface MessageBubbleProps {
  message: Message;
  onStartCooking?: (recipeName: string) => void;
  onLike?: (recipeName: string) => void;
  onDislike?: (recipeName: string) => void;
}

/**
 * 消息气泡组件
 */
const MessageBubble = ({ message, onStartCooking, onLike, onDislike }: MessageBubbleProps) => {
  if (message.isUser) {
    return <UserMessageBubble content={message.content} />;
  }

  if (message.type === "recipe") {
    return (
      <StreamingMessageBubble
        message={message}
        onStartCooking={onStartCooking}
        onLike={onLike}
        onDislike={onDislike}
      />
    );
  }

  // 普通chat消息
  return <ChatMessageBubble content={message.content} />;
};

export default MessageBubble;
