import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { SettingGroup, SettingKey } from "./settings-config";

interface SettingsDrawerProps {
  open: boolean;
  group: SettingGroup | null;
  onOpenChange: (open: boolean) => void;
  onItemClick: (key: SettingKey) => void;
}

const SettingsDrawer = ({
  open,
  group,
  onOpenChange,
  onItemClick,
}: SettingsDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm p-0">
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between">
          <SheetTitle>{group?.title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              ✕
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {group?.items.map((item) => (
            <Button
              key={item.key}
              variant={item.variant === "danger" ? "destructive" : "ghost"}
              className="w-full justify-start h-12 px-3"
              onClick={() => onItemClick(item.key)}
            >
              <span
                className={`mr-3 flex-shrink-0 ${
                  item.variant === "danger"
                    ? "text-destructive"
                    : "text-gray-600"
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
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
