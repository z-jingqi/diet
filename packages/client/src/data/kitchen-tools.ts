export interface KitchenTool {
  id: string;
  name: string;
}

export interface KitchenToolCategory {
  name: string;
  tools: KitchenTool[];
}

export interface KitchenToolsData {
  categories: KitchenToolCategory[];
}

export const kitchenToolsData: KitchenToolsData = {
  categories: [
    {
      name: "中餐",
      tools: [
        { id: "wok", name: "炒锅" },
        { id: "clay_pot", name: "砂锅" },
        { id: "bamboo_steamer", name: "竹蒸笼" },
        { id: "steam_basket", name: "蒸架" },
      ],
    },
    {
      name: "西餐",
      tools: [
        { id: "pan", name: "平底锅" },
        { id: "frying_pan", name: "煎锅" },
        { id: "casserole", name: "炖锅" },
      ],
    },
    {
      name: "基础厨具",
      tools: [
        { id: "pot", name: "汤锅" },
        { id: "soup_pot", name: "煮锅" },
        { id: "steamer", name: "蒸锅" },
      ],
    },
    {
      name: "烘焙",
      tools: [
        { id: "rolling_pin", name: "擀面杖" },
        { id: "baking_sheet", name: "烤盘" },
        { id: "muffin_tin", name: "马芬模具" },
        { id: "cake_pan", name: "蛋糕模具" },
        { id: "bread_pan", name: "面包模具" },
        { id: "cookie_cutter", name: "饼干模具" },
        { id: "piping_bag", name: "裱花袋" },
        { id: "piping_tips", name: "裱花嘴" },
        { id: "pizza_stone", name: "披萨石" },
      ],
    },
    {
      name: "厨房电器",
      tools: [
        { id: "microwave", name: "微波炉" },
        { id: "oven", name: "烤箱" },
        { id: "air_fryer", name: "空气炸锅" },
        { id: "induction_cooker", name: "电磁炉" },
        { id: "rice_cooker", name: "电饭煲" },
        { id: "pressure_cooker", name: "高压锅" },
        { id: "rice_cooker_pressure", name: "电压力锅" },
        { id: "slow_cooker", name: "慢炖锅" },
      ],
    },
  ],
};

// 导出所有厨具的ID类型
export type KitchenToolId =
  (typeof kitchenToolsData.categories)[number]["tools"][number]["id"];

// 导出所有厨具名称类型
export type KitchenToolName =
  (typeof kitchenToolsData.categories)[number]["tools"][number]["name"];

// 导出分类名称类型
export type KitchenToolCategoryName =
  (typeof kitchenToolsData.categories)[number]["name"];

// 获取所有厨具的辅助函数
export const getAllKitchenTools = (): KitchenTool[] => {
  return kitchenToolsData.categories.flatMap((category) => category.tools);
};

// 根据ID获取厨具的辅助函数
export const getKitchenToolById = (id: string): KitchenTool | undefined => {
  return getAllKitchenTools().find((tool) => tool.id === id);
};

// 根据分类名称获取厨具的辅助函数
export const getKitchenToolsByCategory = (
  categoryName: string
): KitchenTool[] => {
  const category = kitchenToolsData.categories.find(
    (cat) => cat.name === categoryName
  );
  return category?.tools || [];
};
