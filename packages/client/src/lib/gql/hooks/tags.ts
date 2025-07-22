import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import { TAG_QUERY_KEYS } from "./common";
import {
  useGetTagsQuery,
  useGetTagCategoriesQuery,
  useCreateTagMutation,
  useGetTagQuery,
  useGetTagConflictsQuery,
  useCheckTagConflictsQuery,
  type GetTagsQueryVariables,
  type GetTagQueryVariables,
  type CheckTagConflictsQueryVariables,
} from "../graphql";

// 冲突类型定义
export interface TagConflictInfo {
  mutual_exclusive: Array<{
    id: string;
    tagId1: string;
    tagId2: string;
    description: string;
  }>;
  warning: Array<{
    id: string;
    tagId1: string;
    tagId2: string;
    description: string;
  }>;
  info: Array<{
    id: string;
    tagId1: string;
    tagId2: string;
    description: string;
  }>;
}

export interface ConflictResult {
  conflicts: TagConflictInfo;
  hasConflicts: boolean;
  totalConflicts: number;
}

// 获取标签列表
export function useTags(categoryId?: string, search?: string) {
  const variables: GetTagsQueryVariables = {};
  if (categoryId) variables.categoryId = categoryId;
  if (search) variables.search = search;

  return useGetTagsQuery(graphqlClient, variables);
}

// 获取标签分类
export function useTagCategories() {
  return useGetTagCategoriesQuery(graphqlClient);
}

// 根据 ID 获取标签详情
export function useTag(id: string) {
  const variables: GetTagQueryVariables = { id };
  return useGetTagQuery(graphqlClient, variables);
}

// 获取所有标签冲突关系
export function useTagConflicts() {
  return useGetTagConflictsQuery(graphqlClient);
}

// 检查标签组合的冲突
export function useCheckTagConflicts(tagIds: string[]) {
  const variables: CheckTagConflictsQueryVariables = { tagIds };
  const query = useCheckTagConflictsQuery(graphqlClient, variables, {
    enabled: tagIds.length > 0,
  });

  // 解析返回的 JSON 字符串
  const parsedData = query.data?.checkTagConflicts
    ? (JSON.parse(query.data.checkTagConflicts) as ConflictResult)
    : null;

  return {
    ...query,
    data: parsedData,
  };
}

// 创建标签
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useCreateTagMutation(graphqlClient, {
    onSuccess: () => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.TAGS });
      queryClient.invalidateQueries({
        queryKey: TAG_QUERY_KEYS.TAG_CATEGORIES,
      });
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.TAG_CONFLICTS });
    },
  });
}
