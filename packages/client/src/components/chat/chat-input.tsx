import { useState } from 'react';
import { useChatStore } from '../../store/chat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Message } from '../../types/chat';
import CHAT_PROMPT from '../../prompts/chat-prompt';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { addMessage, setLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'chat',
      isUser: true,
      createdAt: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      // 使用模板格式化用户输入
      const prompt = CHAT_PROMPT.replace('{user_input}', input);
      
      // TODO: 调用 AI 接口，发送 prompt
      // 模拟 AI 响应
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '这是一个模拟的 AI 响应。',
          type: 'chat',
          isUser: false,
          createdAt: new Date()
        };
        addMessage(aiMessage);
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
