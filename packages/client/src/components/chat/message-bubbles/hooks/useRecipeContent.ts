import { useState, useEffect } from "react";
import { 
  extractBeforeRecipeSection, 
  extractAfterRecipeSection 
} from "@/utils/recipe-parser";
import { Message } from "@diet/shared";

export const useRecipeContent = (message: Message) => {
  const [beforeText, setBeforeText] = useState<string>("");
  const [afterText, setAfterText] = useState<string>("");

  useEffect(() => {
    setBeforeText(extractBeforeRecipeSection(message.content));
    setAfterText(extractAfterRecipeSection(message.content));
  }, [message.content]);

  return {
    beforeText,
    afterText,
  };
}; 