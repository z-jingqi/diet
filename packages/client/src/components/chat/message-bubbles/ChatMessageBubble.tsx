import { Markdown } from '@/components/ui/Markdown';
import { useEffect, useState } from 'react';

/**
 * 普通对话消息气泡
 */
const ChatMessageBubble = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // 每个字符的显示间隔

      return () => clearTimeout(timer);
    }
  }, [content, currentIndex]);

  return (
  <div className="flex w-full justify-start">
    <div className="max-w-[80%]">
      <div className="bg-white rounded-lg p-2">
          <Markdown content={displayedContent} className="prose dark:prose-invert max-w-none" />
      </div>
    </div>
  </div>
);
};

export default ChatMessageBubble; 
