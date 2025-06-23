import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography, MutedText } from "@/components/ui/typography";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import KitchenToolsList from "@/components/kitchen-tools/KitchenToolsList";
import CustomToolInput from "@/components/kitchen-tools/CustomToolInput";

const KitchenToolsPage = () => {
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [customTools, setCustomTools] = useState<string[]>([]);

  const handleToolToggle = (toolId: string, checked: boolean) => {
    if (checked) {
      setSelectedTools(prev => [...prev, toolId]);
    } else {
      setSelectedTools(prev => prev.filter(id => id !== toolId));
    }
  };

  const handleAddCustomTool = (tool: string) => {
    setCustomTools(prev => [...prev, tool]);
  };

  const handleRemoveCustomTool = (tool: string) => {
    setCustomTools(prev => prev.filter(t => t !== tool));
  };

  const handleSave = () => {
    // TODO: 保存厨具设置到本地存储或后端
    const allTools = [...selectedTools, ...customTools];
    console.log("保存厨具设置:", allTools);
    
    // 保存到 localStorage
    localStorage.setItem("kitchenTools", JSON.stringify(allTools));
    
    // 返回上一页
    navigate({ to: "/" });
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        <Typography variant="h3" className="text-lg font-semibold">
          我的厨具
        </Typography>
        <Button
          size="sm"
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Save className="w-4 h-4 mr-1" />
          保存
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 说明 */}
        <Card>
          <CardContent className="p-4">
            <Typography variant="span" className="text-sm text-gray-600">
              选择您拥有的厨具，这样AI就能为您推荐更适合的菜谱了。
            </Typography>
          </CardContent>
        </Card>

        {/* 常用厨具列表 */}
        <Card>
          <CardContent className="p-4">
            <KitchenToolsList
              selectedTools={selectedTools}
              onToolToggle={handleToolToggle}
            />
          </CardContent>
        </Card>

        {/* 自定义厨具 */}
        <Card>
          <CardContent className="p-4">
            <CustomToolInput
              customTools={customTools}
              onAddTool={handleAddCustomTool}
              onRemoveTool={handleRemoveCustomTool}
            />
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <Typography variant="span" className="text-lg font-semibold">
                已选择 {selectedTools.length + customTools.length} 件厨具
              </Typography>
              <MutedText className="text-sm">
                常用厨具: {selectedTools.length} 件 | 自定义厨具: {customTools.length} 件
              </MutedText>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KitchenToolsPage; 
