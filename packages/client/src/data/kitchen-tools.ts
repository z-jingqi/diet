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
      name: "基础厨具",
      tools: [
        { id: "wok", name: "炒锅" },
        { id: "pan", name: "平底锅" },
        { id: "pot", name: "汤锅" },
        { id: "steamer", name: "蒸锅" },
        { id: "rice_cooker", name: "电饭煲" },
        { id: "clay_pot", name: "砂锅" },
        { id: "casserole", name: "炖锅" },
        { id: "frying_pan", name: "煎锅" },
        { id: "soup_pot", name: "煮锅" },
      ],
    },
    {
      name: "刀具",
      tools: [
        { id: "chef_knife", name: "菜刀" },
        { id: "paring_knife", name: "水果刀" },
        { id: "scissors", name: "厨房剪刀" },
        { id: "bread_knife", name: "面包刀" },
        { id: "cleaver", name: "砍刀" },
      ],
    },
    {
      name: "工具",
      tools: [
        { id: "spatula", name: "铲子" },
        { id: "ladle", name: "勺子" },
        { id: "tongs", name: "夹子" },
        { id: "whisk", name: "打蛋器" },
        { id: "grater", name: "刨丝器" },
        { id: "colander", name: "漏勺" },
        { id: "strainer", name: "筛子" },
        { id: "peeler", name: "削皮器" },
        { id: "garlic_press", name: "蒜泥器" },
        { id: "mandoline", name: "切片器" },
      ],
    },
    {
      name: "电器",
      tools: [
        { id: "blender", name: "搅拌机" },
        { id: "food_processor", name: "料理机" },
        { id: "microwave", name: "微波炉" },
        { id: "oven", name: "烤箱" },
        { id: "air_fryer", name: "空气炸锅" },
        { id: "rice_cooker_pressure", name: "电压力锅" },
        { id: "induction_cooker", name: "电磁炉" },
      ],
    },
    {
      name: "烘焙工具",
      tools: [
        { id: "rolling_pin", name: "擀面杖" },
        { id: "baking_sheet", name: "烤盘" },
        { id: "muffin_tin", name: "马芬模具" },
        { id: "cake_pan", name: "蛋糕模具" },
        { id: "bread_pan", name: "面包模具" },
        { id: "cookie_cutter", name: "饼干模具" },
        { id: "piping_bag", name: "裱花袋" },
        { id: "piping_tips", name: "裱花嘴" },
      ],
    },
    {
      name: "中式专用",
      tools: [
        { id: "bamboo_steamer", name: "竹蒸笼" },
        { id: "pressure_cooker", name: "高压锅" },
        { id: "slow_cooker", name: "慢炖锅" },
        { id: "mortar_pestle", name: "捣蒜器" },
        { id: "wok_spatula", name: "炒菜铲" },
        { id: "rice_paddle", name: "饭铲" },
        { id: "steam_basket", name: "蒸架" },
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
