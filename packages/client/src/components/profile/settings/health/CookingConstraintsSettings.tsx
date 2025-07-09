import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Timer, X } from "lucide-react";
import { Typography, MutedText } from "@/components/ui/typography";
import { kitchenToolsData, KitchenTool, KitchenToolCategory } from "@/data/kitchen-tools";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React from "react";
import KitchenToolCategorySection from "@/components/kitchen-tools/KitchenToolCategorySection";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CookingConstraintsSettingsProps {
  className?: string;
}

// Removed inline sub-components; now imported.

const CookingConstraintsSettings = ({
  className,
}: CookingConstraintsSettingsProps) => {
  const [selectedToolIds, setSelectedToolIds] = React.useState<string[]>([]);
  const [customTools, setCustomTools] = React.useState<string[]>([]);
  const [customInput, setCustomInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  const datasetTools = React.useMemo(
    () => kitchenToolsData.categories.flatMap((c) => c.tools),
    []
  );

  const addCustomTool = () => {
    const value = customInput.trim();
    if (!value) return;
    const lower = value.toLowerCase();

    // 1) 检查是否为数据集中已有的厨具
    const datasetTool = datasetTools.find(
      (tool) => tool.name.toLowerCase() === lower
    );

    if (datasetTool) {
      if (selectedToolIds.includes(datasetTool.id)) {
        toast.info(`${datasetTool.name} 已经添加`);
      } else {
        setSelectedToolIds((prev) => [...prev, datasetTool.id]);
      }
      setCustomInput("");
      return;
    }

    // 2) 检查自定义列表重复
    if (customTools.some((t) => t.toLowerCase() === lower)) {
      toast.info(`${value} 已经添加`);
      setCustomInput("");
      return;
    }

    // 3) 新增自定义厨具
    setCustomTools((prev) => [...prev, value]);
    setCustomInput("");
  };

  const handleCustomKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTool();
    }
  };

  const removeCustomTool = (name: string) => {
    setCustomTools((prev) => prev.filter((t) => t !== name));
  };

  const removeDatasetTool = (id: string) => {
    setSelectedToolIds((prev) => prev.filter((tid) => tid !== id));
  };

  const selectedToolIdsSet = React.useMemo(
    () => new Set(selectedToolIds),
    [selectedToolIds]
  );

  const toggleTool = (tool: KitchenTool) => {
    setSelectedToolIds((prev) =>
      prev.includes(tool.id)
        ? prev.filter((id) => id !== tool.id)
        : [...prev, tool.id]
    );
  };

  // Filter categories by search term (matches category name or tool name)
  const filteredCategories = React.useMemo(() => {
    if (!search.trim()) return kitchenToolsData.categories;
    const lower = search.toLowerCase();
    return kitchenToolsData.categories
      .map((cat) => {
        // Determine if category matches search
        const catMatches = cat.name.toLowerCase().includes(lower);
        const filteredTools = cat.tools.filter((tool) =>
          tool.name.toLowerCase().includes(lower)
        );
        if (catMatches) {
          return cat; // include entire category
        }
        return filteredTools.length > 0
          ? { ...cat, tools: filteredTools }
          : null;
      })
      .filter(Boolean) as KitchenToolCategory[];
  }, [search]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-blue-500" />
          烹饪条件
        </CardTitle>
        <MutedText>配置可用时间或厨房设备等限制</MutedText>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search input */}
        <Input
          placeholder="搜索分类或厨具名称，如 '锅' 或 '刀具'"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category sections */}
        <div className="space-y-6 max-h-[320px] overflow-y-auto pr-1">
          {filteredCategories.map((category) => (
            <KitchenToolCategorySection
              key={category.name}
              category={category}
              selectedToolIds={selectedToolIdsSet}
              onToggle={toggleTool}
            />
          ))}
          {filteredCategories.length === 0 && (
            <Typography variant="span" className="text-sm text-muted-foreground">
              未找到匹配的厨具
            </Typography>
          )}
        </div>

        {/* Selected tools */}
        {selectedToolIds.length + customTools.length > 0 && (
          <div className="space-y-2">
            <Typography variant="h5" className="font-medium">
              已选择的厨具
            </Typography>
            <div className="flex flex-wrap gap-2">
              {selectedToolIds.map((id) => {
                const tool = kitchenToolsData.categories
                  .flatMap((c) => c.tools)
                  .find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <Badge
                    key={tool.id}
                    variant="secondary"
                    className={cn("flex items-center gap-1 px-2 py-1 text-xs")}
                  >
                    {tool.name}
                    <button
                      onClick={() => removeDatasetTool(tool.id)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}

              {customTools.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 text-xs"
                >
                  {name}
                  <button
                    onClick={() => removeCustomTool(name)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Custom tool input */}
        <div className="flex gap-2">
          <Input
            placeholder="自定义厨具，如 '烤网'"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleCustomKeyDown}
          />
          <button
            className={cn(
              "px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
              !customInput.trim() && "cursor-not-allowed"
            )}
            disabled={!customInput.trim()}
            onClick={addCustomTool}
          >
            添加
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CookingConstraintsSettings;
