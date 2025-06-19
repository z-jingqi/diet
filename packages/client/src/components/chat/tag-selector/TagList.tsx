import { RefreshCw } from "lucide-react";
import TagItem from "./TagItem";
import { MutedText, ErrorText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TagListSkeleton } from "./TagSkeleton";
import type { Tag } from "@diet/shared";

interface TagListProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

const TagList = ({
  tags,
  selectedTags,
  onTagToggle,
  isLoading,
  error,
  onRetry,
}: TagListProps) => {
  if (isLoading) {
    return <TagListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3">
          <ErrorText>加载失败</ErrorText>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-1 h-auto p-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
              重试
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-8">
        <MutedText>没有找到标签</MutedText>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tags.map((tag) => {
        const isSelected = selectedTags.some((t) => t.id === tag.id);
        return (
          <TagItem
            key={tag.id}
            tag={tag}
            isSelected={isSelected}
            onToggle={onTagToggle}
          />
        );
      })}
    </div>
  );
};

export default TagList; 
