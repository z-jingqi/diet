import { useState, useEffect } from "react";
import { useTags, useTagCategories } from "@/lib/gql/hooks/tags";
import SelectedTagsDisplay from "./SelectedTagsDisplay";
import TagSelectorDialog from "./TagSelectorDialog";
import TagSelectorSheet from "./TagSelectorSheet";
import { Tag } from "@/lib/gql/graphql";

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
  const [conflictTagIds, setConflictTagIds] = useState<string[]>([]);

  // 检测设备类型
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md断点
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // 使用 GraphQL hooks 获取标签数据
  const {
    data: tagsQueryData,
    isLoading: tagsLoading,
    error: tagsError,
    refetch: refetchTags,
  } = useTags(undefined, undefined);

  const {
    data: categoriesQueryData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useTagCategories();

  // 冲突检测逻辑
  useEffect(() => {
    if (selectedTags.length < 2) {
      setConflictTagIds([]);
      return;
    }

    // TODO: 暂时简化处理，后续可以优化为使用 GraphQL
    setConflictTagIds([]);
  }, [selectedTags]);

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
    refetchTags();
    refetchCategories();
  };

  // 处理数据格式转换
  const tags = tagsQueryData?.tags || [];
  const categories = categoriesQueryData?.tagCategories || [];

  // 合并数据以保持与原来 API 的兼容性
  const tagsData = {
    tags: tags,
    categories: categories,
  };

  const isLoading = tagsLoading || categoriesLoading;
  const error = tagsError || categoriesError;

  // 传递禁用tagId给TagSelectorDialog/Sheet
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
          categories={categories as any}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error as any}
          onRetry={handleRetry}
          disabledTagIds={conflictTagIds}
        />
      ) : (
        <TagSelectorDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          disabled={disabled}
          tagsData={tagsData}
          categories={categories as any}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error as any}
          onRetry={handleRetry}
          disabledTagIds={conflictTagIds}
        />
      )}
    </div>
  );
};

export default TagSelector;
