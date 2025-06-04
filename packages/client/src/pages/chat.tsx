import { ChatInput } from '../components/chat/chat-input';
import { ChatMessages } from '../components/chat/chat-messages';

export function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">智能饮食助手</h1>
      </header>
      <ChatMessages />
      <ChatInput />
    </div>
  );
} 
