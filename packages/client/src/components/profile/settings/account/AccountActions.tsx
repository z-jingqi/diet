import { Button } from "@/components/ui/button";
import { LogOut, Trash2, Shield } from "lucide-react";

interface AccountActionsProps {
  className?: string;
  onLogout?: () => void;
  onDelete?: () => void;
  hideTitle?: boolean;
}

const AccountActions = ({
  className,
  onLogout,
  onDelete,
  hideTitle,
}: AccountActionsProps) => {
  return (
    <div className={className}>
      <div className="space-y-4">
        {!hideTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">账户操作</h3>
          </div>
        )}
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 font-normal"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-3 opacity-60" />
            <span className="text-sm">退出登录</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-destructive hover:text-destructive hover:bg-destructive/5 font-normal"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-3" />
            <span className="text-sm">删除账号 & 数据</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountActions;
