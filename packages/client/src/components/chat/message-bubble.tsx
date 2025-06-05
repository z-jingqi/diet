import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  onRecipeClick?: (recipeId: string) => void;
}

export function MessageBubble({ message, onRecipeClick }: MessageBubbleProps) {
  const isRecipe = message.type === "recipe";

  if (message.isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[80%] bg-[#e9e9e9]/80 rounded-lg">
          <p className="text-gray-900 p-2">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%]">
        {isRecipe ? (
          <button
            onClick={() =>
              message.recipeId && onRecipeClick?.(message.recipeId)
            }
            className="text-left underline underline-offset-2 hover:text-blue-600"
          >
            {message.content}
          </button>
        ) : (
          <p className="text-gray-900">{message.content}</p>
        )}
      </div>
    </div>
  );
}
