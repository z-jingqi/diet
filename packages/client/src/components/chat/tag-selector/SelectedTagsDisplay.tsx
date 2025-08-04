import { memo, useMemo } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";

interface SelectedTagsDisplayProps {
  selectedTags: Tag[];
  disabled?: boolean;
  onRemoveTag: (tagId: string) => void;
  warningTagIds?: string[];
}

const SelectedTagsDisplay = memo(
  ({
    selectedTags,
    disabled,
    onRemoveTag,
    warningTagIds = [],
  }: SelectedTagsDisplayProps) => {
    // 使用 useMemo 优化 warningTagIds 的 Set，并过滤掉空值
    const warningTagIdsSet = useMemo(
      () => new Set(warningTagIds.filter(Boolean)),
      [warningTagIds],
    );

    // 过滤掉没有ID的标签
    const validTags = useMemo(
      () => selectedTags.filter((tag) => Boolean(tag.id)),
      [selectedTags],
    );

    if (validTags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {validTags.map((tag) => {
          const tagId = tag.id as string; // 我们已经过滤掉了没有ID的标签
          const isWarning = warningTagIdsSet.has(tagId);

          return (
            <Badge
              key={tagId}
              variant={isWarning ? "destructive" : "secondary"}
              className={cn(
                "flex items-center gap-1 px-2 py-1",
                isWarning && "bg-orange-100 text-orange-800 border-orange-200",
              )}
            >
              {isWarning && <AlertTriangle className="w-3 h-3" />}
              {tag.name}
              <button
                disabled={disabled}
                onClick={() => onRemoveTag(tagId)}
                className={cn(
                  "ml-1 transition-colors",
                  !disabled && "hover:text-red-500",
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    );
  },
);

SelectedTagsDisplay.displayName = "SelectedTagsDisplay";

export default SelectedTagsDisplay;
