import { Badge } from "@/components/ui/badge";
import { KitchenTool } from "@/data/kitchen-tools";
import { cn } from "@/lib/utils";

interface KitchenToolBadgeProps {
  tool: KitchenTool;
  selected: boolean;
  onToggle: (tool: KitchenTool) => void;
}

const KitchenToolBadge = ({
  tool,
  selected,
  onToggle,
}: KitchenToolBadgeProps) => {
  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      onClick={() => onToggle(tool)}
      className={cn(
        "cursor-pointer select-none transition-colors flex items-center gap-1 px-4 py-2 text-sm",
        selected && "bg-primary text-primary-foreground",
        !selected && "hover:bg-muted"
      )}
    >
      {tool.name}
    </Badge>
  );
};

export default KitchenToolBadge; 
