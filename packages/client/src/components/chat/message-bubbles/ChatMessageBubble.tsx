import { Markdown } from "@/components/ui/markdown";
import type { Message } from "@diet/shared";

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({
  message,
}: {
  message: Message;
}) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg">
          <Markdown
            content={message.content}
            className="max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
