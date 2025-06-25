import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkTagConflicts, fetchTagConflicts } from "@/lib/api/tags-api";
import type { Tag } from "@diet/shared";

export interface TagConflict {
  id: string;
  tagId1: string;
  tagId2: string;
  conflictType: "mutual_exclusive" | "warning" | "info";
  description: string;
}

export interface ConflictResult {
  conflicts: {
    mutual_exclusive: TagConflict[];
    warning: TagConflict[];
    info: TagConflict[];
  };
  hasConflicts: boolean;
  totalConflicts: number;
}

export const useTagConflicts = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [conflictResult, setConflictResult] = useState<ConflictResult | null>(null);

  // 获取所有冲突关系
  const {
    data: allConflicts,
    isLoading: isLoadingConflicts,
    error: conflictsError,
  } = useQuery({
    queryKey: ["tag-conflicts"],
    queryFn: fetchTagConflicts,
  });

  // 检查当前选择的标签组合的冲突
  const checkConflicts = useCallback(async (tags: Tag[]) => {
    if (tags.length === 0) {
      setConflictResult(null);
      return;
    }

    try {
      const tagIds = tags.map(tag => tag.id).filter((id): id is string => id !== undefined);
      const result = await checkTagConflicts(tagIds);
      setConflictResult(result);
    } catch (error) {
      console.error("Error checking tag conflicts:", error);
      setConflictResult(null);
    }
  }, []);

  // 当选择的标签变化时，自动检查冲突
  useEffect(() => {
    checkConflicts(selectedTags);
  }, [selectedTags, checkConflicts]);

  // 添加标签
  const addTag = useCallback((tag: Tag) => {
    setSelectedTags(prev => {
      const isAlreadySelected = prev.some(t => t.id === tag.id);
      if (isAlreadySelected) {
        return prev;
      }
      return [...prev, tag];
    });
  }, []);

  // 移除标签
  const removeTag = useCallback((tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
  }, []);

  // 切换标签选择状态
  const toggleTag = useCallback((tag: Tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // 清空所有选择的标签
  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  // 获取冲突提示信息
  const getConflictMessages = useCallback(() => {
    if (!conflictResult || !conflictResult.hasConflicts) {
      return [];
    }

    const messages: Array<{
      type: "error" | "warning" | "info";
      message: string;
    }> = [];

    // 互斥冲突 - 错误级别
    conflictResult.conflicts.mutual_exclusive.forEach(conflict => {
      messages.push({
        type: "error",
        message: `⚠️ ${conflict.description}`,
      });
    });

    // 警告冲突 - 警告级别
    conflictResult.conflicts.warning.forEach(conflict => {
      messages.push({
        type: "warning",
        message: `⚠️ ${conflict.description}`,
      });
    });

    // 信息冲突 - 信息级别
    conflictResult.conflicts.info.forEach(conflict => {
      messages.push({
        type: "info",
        message: `💡 ${conflict.description}`,
      });
    });

    return messages;
  }, [conflictResult]);

  // 检查是否有互斥冲突
  const hasMutualExclusiveConflicts = useCallback(() => {
    return (conflictResult?.conflicts.mutual_exclusive?.length ?? 0) > 0;
  }, [conflictResult]);

  // 检查是否有警告冲突
  const hasWarningConflicts = useCallback(() => {
    return (conflictResult?.conflicts.warning?.length ?? 0) > 0;
  }, [conflictResult]);

  return {
    // 状态
    selectedTags,
    conflictResult,
    allConflicts,
    isLoadingConflicts,
    conflictsError,
    
    // 操作方法
    addTag,
    removeTag,
    toggleTag,
    clearTags,
    checkConflicts,
    
    // 冲突检查
    getConflictMessages,
    hasMutualExclusiveConflicts,
    hasWarningConflicts,
    
    // 便捷方法
    hasConflicts: conflictResult?.hasConflicts ?? false,
    totalConflicts: conflictResult?.totalConflicts ?? 0,
  };
}; 