import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MutedText } from "@/components/ui/typography";
import type { Tag, TagCategory } from "@diet/shared";
import TagSkeleton from "./TagSkeleton";
import TagList from "./TagList";

interface TagSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  tagsData?: {
    tags: Tag[];
    categories: TagCategory[];
  };
  categories: TagCategory[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

const TagSelectorDialog = ({
  isOpen,
  onOpenChange,
  disabled,
  tagsData,
  categories,
  selectedTags,
  onTagToggle,
  isLoading,
  error,
  onRetry,
}: TagSelectorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0 hover:bg-muted"
          title="添加标签"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] sm:h-auto sm:max-h-[80vh] overflow-hidden rounded-lg sm:rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle>选择标签</DialogTitle>
        </DialogHeader>

        {/* 标签列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {isLoading ? (
            <TagSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MutedText>加载失败</MutedText>
              <Button variant="outline" size="sm" onClick={onRetry}>
                重试
              </Button>
            </div>
          ) : (
            <TagList
              tagsData={tagsData}
              categories={categories}
              selectedTags={selectedTags}
              onTagToggle={onTagToggle}
            />
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <div className="flex justify-between items-center w-full">
            <MutedText>已选择 {selectedTags.length} 个标签</MutedText>
            <Button onClick={() => onOpenChange(false)}>确定</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagSelectorDialog; 