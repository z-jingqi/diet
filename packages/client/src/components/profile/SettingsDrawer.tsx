import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SettingsPanel from "./SettingsPanel";
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
      <SheetContent side="right" className="w-full max-w-sm p-0 flex flex-col">
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between">
          <SheetTitle>{group?.title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              ✕
            </Button>
          </SheetClose>
        </SheetHeader>
        {/* Reuse SettingsPanel for mobile drawer */}
        <SettingsPanel group={group} onItemClick={onItemClick} inDrawer />
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
