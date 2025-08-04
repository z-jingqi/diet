import { useState, useCallback } from "react";
import { DollarSign, Clock, ChefHat, Utensils } from "lucide-react";
import RecipeSortButton, { SortDirection } from "./RecipeSortButton";
import { Typography } from "@/components/ui/typography";

export interface SortConfig {
  price: SortDirection;
  time: SortDirection;
  difficulty: SortDirection;
  status: SortDirection;
}

interface RecipeSortToolbarProps {
  onSortChange: (config: SortConfig) => void;
}

const RecipeSortToolbar = ({ onSortChange }: RecipeSortToolbarProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    price: "default",
    time: "default",
    difficulty: "default",
    status: "default",
  });

  const cycleSortDirection = useCallback(
    (current: SortDirection): SortDirection => {
      switch (current) {
        case "default":
          return "asc";
        case "asc":
          return "desc";
        case "desc":
          return "default";
        default:
          return "default";
      }
    },
    [],
  );

  const handleSortClick = useCallback(
    (key: keyof SortConfig) => {
      const newConfig = {
        ...sortConfig,
        [key]: cycleSortDirection(sortConfig[key]),
      };
      setSortConfig(newConfig);
      onSortChange(newConfig);
    },
    [sortConfig, cycleSortDirection, onSortChange],
  );

  return (
    <div className="flex items-center justify-between gap-1.5 p-3">
      <RecipeSortButton
        label="价格"
        icon={DollarSign}
        direction={sortConfig.price}
        onClick={() => handleSortClick("price")}
      />

      <RecipeSortButton
        label="时间"
        icon={Clock}
        direction={sortConfig.time}
        onClick={() => handleSortClick("time")}
      />

      <RecipeSortButton
        label="难度"
        icon={ChefHat}
        direction={sortConfig.difficulty}
        onClick={() => handleSortClick("difficulty")}
      />

      <RecipeSortButton
        label="状态"
        icon={Utensils}
        direction={sortConfig.status}
        onClick={() => handleSortClick("status")}
      />
    </div>
  );
};

export default RecipeSortToolbar;
