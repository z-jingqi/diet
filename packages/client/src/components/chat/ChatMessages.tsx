import useChatStore from '@/store/Chat';
import MessageBubble from "./message-bubble";
import { useNavigate } from "react-router-dom";
import useRecipeStore from '@/store/Recipe';
import type { Recipe } from '@/types/Recipe';

const ChatMessages = () => {
  const { messages, isLoading } = useChatStore();
  const navigate = useNavigate();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);

  const handleRecipeClick = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    navigate("/recipe");
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
};

export default ChatMessages;
