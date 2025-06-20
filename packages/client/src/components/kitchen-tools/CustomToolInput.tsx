import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography, MutedText } from "@/components/ui/typography";
import { Plus, X } from "lucide-react";

interface CustomToolInputProps {
  customTools: string[];
  onAddTool: (tool: string) => void;
  onRemoveTool: (tool: string) => void;
}

const CustomToolInput = ({ customTools, onAddTool, onRemoveTool }: CustomToolInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTool = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !customTools.includes(trimmedValue)) {
      onAddTool(trimmedValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTool();
    }
  };

  return (
    <div className="space-y-4">
      <Typography variant="h4" className="text-lg font-semibold">
        自定义厨具
      </Typography>
      
      {/* 输入框 */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入厨具名称，如：破壁机"
          className="flex-1"
        />
        <Button
          onClick={handleAddTool}
          disabled={!inputValue.trim()}
          size="sm"
          className="px-4"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* 自定义厨具列表 */}
      {customTools.length > 0 && (
        <div className="space-y-2">
          <MutedText className="text-sm">
            已添加的自定义厨具：
          </MutedText>
          <div className="flex flex-wrap gap-2">
            {customTools.map((tool) => (
              <div
                key={tool}
                className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{tool}</span>
                <button
                  onClick={() => onRemoveTool(tool)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomToolInput; 
