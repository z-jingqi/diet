import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import { fetchTagsData } from "@/lib/api/tags";
import type { Tag } from "@diet/shared";
import SelectedTagsDisplay from "./SelectedTagsDisplay";
import TagSearchFilter from "./TagSearchFilter";
import TagList from "./TagList";

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  disabled?: boolean;
}

const TagSelector = ({
  selectedTags,
  onTagsChange,
  disabled,
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 获取标签数据
  const {
    data: tagsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsData,
    enabled: isOpen, // 只在弹窗打开时查询
  });

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleRetry = () => {
    refetch();
  };

  // 过滤标签
  const filteredTags =
    tagsData?.tags.filter((tag) => {
      const matchesSearch =
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || tag.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const categories = tagsData?.categories || [];

  return (
    <div>
      {/* 已选标签显示 */}
      <SelectedTagsDisplay
        selectedTags={selectedTags}
        onRemoveTag={handleRemoveTag}
      />

      {/* 标签选择弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>选择标签</DialogTitle>
          </DialogHeader>

          {/* 搜索和分类过滤 */}
          <TagSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {/* 标签列表 */}
          <div className="max-h-96 overflow-y-auto">
            <TagList
              tags={filteredTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
            />
          </div>

          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <MutedText>已选择 {selectedTags.length} 个标签</MutedText>
              <Button onClick={() => setIsOpen(false)}>确定</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagSelector;
