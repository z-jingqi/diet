import { useState, useEffect } from "react";
import {
  extractBeforeRecipeSection,
  extractAfterRecipeSection,
} from "@/utils/recipe-parser";
import { ChatMessage } from "@/lib/gql/graphql";

export const useRecipeContent = (message: ChatMessage) => {
  const [beforeText, setBeforeText] = useState<string>("");
  const [afterText, setAfterText] = useState<string>("");

  useEffect(() => {
    setBeforeText(extractBeforeRecipeSection(message.content || ""));
    setAfterText(extractAfterRecipeSection(message.content || ""));
  }, [message.content]);

  return {
    beforeText,
    afterText,
  };
};
