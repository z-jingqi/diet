import { Typography } from "@/components/ui/typography";
import { KitchenToolCategory, KitchenTool } from "@/data/kitchen-tools";
import KitchenToolBadge from "./KitchenToolBadge";

interface KitchenToolCategorySectionProps {
  category: KitchenToolCategory;
  selectedToolIds: Set<string>;
  onToggle: (tool: KitchenTool) => void;
}

const KitchenToolCategorySection = ({
  category,
  selectedToolIds,
  onToggle,
}: KitchenToolCategorySectionProps) => {
  return (
    <div className="space-y-2">
      <Typography variant="h5" className="font-medium">
        {category.name}
      </Typography>
      <div className="flex flex-wrap gap-2">
        {category.tools.map((tool) => (
          <KitchenToolBadge
            key={tool.id}
            tool={tool}
            selected={selectedToolIds.has(tool.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default KitchenToolCategorySection; 
