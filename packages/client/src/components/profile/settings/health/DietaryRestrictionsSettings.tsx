import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import { Typography, MutedText } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

// Dietary restrictions are stored locally for now.

interface DietaryRestrictionsSettingsProps {
  className?: string;
}

const DietaryRestrictionsSettings = ({
  className,
}: DietaryRestrictionsSettingsProps) => {
  const [restrictions, setRestrictions] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");

  const addRestriction = () => {
    const value = inputValue.trim();
    if (!value) return;
    // Prevent duplicates (case-insensitive)
    if (restrictions.some((r) => r.toLowerCase() === value.toLowerCase())) {
      setInputValue("");
      return;
    }
    setRestrictions((prev) => [...prev, value]);
    setInputValue("");
  };

  const removeRestriction = (value: string) => {
    setRestrictions((prev) => prev.filter((r) => r !== value));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRestriction();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          饮食限制 / 过敏原
        </CardTitle>
        <MutedText>设置您的饮食禁忌或过敏原</MutedText>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="输入食物名，如 '花生'"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={addRestriction} disabled={!inputValue.trim()}>
            添加
          </Button>
        </div>

        {restrictions.length === 0 ? (
          <Typography variant="span" className="text-sm text-muted-foreground">
            目前未设置任何饮食限制
          </Typography>
        ) : (
          <div className="flex flex-wrap gap-2">
            {restrictions.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {item}
                <button
                  onClick={() => removeRestriction(item)}
                  className={cn(
                    "ml-1 transition-colors hover:text-red-500 focus-visible:outline-none"
                  )}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DietaryRestrictionsSettings;
