import { Markdown } from "@/components/ui/markdown";

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({
  content,
}: {
  content: string;
  status?: string;
}) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg">
          <Markdown
            content={content}
            className="prose dark:prose-invert max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
