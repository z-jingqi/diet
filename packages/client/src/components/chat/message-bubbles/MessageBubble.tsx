import RecipeMessageBubble from "./RecipeMessageBubble";
import HealthAdviceMessageBubble from "./HealthAdviceMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import ChatMessageBubble from "./ChatMessageBubble";
import { ChatMessage, MessageRole, MessageType } from "@/lib/gql/graphql";

interface MessageBubbleProps {
  message: ChatMessage;
  onLike?: (recipeName: string) => void;
  onDislike?: (recipeName: string) => void;
  onSaveHealthAdvice?: (content: string) => void;
}

/**
 * 消息气泡组件
 */
const MessageBubble = ({ message, onSaveHealthAdvice }: MessageBubbleProps) => {
  if (message.role === MessageRole.User) {
    return <UserMessageBubble content={message.content} />;
  }

  if (message.type === MessageType.Recipe) {
    return <RecipeMessageBubble message={message} />;
  }

  if (message.type === MessageType.HealthAdvice) {
    return (
      <HealthAdviceMessageBubble
        message={message}
        onSave={onSaveHealthAdvice}
      />
    );
  }

  // 普通chat消息
  return <ChatMessageBubble message={message} />;
};

export default MessageBubble;
