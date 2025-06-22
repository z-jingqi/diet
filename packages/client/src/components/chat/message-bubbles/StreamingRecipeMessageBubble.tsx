import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  isRecipeMessage,
  extractRecipeDetails,
  extractBeforeRecipeSection,
  extractAfterRecipeSection,
} from "@/utils/recipe-parser";
import { Markdown } from "@/components/ui/markdown";
import { Typography, MutedText, ErrorText } from "@/components/ui/typography";
import { ThumbsDown, ThumbsUp, Users, Utensils, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeDetail {
  name: string;
  servings?: string;
  tools?: string;
  cost?: string;
  difficulty?: string;
  features?: string;
}

interface StreamingRecipeMessageBubbleProps {
  message: { content: string; status?: string };
  onStartCooking?: (recipeName: string) => void;
  onLike?: (recipeName: string) => void;
  onDislike?: (recipeName: string) => void;
}

const difficultyMap = {
  "简单": { className: "bg-green-500" },
  "中等": { className: "bg-yellow-500" },
  "困难": { className: "bg-orange-500" },
} as const;

const StreamingRecipeMessageBubble = ({ 
  message, 
  onStartCooking, 
  onLike, 
  onDislike 
}: StreamingRecipeMessageBubbleProps) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetail[]>([]);
  const [beforeText, setBeforeText] = useState<string>("");
  const [afterText, setAfterText] = useState<string>("");
  const [showCards, setShowCards] = useState(false);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [dislikedRecipes, setDislikedRecipes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isRecipeMessage(message.content)) {
      setRecipeDetails(extractRecipeDetails(message.content));
      // 分别提取标签前和标签后的内容
      setBeforeText(extractBeforeRecipeSection(message.content));
      setAfterText(extractAfterRecipeSection(message.content));
    } else {
      setRecipeDetails([]);
      setBeforeText("");
      setAfterText("");
    }
  }, [message.content]);

  // 当消息完成且是菜谱消息时，切换到卡片视图
  useEffect(() => {
    if (message.status === 'done' && isRecipeMessage(message.content) && recipeDetails.length > 0) {
      setShowCards(true);
    } else if (message.status === 'streaming' || message.status === 'pending') {
      setShowCards(false);
    }
  }, [message.status, message.content, recipeDetails.length]);

  const handleLike = (recipeName: string) => {
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.add(recipeName);
      return newSet;
    });
    setDislikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.delete(recipeName);
      return newSet;
    });
    onLike?.(recipeName);
  };

  const handleDislike = (recipeName: string) => {
    setDislikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.add(recipeName);
      return newSet;
    });
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.delete(recipeName);
      return newSet;
    });
    onDislike?.(recipeName);
  };

  // 状态显示
  if (message.status === 'pending' && recipeDetails.length === 0) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[80%]">
          <div className="bg-white rounded-lg p-4">
            <MutedText className="animate-pulse">推荐菜谱中...</MutedText>
          </div>
        </div>
      </div>
    );
  }
  if (message.status === 'error' && recipeDetails.length === 0) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[80%]">
          <div className="bg-white rounded-lg p-4">
            <ErrorText>推荐菜谱失败，请重试</ErrorText>
          </div>
        </div>
      </div>
    );
  }
  if (message.status === 'abort' && recipeDetails.length === 0) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[80%]">
          <div className="bg-white rounded-lg p-4">
            <Typography variant="span" className="text-orange-600 dark:text-orange-400">
              推荐菜谱已中断
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  // 流式过程中显示 Markdown
  if (!showCards) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[80%]">
          <div className="bg-white rounded-lg p-4">
            <Markdown
              content={message.content}
              className="prose dark:prose-invert max-w-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // 流式结束后显示卡片
  return (
    <div className="flex w-full justify-start">
      <div className="w-full max-w-4xl">
        <div className="space-y-4">
          {/* 标签前的内容 */}
          {beforeText && (
            <div className="bg-white rounded-lg p-4">
              <Markdown
                content={beforeText}
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          )}
          
          {/* 推荐菜谱卡片列表 */}
          {recipeDetails.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <Typography variant="h3" className="mb-4 text-gray-800">
                  推荐菜谱
                </Typography>
                <div className="flex flex-wrap gap-4">
                  {recipeDetails.map((recipe, index) => {
                    const difficulty = difficultyMap[recipe.difficulty as keyof typeof difficultyMap] || { className: "bg-gray-500" };
                    const isLiked = likedRecipes.has(recipe.name);
                    const isDisliked = dislikedRecipes.has(recipe.name);
                    
                    return (
                      <div key={`${recipe.name}-${index}`} className="w-80 flex-shrink-0 border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <Typography variant="h5" className="leading-none tracking-tight text-gray-800">
                            {recipe.name}
                          </Typography>
                          {recipe.difficulty && (
                            <Badge className={cn("text-white", difficulty.className)}>
                              {recipe.difficulty}
                            </Badge>
                          )}
                        </div>
                        {recipe.cost && (
                          <div className="pb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {recipe.cost}
                            </Badge>
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recipe.servings && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <MutedText>{recipe.servings}</MutedText>
                              </div>
                            )}
                            {recipe.tools && recipe.tools !== "无" && (
                              <div className="flex items-center">
                                <Utensils className="w-4 h-4 mr-2 text-gray-500" />
                                <MutedText>{recipe.tools}</MutedText>
                              </div>
                            )}
                          </div>
                          {recipe.features && (
                            <MutedText className="leading-relaxed">{recipe.features}</MutedText>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLike(recipe.name)}
                              className={cn(
                                "h-8 w-8 p-0",
                                isLiked ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-green-600"
                              )}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDislike(recipe.name)}
                              className={cn(
                                "h-8 w-8 p-0",
                                isDisliked ? "text-red-600 bg-red-50" : "text-gray-500 hover:text-red-600"
                              )}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onStartCooking?.(recipe.name)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <ChefHat className="w-4 h-4 mr-1" />
                            开始烹饪
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 标签后的内容 */}
          {afterText && (
            <div className="bg-white rounded-lg p-4">
              <Markdown
                content={afterText}
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingRecipeMessageBubble; 