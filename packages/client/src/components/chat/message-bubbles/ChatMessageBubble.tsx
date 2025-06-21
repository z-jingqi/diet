import { Markdown } from '@/components/ui/markdown';
import { MutedText, ErrorText } from '@/components/ui/typography';

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({ 
  content, 
  status 
}: { 
  content: string;
  status?: string;
}) => {
  if (status === 'pending') {
    return <MutedText className="animate-pulse">正在回复...</MutedText>;
  }
  
  if (status === 'error') {
    return <ErrorText>回复失败，请重试</ErrorText>;
  }
  
  if (status === 'abort') {
    return <MutedText>回复已中断</MutedText>;
  }

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
