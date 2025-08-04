import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import FavoriteRecipes from "@/components/profile/settings/favorites/FavoriteRecipes";

const FavoriteRecipesPage = () => {
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);

  const handleBack = () => {
    navigate({ to: "/profile" });
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  return (
    <div className="flex flex-col h-dvh min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm font-normal -ml-2"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4" />
          我的菜谱
        </Button>
        
        <Button
          variant={isSelectionMode ? "default" : "outline"}
          size="sm"
          onClick={handleToggleSelectionMode}
          className="text-xs"
        >
          {isSelectionMode ? "退出选择" : "批量操作"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto w-full px-6 py-6 h-full">
          <FavoriteRecipes 
            isSelectionMode={isSelectionMode}
            onToggleSelectionMode={handleToggleSelectionMode}
          />
        </div>
      </div>
    </div>
  );
};

export default FavoriteRecipesPage;