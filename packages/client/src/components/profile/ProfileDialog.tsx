import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfileContent from "@/components/profile/ProfileContent";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] rounded-t-xl border-t-2 p-0"
      >
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between">
          <SheetTitle className="text-left text-lg">个人设置</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <ProfileContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileDialog;
