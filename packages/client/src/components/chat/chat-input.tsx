import { useState } from 'react';
import { useChatStore } from '../../store/chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    addMessage({
      id: Date.now().toString(),
      type: 'text',
      content: input,
      timestamp: new Date().toISOString(),
      isUser: true
    });

    setInput('');
    setLoading(true);

    try {
      // TODO: 调用 AI 接口
      // 模拟 AI 响应
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          type: 'text',
          content: '这是一个模拟的 AI 响应。',
          timestamp: new Date().toISOString(),
          isUser: false
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-background">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入您的问题..."
        className="flex-1"
      />
      <Button type="submit">发送</Button>
    </form>
  );
} 
