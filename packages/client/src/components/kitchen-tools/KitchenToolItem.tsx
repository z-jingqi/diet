import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface KitchenToolItemProps {
  id: string;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const KitchenToolItem = ({
  id,
  name,
  checked,
  onCheckedChange,
  disabled = false,
}: KitchenToolItemProps) => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer flex-1 min-w-0",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <Typography variant="span" className="text-sm text-gray-900">
          {name}
        </Typography>
      </label>
    </div>
  );
};

export default KitchenToolItem; 
