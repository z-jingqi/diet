import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { SettingGroup, SettingKey } from "./settings-config";

interface SettingsPanelProps {
  group: SettingGroup | null;
  onItemClick: (key: SettingKey) => void;
}

const SettingsPanel = ({ group, onItemClick }: SettingsPanelProps) => {
  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Typography variant="span" className="text-muted-foreground">
          选择一个设置分类
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-1 overflow-y-auto">
      <Typography variant="h4" className="mb-2">
        {group.title}
      </Typography>
      {group.items.map((item) => (
        <Button
          key={item.key}
          variant={item.variant === "danger" ? "destructive" : "outline"}
          className="w-full justify-start h-12 px-3"
          onClick={() => onItemClick(item.key)}
        >
          <span
            className={`mr-3 flex-shrink-0 ${
              item.variant === "danger" ? "text-destructive" : "text-gray-600"
            }`}
          >
            {item.icon}
          </span>
          <Typography variant="span" className="font-medium">
            {item.label}
          </Typography>
        </Button>
      ))}
    </div>
  );
};

export default SettingsPanel;
