import { useState, useEffect } from "react";
import { Message } from "@diet/shared";

export const useRecipeDisplay = (
  message: Message, 
  recipeDetailsCount: number
) => {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (
      message.status === "done" &&
      message.type === "recipe" &&
      recipeDetailsCount > 0
    ) {
      setShowCards(true);
    } else if (message.status === "streaming" || message.status === "pending") {
      setShowCards(false);
    }
  }, [message.status, message.type, recipeDetailsCount]);

  return {
    showCards,
  };
}; 