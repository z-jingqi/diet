import { useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '../client';
import {
  useGetTagsQuery,
  useGetTagCategoriesQuery,
  useCreateTagMutation,
  useGetTagQuery,
  useGetTagConflictsQuery,
  useCheckTagConflictsQuery,
  type GetTagsQueryVariables,
  type GetTagQueryVariables,
  type CheckTagConflictsQueryVariables
} from '../graphql';

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
  return useCheckTagConflictsQuery(graphqlClient, variables, {
    enabled: tagIds.length > 0
  });
}

// 创建标签
export function useCreateTag() {
  const queryClient = useQueryClient();
  
  return useCreateTagMutation(graphqlClient, {
    onSuccess: () => {
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['GetTags'] });
      queryClient.invalidateQueries({ queryKey: ['GetTagCategories'] });
      queryClient.invalidateQueries({ queryKey: ['GetTagConflicts'] });
    },
  });
} 
