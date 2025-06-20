import { Typography } from "@/components/ui/typography";
import KitchenToolItem from "./KitchenToolItem";
import { kitchenToolsData } from "@/data/kitchen-tools";

interface KitchenToolsListProps {
  selectedTools: string[];
  onToolToggle: (toolId: string, checked: boolean) => void;
}

const KitchenToolsList = ({
  selectedTools,
  onToolToggle,
}: KitchenToolsListProps) => {
  return (
    <div className="space-y-6">
      <Typography variant="h4" className="text-lg font-semibold">
        常用厨具
      </Typography>

      <div className="space-y-6">
        {kitchenToolsData.categories.map((category) => (
          <div key={category.name} className="space-y-3">
            <Typography
              variant="h5"
              className="text-base font-medium text-gray-700"
            >
              {category.name}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {category.tools.map((tool) => (
                <KitchenToolItem
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  checked={selectedTools.includes(tool.id)}
                  onCheckedChange={(checked) => onToolToggle(tool.id, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenToolsList;
