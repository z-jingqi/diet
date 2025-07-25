import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2, Shield } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

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
    <Card className={cn("border", className)}>
      {!hideTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            账户操作
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-3"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <Typography variant="span" className="font-medium">
            退出登录
          </Typography>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-3 text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-3" />
          <Typography variant="span" className="font-medium">
            删除账号 & 数据
          </Typography>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountActions;
