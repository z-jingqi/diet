import { useState, useEffect } from "react";
import { extractRecipeDetails } from "@/utils/recipe-parser";
import { Message, RecipeDetail } from "@diet/shared";
import { nanoid } from "nanoid";

interface UseRecipeDetailsProps {
  message: Message;
  onUpdateMessage?: (messageId: string, updates: Partial<Message>) => void;
}

export const useRecipeDetails = ({ message, onUpdateMessage }: UseRecipeDetailsProps) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetail[]>([]);

  useEffect(() => {
    // 只在消息状态为done时解析菜谱详情
    if (message.status === "done") {
      // 如果已经有菜谱详情且都有ID，则不再重新解析
      if (
        message.recipeDetails &&
        message.recipeDetails.length > 0 &&
        message.recipeDetails.every((d) => d.id)
      ) {
        setRecipeDetails(message.recipeDetails);
        return;
      }

      const details = extractRecipeDetails(message.content);
      const detailsWithIds = details.map((d) => ({
        ...d,
        id: d.id || nanoid(),
      }));
      setRecipeDetails(detailsWithIds);
    }
  }, [message.content, message.recipeDetails, message.status]);

  const updateRecipeDetail = (
    recipeDetailId: string,
    updates: Partial<RecipeDetail>
  ) => {
    setRecipeDetails((prev) => {
      const updatedDetails = prev.map((rd) => 
        rd.id === recipeDetailId ? { ...rd, ...updates } : rd
      );
      
      // 同步更新到 message 中的 recipeDetails
      if (onUpdateMessage) {
        onUpdateMessage(message.id, { recipeDetails: updatedDetails });
      }
      
      return updatedDetails;
    });
  };

  return {
    recipeDetails,
    updateRecipeDetail,
  };
};
