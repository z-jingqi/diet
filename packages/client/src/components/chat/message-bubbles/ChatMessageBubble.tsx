import { Markdown } from '@/components/ui/markdown';

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({ content }: { content: string }) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        <div className="bg-white rounded-lg p-2">
          <Markdown content={content} className="prose dark:prose-invert max-w-none" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble; 
