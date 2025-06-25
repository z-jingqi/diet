import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MutedText } from "@/components/ui/typography";
import TagSkeleton from "./TagSkeleton";
import TagList from "./TagList";
import { Tag, TagCategory } from "@/lib/gql/graphql";

interface TagSelectorSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  tagsData?: {
    tags?: Tag[];
    categories?: TagCategory[];
  };
  categories: TagCategory[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  disabledTagIds?: string[];
}

const TagSelectorSheet = ({
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
  disabledTagIds = [],
}: TagSelectorSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 w-8 p-0 hover:bg-muted"
          title="添加标签"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] rounded-t-xl border-t-2 p-0"
      >
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between">
          <SheetTitle>选择标签</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 标签列表 */}
          <div className="flex-1 overflow-y-auto p-4">
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
                categories={categories}
                tagsData={tagsData}
                selectedTags={selectedTags}
                onTagToggle={onTagToggle}
                disabledTagIds={disabledTagIds}
              />
            )}
          </div>

          <SheetFooter className="p-4 border-t">
            <div className="flex justify-between items-center w-full">
              <MutedText>已选择 {selectedTags.length} 个标签</MutedText>
              <Button onClick={() => onOpenChange(false)}>确定</Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TagSelectorSheet;
