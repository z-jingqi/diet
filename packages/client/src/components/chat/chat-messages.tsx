import { useChatStore } from '../../store/chat';
import { MessageBubble } from './message-bubble';

export function ChatMessages() {
  const { messages, isLoading } = useChatStore();

  const handleRecipeClick = (recipeId: string) => {
    // TODO: 跳转到菜谱页面
    console.log('Navigate to recipe:', recipeId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRecipeClick={handleRecipeClick}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <p className="text-gray-500">AI 正在思考...</p>
          </div>
        </div>
      )}
    </div>
  );
} 
