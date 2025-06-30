import { useState, useEffect } from "react";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";

export const useRecipeDisplay = (
  message: ChatMessage,
  recipeDetailsCount: number
) => {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (
      message.status === MessageStatus.Done &&
      message.type === MessageType.Recipe &&
      recipeDetailsCount > 0
    ) {
      setShowCards(true);
    } else if (
      message.status === MessageStatus.Streaming ||
      message.status === MessageStatus.Pending
    ) {
      setShowCards(false);
    }
  }, [message.status, message.type, recipeDetailsCount]);

  return {
    showCards,
  };
};
