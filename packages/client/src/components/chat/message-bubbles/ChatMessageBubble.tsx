import { Markdown } from "@/components/ui/markdown";
import { ChatMessage } from "@/lib/gql/graphql";

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="flex w-full justify-start">
      <div className="bg-white rounded-lg">
        <Markdown content={message.content || ""} className="max-w-none" />
      </div>
    </div>
  );
};

export default ChatMessageBubble;
