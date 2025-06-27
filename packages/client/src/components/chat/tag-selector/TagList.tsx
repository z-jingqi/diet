import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Tag, TagCategory } from "@/lib/gql/graphql";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TagListProps {
  categories: TagCategory[];
  tagsData?: {
    tags?: Tag[];
    categories?: TagCategory[];
  };
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  disabledTagIds?: string[];
  warningTagIds?: string[];
  conflictDescriptions?: Record<string, string>;
}

const TagList = memo(({
  categories,
  tagsData,
  selectedTags,
  onTagToggle,
  disabledTagIds = [],
  warningTagIds = [],
  conflictDescriptions = {},
}: TagListProps) => {
  // 使用 useMemo 优化 selectedTagIds 的计算
  const selectedTagIds = useMemo(() => 
    new Set(selectedTags.map(tag => tag.id)), 
    [selectedTags]
  );

  // 使用 useMemo 优化 disabledTagIds 和 warningTagIds 的 Set
  const disabledTagIdsSet = useMemo(() => 
    new Set(disabledTagIds), 
    [disabledTagIds]
  );
  
  const warningTagIdsSet = useMemo(() => 
    new Set(warningTagIds), 
    [warningTagIds]
  );

  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="mb-6 flex flex-col gap-1">
          <Typography variant="span" className="mb-2 text-sm">
            {category.name}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {tagsData?.tags
              ?.filter((tag) => tag.categoryId === category.id)
              .map((tag) => {
                const isSelected = selectedTagIds.has(tag.id || '');
                const isDisabled = tag.id && disabledTagIdsSet.has(tag.id);
                const isWarning = tag.id && warningTagIdsSet.has(tag.id);
                
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors px-4 py-2 text-sm ${
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    } ${
                      isDisabled ? "opacity-50 bg-muted hover:bg-muted/80" : ""
                    } ${
                      isWarning && !isSelected ? "border-orange-300 text-orange-700" : ""
                    } ${
                      !isSelected && !isDisabled ? "hover:bg-muted" : ""
                    }`}
                    onClick={() => {
                      if (isDisabled) {
                        // 显示禁用原因
                        const description = conflictDescriptions[tag.id || ''] || '标签冲突，无法同时选择';
                        toast.error(description);
                      } else {
                        onTagToggle(tag);
                      }
                    }}
                  >
                    {isWarning && <AlertTriangle className="w-3 h-3 mr-1 text-orange-600" />}
                    {tag.name}
                  </Badge>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
});

TagList.displayName = "TagList";

export default TagList;
