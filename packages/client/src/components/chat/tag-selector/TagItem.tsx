import { Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Typography, MutedText } from "@/components/ui/typography";
import type { Tag } from "@diet/shared";

interface TagItemProps {
  tag: Tag;
  isSelected: boolean;
  onToggle: (tag: Tag) => void;
}

const TagItem = ({ tag, isSelected, onToggle }: TagItemProps) => {
  return (
    <Card
      className={`p-3 cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "hover:border-gray-300"
      }`}
      onClick={() => onToggle(tag)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TagIcon className="w-4 h-4 text-gray-500" />
            <Typography variant="span" className="font-medium">
              {tag.name}
            </Typography>
            {isSelected && (
              <Badge variant="default" className="text-xs">
                已选择
              </Badge>
            )}
          </div>
          <MutedText className="mb-2">
            {tag.description}
          </MutedText>
          {tag.restrictions && tag.restrictions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tag.restrictions.map((restriction, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs"
                >
                  {restriction}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TagItem; 
