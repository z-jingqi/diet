import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage, MessageRole, MessageStatus } from "@/lib/gql/graphql";

interface MessageBubbleV2Props {
  message: ChatMessage;
  children?: ReactNode;
  className?: string;
}

/**
 * Base message bubble component that provides common styling and layout for all message types
 */
const MessageBubbleV2 = ({ message, children, className = "" }: MessageBubbleV2Props) => {
  const isUser = message.role === MessageRole.User;
  const hasError = message.status === MessageStatus.Error;
  
  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 px-1",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {/* Main bubble content */}
      <div
        className={cn(
          "relative rounded-lg px-4 py-2 max-w-[85%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          hasError && "bg-destructive/10 border border-destructive",
          className
        )}
      >
        {/* Content */}
        {children || (
          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
            {message.content || ""}
            
            {hasError && (
              <div className="text-destructive mt-2 text-xs">
                Error: Message failed to generate. Please try again.
              </div>
            )}
            
            {message.status === MessageStatus.Streaming && (
              <span className="ml-1 inline-block h-4 w-1 animate-blink bg-current"></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubbleV2; 
