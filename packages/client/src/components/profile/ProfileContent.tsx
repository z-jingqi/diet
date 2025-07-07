import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MutedText, Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Palette, Utensils, ChefHat, Pizza } from "lucide-react";

interface ProfileContentProps {
  className?: string;
}

const ProfileContent = ({ className }: ProfileContentProps) => {
  const { user } = useAuth();

  // Display name logic
  const displayName = user?.nickname || user?.username || "访客";

  // Placeholder menu items – will be wired up later
  const menuItems: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }[] = [
    {
      label: "主题设置",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      label: "口味偏好",
      icon: <Utensils className="h-5 w-5" />,
    },
    {
      label: "菜系偏好",
      icon: <ChefHat className="h-5 w-5" />,
    },
    {
      label: "食物偏好",
      icon: <Pizza className="h-5 w-5" />,
    },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4 py-6 lg:flex-row lg:justify-start lg:items-center lg:px-6 border-b">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="text-xl font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Typography variant="h2" className="text-xl font-semibold">
          {displayName}
        </Typography>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left menu */}
        <div className="border-r lg:w-64 p-2 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start h-12 px-3"
                onClick={item.onClick}
              >
                <span className="mr-3 text-gray-600">{item.icon}</span>
                <Typography variant="span" className="font-medium">
                  {item.label}
                </Typography>
              </Button>
            ))}
          </div>
        </div>

        {/* Right content placeholder */}
        <div className="flex-1 p-6 overflow-y-auto hidden lg:block">
          <Card className="h-full w-full flex items-center justify-center">
            <CardContent className="text-center">
              <MutedText>选择左侧设置项进行编辑</MutedText>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
