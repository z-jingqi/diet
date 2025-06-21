import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTagsData } from "@/lib/api/tags-api";
import type { Tag } from "@diet/shared";
import SelectedTagsDisplay from "./SelectedTagsDisplay";
import TagSelectorDialog from "./TagSelectorDialog";
import TagSelectorSheet from "./TagSelectorSheet";

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
  const [isMobile, setIsMobile] = useState(false);

  // 检测设备类型
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md断点
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

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
    const isSelected = selectedTags.some((t: Tag) => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter((t: Tag) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t: Tag) => t.id !== tagId));
  };

  const handleRetry = () => {
    refetch();
  };

  const categories = tagsData?.categories || [];

  return (
    <div>
      {/* 已选标签显示 */}
      <SelectedTagsDisplay
        selectedTags={selectedTags}
        onRemoveTag={handleRemoveTag}
        disabled={disabled}
      />

      {/* 标签选择弹窗 */}
      {isMobile ? (
        <TagSelectorSheet
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          disabled={disabled}
          tagsData={tagsData}
          categories={categories}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      ) : (
        <TagSelectorDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          disabled={disabled}
          tagsData={tagsData}
          categories={categories}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default TagSelector;
