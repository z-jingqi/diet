// 提取 <recipe_suggestions> 标签内的内容
export const extractRecipeSection = (content: string): string => {
  const match = content.match(/<recipe_suggestions>([\s\S]*?)<\/recipe_suggestions>/);
  return match ? match[1] : content;
};

// 提取标签前的内容
export const extractBeforeRecipeSection = (content: string): string => {
  const match = content.match(/^([\s\S]*?)<recipe_suggestions>/);
  return match ? match[1].trim() : "";
};

// 提取标签后的内容
export const extractAfterRecipeSection = (content: string): string => {
  const match = content.match(/<\/recipe_suggestions>([\s\S]*?)$/);
  return match ? match[1].trim() : "";
};

// 从菜谱消息中提取菜品名称
export const extractRecipeNames = (content: string): string[] => {
  const section = extractRecipeSection(content);
  const recipeNames: string[] = [];
  // 匹配 **数字. 菜品名称** 或 **菜品名称** 格式
  const boldPattern = /\*\*(?:\d+\.)?\s*([^*]+)\*\*/g;
  let match;
  while ((match = boldPattern.exec(section)) !== null) {
    recipeNames.push(match[1].trim());
  }
  return recipeNames;
};

// 从菜谱消息中提取菜品详细信息
export const extractRecipeDetails = (content: string): Array<{
  name: string;
  servings?: string;
  tools?: string;
  cost?: string;
  difficulty?: string;
  features?: string;
}> => {
  const section = extractRecipeSection(content);
  const recipes: Array<{
    name: string;
    servings?: string;
    tools?: string;
    cost?: string;
    difficulty?: string;
    features?: string;
  }> = [];
  // 匹配菜品块
  const recipeBlockPattern = /\*\*(?:\d+\.)?\s*([^*]+)\*\*([\s\S]*?)(?=\*\*(?:\d+\.)?\s*[^*]+\*\*|$)/g;
  let match;
  while ((match = recipeBlockPattern.exec(section)) !== null) {
    const recipeName = match[1].trim();
    const recipeContent = match[2];
    const recipe: {
      name: string;
      servings?: string;
      tools?: string;
      cost?: string;
      difficulty?: string;
      features?: string;
    } = { name: recipeName };
    // 提取适用人数
    const servingsMatch = recipeContent.match(/适用人数：([^\n]+)/);
    if (servingsMatch) {
      recipe.servings = servingsMatch[1].trim();
    }
    // 提取关键厨具
    const toolsMatch = recipeContent.match(/关键厨具：([^\n]+)/);
    if (toolsMatch) {
      recipe.tools = toolsMatch[1].trim();
    }
    // 提取大概花费
    const costMatch = recipeContent.match(/大概花费：([^\n]+)/);
    if (costMatch) {
      recipe.cost = costMatch[1].trim();
    }
    // 提取难度
    const difficultyMatch = recipeContent.match(/难度：([^\n]+)/);
    if (difficultyMatch) {
      recipe.difficulty = difficultyMatch[1].trim();
    }
    // 提取特点
    const featuresMatch = recipeContent.match(/特点：([^\n]+)/);
    if (featuresMatch) {
      recipe.features = featuresMatch[1].trim();
    }
    recipes.push(recipe);
  }
  return recipes;
};

// 移除菜谱标记，获取纯文本内容
export const removeRecipeMarkers = (content: string): string => {
  return content
    .replace(/<recipe_suggestions>/g, "")
    .replace(/<\/recipe_suggestions>/g, "")
    .trim();
}; 