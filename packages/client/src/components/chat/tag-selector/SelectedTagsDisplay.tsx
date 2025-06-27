import { memo, useMemo } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/gql/graphql";

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
    // 使用 useMemo 优化 warningTagIds 的 Set
    const warningTagIdsSet = useMemo(
      () => new Set(warningTagIds),
      [warningTagIds]
    );

    if (selectedTags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => {
          const isWarning = tag.id && warningTagIdsSet.has(tag.id);

          return (
            <Badge
              key={tag.id}
              variant={isWarning ? "destructive" : "secondary"}
              className={`flex items-center gap-1 px-2 py-1 ${
                isWarning
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : ""
              }`}
            >
              {isWarning && <AlertTriangle className="w-3 h-3" />}
              {tag.name}
              <button
                disabled={disabled}
                onClick={() => tag.id && onRemoveTag(tag.id)}
                className={`ml-1 transition-colors ${disabled ? "" : "hover:text-red-500"}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>
    );
  }
);

SelectedTagsDisplay.displayName = "SelectedTagsDisplay";

export default SelectedTagsDisplay;
