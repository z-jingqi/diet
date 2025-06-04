import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import { Card, CardContent } from '@/components/ui/card';

interface MessageBubbleProps {
  message: Message;
  onRecipeClick?: (recipeId: string) => void;
}

export function MessageBubble({ message, onRecipeClick }: MessageBubbleProps) {
  const isRecipe = message.type === 'recipe';

  return (
    <div
      className={cn(
        'flex w-full',
        message.isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <Card
        className={cn(
          'max-w-[80%] shadow-sm',
          message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        <CardContent className="p-4">
          {isRecipe ? (
            <button
              onClick={() => message.recipeId && onRecipeClick?.(message.recipeId)}
              className="text-left underline underline-offset-2 hover:text-blue-600"
            >
              {message.content}
            </button>
          ) : (
            <p>{message.content}</p>
          )}
          <span className="mt-1 block text-xs opacity-70 text-right">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </CardContent>
      </Card>
    </div>
  );
} 
