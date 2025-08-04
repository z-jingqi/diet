import { Markdown } from "@/components/ui/markdown";
import { ChatMessage } from "@/lib/gql/graphql";

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex w-full justify-start mb-4">
      <div className="bg-background rounded-lg w-full">
        <Markdown content={message.content || ""} className="max-w-none prose-sm" />
      </div>
    </div>
  );
};

export default ChatMessageBubble;
