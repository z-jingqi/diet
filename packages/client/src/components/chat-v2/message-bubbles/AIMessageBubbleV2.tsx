import { ChatMessage, MessageType } from "@/lib/gql/graphql";
import MessageBubbleV2 from "./MessageBubbleV2";
import { Bot } from "lucide-react";

interface AIMessageBubbleV2Props {
  message: ChatMessage;
}

/**
 * Message bubble for AI messages (standard chat type)
 */
const AIMessageBubbleV2 = ({ message }: AIMessageBubbleV2Props) => {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <MessageBubbleV2 message={message} />
    </div>
  );
};

export default AIMessageBubbleV2; 
