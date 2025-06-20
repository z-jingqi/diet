import { Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MutedText } from "@/components/ui/typography";
import type { KitchenTool } from "@shared/schemas/recipe";

interface KitchenToolsDisplayProps {
  kitchenTools: KitchenTool[];
}

const KitchenToolsDisplay = ({ kitchenTools }: KitchenToolsDisplayProps) => {
  if (!kitchenTools || kitchenTools.length === 0) {
    return null;
  }

  const requiredTools = kitchenTools.filter(tool => tool.required);
  const optionalTools = kitchenTools.filter(tool => !tool.required);

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Utensils className="w-4 h-4 mr-1" />
        <MutedText className="text-sm font-medium">
          需要厨具：
        </MutedText>
      </div>
      <div className="flex flex-wrap gap-1">
        {requiredTools.map((tool) => (
          <Badge
            key={tool.name}
            variant="outline"
            className="text-xs border-orange-500 text-orange-700 bg-orange-50"
          >
            {tool.name}
          </Badge>
        ))}
        {optionalTools.map((tool) => (
          <Badge
            key={tool.name}
            variant="outline"
            className="text-xs border-gray-300 text-gray-600 bg-gray-50"
          >
            {tool.name} (可选)
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default KitchenToolsDisplay; 
