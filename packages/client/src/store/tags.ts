import { create } from "zustand";
import type { Tag } from "@diet/shared";

interface TagsState {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  removeTag: (tagId: string) => void;
  clearTags: () => void;
  hasTag: (tagId: string) => boolean;
  getSelectedTagsInfo: () => string;
}

const useTagsStore = create<TagsState>((set, get) => ({
  selectedTags: [],

  setSelectedTags: (tags: Tag[]) => {
    set({ selectedTags: tags });
  },

  addTag: (tag: Tag) => {
    const { selectedTags } = get();
    // 避免重复添加
    if (!selectedTags.some((t) => t.id === tag.id)) {
      set({ selectedTags: [...selectedTags, tag] });
    }
  },

  removeTag: (tagId: string) => {
    set((state) => ({
      selectedTags: state.selectedTags.filter((tag) => tag.id !== tagId),
    }));
  },

  clearTags: () => {
    set({ selectedTags: [] });
  },

  hasTag: (tagId: string) => {
    const { selectedTags } = get();
    return selectedTags.some((tag) => tag.id === tagId);
  },

  getSelectedTagsInfo: () => {
    const { selectedTags } = get();
    if (selectedTags.length === 0) {
      return "";
    }
    return selectedTags.map((tag) => tag.aiPrompt).join("\n");
  },
}));

export default useTagsStore;
