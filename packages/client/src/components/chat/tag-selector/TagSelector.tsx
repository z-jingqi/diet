import { useState, useCallback, useMemo } from "react";
import {
  useTags,
  useTagCategories,
  useTagConflicts,
} from "@/lib/gql/hooks/tags";
import SelectedTagsDisplay from "./SelectedTagsDisplay";
import TagSelectorDialog from "./TagSelectorDialog";
import TagSelectorSheet from "./TagSelectorSheet";
import { Tag } from "@/lib/gql/graphql";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks";

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

const TagSelector = ({
  selectedTagIds,
  onTagsChange,
  disabled,
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 使用 useMediaQuery hook 检测设备类型
  const isMobile = useMediaQuery("(max-width: 767px)");

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

  // 一次性获取所有冲突关系
  const {
    data: conflictsData,
    isLoading: conflictsLoading,
    error: conflictsError,
    refetch: refetchConflicts,
  } = useTagConflicts();

  // 处理数据格式转换
  const tags = useMemo(() => tagsQueryData?.tags || [], [tagsQueryData?.tags]);
  const categories = useMemo(
    () => categoriesQueryData?.tagCategories || [],
    [categoriesQueryData?.tagCategories]
  );

  // 根据 selectedTagIds 计算已选标签对象列表
  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.includes(tag.id || "")),
    [tags, selectedTagIds]
  );

  // 使用 useMemo 计算冲突状态，基于本地冲突数据
  const { conflictTagIds, warningTagIds, conflictDescriptions } =
    useMemo(() => {
      if (!conflictsData?.tagConflicts || selectedTagIds.length === 0) {
        return {
          conflictTagIds: [],
          warningTagIds: [],
          conflictDescriptions: {},
        };
      }

      const selectedIdsSet = new Set(selectedTagIds.filter(Boolean));

      // 收集与已选标签冲突的其他标签
      const mutualExclusiveIds = new Set<string>();
      const warningIds = new Set<string>();
      const descriptions: Record<string, string> = {};

      conflictsData.tagConflicts.forEach((conflict) => {
        const tagId1 = conflict.tagId1 || "";
        const tagId2 = conflict.tagId2 || "";
        const conflictType = conflict.conflictType || "";
        const description = conflict.description || "";

        // 检查是否与已选标签有冲突
        const hasSelectedTag1 = selectedIdsSet.has(tagId1);
        const hasSelectedTag2 = selectedIdsSet.has(tagId2);

        if (hasSelectedTag1 && !hasSelectedTag2) {
          // tagId2 与已选的 tagId1 冲突
          if (conflictType === "mutual_exclusive") {
            mutualExclusiveIds.add(tagId2);
            descriptions[tagId2] = description;
          } else if (conflictType === "warning") {
            warningIds.add(tagId2);
            descriptions[tagId2] = description;
          }
        } else if (hasSelectedTag2 && !hasSelectedTag1) {
          // tagId1 与已选的 tagId2 冲突
          if (conflictType === "mutual_exclusive") {
            mutualExclusiveIds.add(tagId1);
            descriptions[tagId1] = description;
          } else if (conflictType === "warning") {
            warningIds.add(tagId1);
            descriptions[tagId1] = description;
          }
        }

        // 如果两个标签都被选中且有冲突，也要标记为警告
        if (hasSelectedTag1 && hasSelectedTag2) {
          if (conflictType === "warning") {
            warningIds.add(tagId1);
            warningIds.add(tagId2);
            descriptions[tagId1] = description;
            descriptions[tagId2] = description;
          }
        }
      });

      return {
        conflictTagIds: Array.from(mutualExclusiveIds),
        warningTagIds: Array.from(warningIds),
        conflictDescriptions: descriptions,
      };
    }, [conflictsData?.tagConflicts, selectedTagIds]);

  const handleTagToggle = useCallback(
    (tag: Tag) => {
      // 确保标签有ID
      const tagId = tag.id;
      if (!tagId) {
        console.error("尝试切换没有ID的标签:", tag);
        return;
      }

      const isSelected = selectedTagIds.includes(tagId);

      if (isSelected) {
        // 如果标签已选中，则移除
        onTagsChange(
          selectedTags
            .filter((t: Tag) => t.id !== tagId)
            .map((t: Tag) => t.id || "")
        );
      } else {
        // 检查要添加的标签是否与已选标签有互斥冲突
        const isMutualExclusive = conflictTagIds.includes(tagId);

        if (isMutualExclusive) {
          const description =
            conflictDescriptions[tagId] || "标签冲突，无法同时选择";
          toast.error(description);
          return;
        }

        // 检查要添加的标签是否与已选标签有警告冲突
        const isWarning = warningTagIds.includes(tagId);

        if (isWarning) {
          const description =
            conflictDescriptions[tagId] || "标签组合可能存在冲突，请谨慎选择";
          toast.warning(description);
        }

        // 如果标签未选中，则添加
        onTagsChange([
          ...selectedTags.map((t: Tag) => t.id || ""),
          tag.id || "",
        ]);
      }
    },
    [
      selectedTagIds,
      selectedTags,
      conflictTagIds,
      warningTagIds,
      conflictDescriptions,
      onTagsChange,
    ]
  );

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      onTagsChange(
        selectedTags
          .filter((t: Tag) => t.id !== tagId)
          .map((t: Tag) => t.id || "")
      );
    },
    [selectedTags, onTagsChange]
  );

  const handleRetry = useCallback(() => {
    refetchTags();
    refetchCategories();
    refetchConflicts();
  }, [refetchTags, refetchCategories, refetchConflicts]);

  // 合并数据以保持与原来 API 的兼容性
  const tagsData = useMemo(
    () => ({
      tags: tags,
      categories: categories,
    }),
    [tags, categories]
  );

  const isLoading = tagsLoading || categoriesLoading || conflictsLoading;
  const error = tagsError || categoriesError || conflictsError;

  // 稳定化传递给子组件的函数
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // 传递禁用tagId和警告tagId给TagSelectorDialog/Sheet
  return (
    <div>
      {/* 已选标签显示 */}
      <SelectedTagsDisplay
        selectedTags={selectedTags}
        onRemoveTag={handleRemoveTag}
        disabled={disabled}
        warningTagIds={warningTagIds}
      />

      {/* 标签选择弹窗 */}
      {isMobile ? (
        <TagSelectorSheet
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          disabled={disabled}
          tagsData={tagsData}
          categories={categories as any}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error as any}
          onRetry={handleRetry}
          disabledTagIds={conflictTagIds}
          warningTagIds={warningTagIds}
          conflictDescriptions={conflictDescriptions}
        />
      ) : (
        <TagSelectorDialog
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          disabled={disabled}
          tagsData={tagsData}
          categories={categories as any}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          isLoading={isLoading}
          error={error as any}
          onRetry={handleRetry}
          disabledTagIds={conflictTagIds}
          warningTagIds={warningTagIds}
          conflictDescriptions={conflictDescriptions}
        />
      )}
    </div>
  );
};

export default TagSelector;
