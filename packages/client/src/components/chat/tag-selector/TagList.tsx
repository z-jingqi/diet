import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Tag, TagCategory } from "@/lib/gql/graphql";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  // 使用 useMemo 优化 selectedTagIds 的计算，过滤掉空值
  const selectedTagIds = useMemo(() => 
    new Set(selectedTags.map(tag => tag.id).filter(Boolean)), 
    [selectedTags]
  );

  // 使用 useMemo 优化 disabledTagIds 和 warningTagIds 的 Set，过滤掉空值
  const disabledTagIdsSet = useMemo(() => 
    new Set(disabledTagIds.filter(Boolean)), 
    [disabledTagIds]
  );
  
  const warningTagIdsSet = useMemo(() => 
    new Set(warningTagIds.filter(Boolean)), 
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
                // 跳过没有ID的标签
                if (!tag.id) {
                  return null;
                }
                
                const isSelected = selectedTagIds.has(tag.id);
                const isDisabled = disabledTagIdsSet.has(tag.id);
                const isWarning = warningTagIdsSet.has(tag.id);
                
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors px-4 py-2 text-sm",
                      isDisabled && "opacity-50 bg-muted hover:bg-muted/80",
                      isWarning && !isSelected && "border-orange-300 text-orange-700",
                      !isSelected && !isDisabled && "hover:bg-muted"
                    )}
                    onClick={() => {
                      if (isDisabled) {
                        // 显示禁用原因
                        const description = tag.id && conflictDescriptions[tag.id] || '标签冲突，无法同时选择';
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
