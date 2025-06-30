import { useState, useEffect } from "react";
import { extractRecipeDetails } from "@/utils/recipe-parser";
import { RecipeDetail } from "@diet/shared";
import { ChatMessage, MessageStatus } from "@/lib/gql/graphql";

interface UseRecipeDetailsProps {
  message: ChatMessage;
}

export const useRecipeDetails = ({ message }: UseRecipeDetailsProps) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetail[]>([]);

  useEffect(() => {
    // 只在消息状态为done时解析菜谱详情
    if (message.status === MessageStatus.Done) {
      const details = extractRecipeDetails(message.content || "");
      // TODO:把details和生成的菜谱关联起来
      setRecipeDetails(details);
    }
  }, [message.content, message.status]);

  return {
    recipeDetails,
  };
};
