import { ChatMessage } from "@/lib/gql/graphql";
import MessageBubbleV2 from "./MessageBubbleV2";
import { User } from "lucide-react";

interface UserMessageBubbleV2Props {
  message: ChatMessage;
}

/**
 * Message bubble for user messages
 */
const UserMessageBubbleV2 = ({ message }: UserMessageBubbleV2Props) => {
  return (
    <div className="flex items-start gap-2 justify-end">
      <MessageBubbleV2 message={message} className="bg-primary text-primary-foreground" />
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
};

export default UserMessageBubbleV2; 
