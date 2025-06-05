import { useChatStore } from '../../store/chat';
import { MessageBubble } from './message-bubble';

export function ChatMessages() {
  const { messages, isLoading } = useChatStore();

  const handleRecipeClick = (recipeId: string) => {
    // TODO: 跳转到菜谱页面
    console.log('Navigate to recipe:', recipeId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRecipeClick={handleRecipeClick}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="text-gray-500">AI 正在思考...</div>
        </div>
      )}
    </div>
  );
} 
