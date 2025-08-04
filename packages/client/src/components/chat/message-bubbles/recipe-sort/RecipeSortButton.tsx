import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type SortDirection = "default" | "asc" | "desc";

interface RecipeSortButtonProps {
  label: string;
  icon: LucideIcon;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}

const RecipeSortButton = ({
  label,
  icon: Icon,
  direction,
  onClick,
  className,
}: RecipeSortButtonProps) => {
  const getDirectionIcon = () => {
    switch (direction) {
      case "asc":
        return "↑";
      case "desc":
        return "↓";
      default:
        return "";
    }
  };

  const getButtonVariant = () => {
    switch (direction) {
      case "asc":
      case "desc":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <Button
      variant={getButtonVariant()}
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 h-7 text-xs font-medium transition-all duration-200 flex-shrink-0",
        direction !== "default" && "bg-primary text-primary-foreground",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      {direction !== "default" && (
        <span className="text-xs font-bold">{getDirectionIcon()}</span>
      )}
    </Button>
  );
};

export default RecipeSortButton;
