import type { Tag, TagCategory, TagsResponse } from "@diet/shared";
import { API_BASE } from "@/lib/constants";

// 获取所有标签和分类数据
export const fetchTagsData = async (): Promise<TagsResponse> => {
  const response = await fetch(`${API_BASE}/tags/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch tags data");
  }
  return response.json();
};

// 获取标签分类
export const fetchTagCategories = async (): Promise<TagCategory[]> => {
  const response = await fetch(`${API_BASE}/tags/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch tag categories");
  }
  const data = await response.json();
  return data.categories;
};

// 获取标签列表
export const fetchTags = async (params?: {
  categoryId?: string;
  search?: string;
}): Promise<Tag[]> => {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) {
    searchParams.append("categoryId", params.categoryId);
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }

  const url = `${API_BASE}/tags${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  const data = await response.json();
  return data.tags;
};

// 根据 ID 获取标签详情
export const fetchTagById = async (id: string): Promise<Tag> => {
  const response = await fetch(`${API_BASE}/tags/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tag");
  }
  const data = await response.json();
  return data.tag;
}; 
