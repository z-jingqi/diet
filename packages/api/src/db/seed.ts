import { createDB } from './index';
import { tagCategories, tags, tagConflicts } from './schema';

// Cloudflare D1 数据库类型
declare global {
  interface D1Database {
    prepare: (query: string) => any;
    batch: (statements: any[]) => Promise<any[]>;
    exec: (query: string) => Promise<any>;
  }
}

// 种子数据 - 重新设计的标签体系
const seedTagCategories = [
  { id: 'medical-restrictions', name: '饮食限制', description: '基于健康状况或特殊需求的饮食调整', sortOrder: 1 },
  { id: 'nutritional-focus', name: '营养重点', description: '需要重点补充或控制的营养素', sortOrder: 2 },
  { id: 'health-objectives', name: '健康目标', description: '基于健康改善目标的饮食策略', sortOrder: 3 },
  { id: 'dietary-preferences', name: '饮食偏好', description: '基于个人选择和生活方式', sortOrder: 4 },
  { id: 'special-needs', name: '特殊需求', description: '特定人群或特殊时期的饮食需求', sortOrder: 5 },
];

const seedTags = [
  // 医学限制类 - 基于健康状况或特殊需求
  {
    id: 'low-salt',
    name: '低盐',
    description: '控制盐分摄入，适合关注血压健康',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['限制钠摄入', '避免咸菜腌制品', '控制调味料']),
    aiPrompt: '用户需要低盐饮食，每日盐分摄入不超过3g。避免咸菜、腌制品、加工食品、酱油等高钠食物。建议使用天然香料调味，如柠檬、醋、香草等。',
    sortOrder: 1,
  },
  {
    id: 'low-sugar',
    name: '低糖',
    description: '控制糖分摄入，适合关注血糖健康',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['限制糖分摄入', '避免精制碳水', '控制血糖']),
    aiPrompt: '用户需要低糖饮食，避免添加糖、甜点、含糖饮料、白米饭、白面包等精制碳水化合物。建议选择全谷物、蔬菜、瘦肉等低GI食物。',
    sortOrder: 2,
  },
  {
    id: 'low-fat',
    name: '低脂',
    description: '控制脂肪摄入，适合关注血脂健康',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['限制脂肪摄入', '避免油炸食品', '选择瘦肉']),
    aiPrompt: '用户需要低脂饮食，避免油炸食品、肥肉、奶油、黄油等高脂食物。建议选择瘦肉、鱼类、豆制品，烹饪方式以蒸、煮、烤为主。',
    sortOrder: 3,
  },
  {
    id: 'low-potassium',
    name: '低钾',
    description: '控制钾元素摄入，适合特定健康需求',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['限制钾摄入', '避免高钾食物']),
    aiPrompt: '用户需要低钾饮食，避免香蕉、土豆、番茄、菠菜、橙子等高钾食物。建议选择苹果、梨、白米饭、瘦肉等低钾食物。',
    sortOrder: 4,
  },
  {
    id: 'low-protein',
    name: '低蛋白',
    description: '控制蛋白质摄入，适合特定健康需求',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['限制蛋白质', '控制肉类摄入']),
    aiPrompt: '用户需要低蛋白质饮食，限制肉类、鱼类、蛋类、豆制品等高蛋白食物。建议以蔬菜、水果、谷物为主，适量补充优质蛋白。',
    sortOrder: 5,
  },
  {
    id: 'gluten-free',
    name: '无麸质',
    description: '避免麸质食物，适合麸质敏感人群',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['避免麸质', '无小麦制品']),
    aiPrompt: '用户需要无麸质饮食，避免小麦、大麦、黑麦及其制品。建议选择大米、玉米、藜麦、荞麦等无麸质谷物。',
    sortOrder: 6,
  },
  {
    id: 'dairy-free',
    name: '无乳制品',
    description: '避免乳制品，适合乳糖不耐受人群',
    categoryId: 'medical-restrictions',
    restrictions: JSON.stringify(['避免乳制品', '无牛奶制品']),
    aiPrompt: '用户需要无乳制品饮食，避免牛奶、奶酪、酸奶等。建议选择豆奶、杏仁奶、椰奶等植物奶替代。',
    sortOrder: 7,
  },

  // 营养重点类 - 需要重点补充或控制的营养素
  {
    id: 'high-protein',
    name: '高蛋白',
    description: '增加蛋白质摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加蛋白质', '优质蛋白']),
    aiPrompt: '用户需要高蛋白质饮食，每餐应包含优质蛋白质如瘦肉、鱼类、蛋类、豆制品等。建议蛋白质占总热量的15-25%。',
    sortOrder: 1,
  },
  {
    id: 'high-fiber',
    name: '高纤维',
    description: '增加膳食纤维摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加纤维', '全谷物']),
    aiPrompt: '用户需要高纤维饮食，建议每日摄入25-30g膳食纤维。多选择全谷物、蔬菜、水果、豆类等高纤维食物。',
    sortOrder: 2,
  },
  {
    id: 'high-calcium',
    name: '高钙',
    description: '增加钙质摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加钙质', '钙补充']),
    aiPrompt: '用户需要高钙饮食，建议每日摄入800-1000mg钙。多食用奶制品、豆制品、绿叶蔬菜、坚果等富含钙质的食物。',
    sortOrder: 3,
  },
  {
    id: 'high-iron',
    name: '高铁',
    description: '增加铁质摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加铁质', '铁补充']),
    aiPrompt: '用户需要高铁饮食，建议多食用瘦肉、鱼类、豆类、绿叶蔬菜等富含铁质的食物。搭配维生素C促进铁吸收。',
    sortOrder: 4,
  },
  {
    id: 'high-vitamin-c',
    name: '高维C',
    description: '增加维生素C摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加维生素C', '抗氧化']),
    aiPrompt: '用户需要高维生素C饮食，建议多食用柑橘类水果、草莓、猕猴桃、青椒、西兰花等富含维生素C的食物。',
    sortOrder: 5,
  },
  {
    id: 'high-omega3',
    name: '高omega-3',
    description: '增加omega-3脂肪酸摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加omega-3', '健康脂肪']),
    aiPrompt: '用户需要高omega-3饮食，建议多食用深海鱼类（如三文鱼、鲭鱼）、亚麻籽、核桃等富含omega-3的食物。',
    sortOrder: 6,
  },
  {
    id: 'high-vitamin-d',
    name: '高维D',
    description: '增加维生素D摄入',
    categoryId: 'nutritional-focus',
    restrictions: JSON.stringify(['增加维生素D', '钙吸收']),
    aiPrompt: '用户需要高维生素D饮食，建议多食用蛋黄、鱼类、奶制品等，同时适当晒太阳促进维生素D合成。',
    sortOrder: 7,
  },

  // 健康目标类 - 基于健康改善目标
  {
    id: 'weight-loss',
    name: '减重',
    description: '以减重为目标的饮食',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['热量控制', '营养均衡', '饱腹感']),
    aiPrompt: '用户以减重为目标，需要控制总热量摄入，同时保证营养均衡。建议选择高蛋白、高纤维、低脂肪的食物，增加饱腹感。',
    sortOrder: 1,
  },
  {
    id: 'muscle-gain',
    name: '增肌',
    description: '以增肌为目标的饮食',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['高蛋白', '适量碳水', '健康脂肪']),
    aiPrompt: '用户以增肌为目标，需要高蛋白质饮食配合适量碳水化合物。建议蛋白质1.2-1.6g/kg体重，选择瘦肉、鱼类、蛋类等优质蛋白。',
    sortOrder: 2,
  },
  {
    id: 'blood-sugar-control',
    name: '控糖',
    description: '控制血糖水平',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['低GI食物', '定时定量', '控制碳水']),
    aiPrompt: '用户需要控制血糖，建议选择低GI食物，定时定量进餐，控制碳水化合物摄入。优先选择全谷物、蔬菜、瘦肉等。',
    sortOrder: 3,
  },
  {
    id: 'heart-health',
    name: '护心',
    description: '保护心血管健康',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['低盐低脂', 'omega-3', '抗氧化']),
    aiPrompt: '用户以保护心血管健康为目标，建议低盐低脂饮食，多食用富含omega-3的鱼类、坚果，以及富含抗氧化物质的水果蔬菜。',
    sortOrder: 4,
  },
  {
    id: 'gut-health',
    name: '护肠',
    description: '维护肠道健康',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['益生菌', '膳食纤维', '易消化']),
    aiPrompt: '用户以维护肠道健康为目标，建议多食用富含膳食纤维的食物，如全谷物、蔬菜、水果，以及酸奶等益生菌食物。',
    sortOrder: 5,
  },
  {
    id: 'energy-boost',
    name: '提神',
    description: '提升精力和活力',
    categoryId: 'health-objectives',
    restrictions: JSON.stringify(['复合碳水', '优质蛋白', '维生素B族']),
    aiPrompt: '用户需要提升精力，建议选择复合碳水化合物、优质蛋白质和富含维生素B族的食物，如全谷物、瘦肉、蛋类等。',
    sortOrder: 6,
  },

  // 饮食偏好类 - 基于个人选择和生活方式
  {
    id: 'vegetarian',
    name: '素食',
    description: '素食主义饮食',
    categoryId: 'dietary-preferences',
    restrictions: JSON.stringify(['无肉类', '植物蛋白']),
    aiPrompt: '用户选择素食饮食，需要确保蛋白质、铁、维生素B12等营养素的摄入。建议多食用豆类、坚果、全谷物、绿叶蔬菜等。',
    sortOrder: 1,
  },
  {
    id: 'quick-meals',
    name: '快手菜',
    description: '快速制作的简单菜品',
    categoryId: 'dietary-preferences',
    restrictions: JSON.stringify(['制作简单', '时间短', '营养均衡']),
    aiPrompt: '用户需要快速制作的菜品，建议选择制作简单、时间短的食谱，同时保证营养均衡。可以使用预制食材或简单烹饪方法。',
    sortOrder: 2,
  },
  {
    id: 'budget-friendly',
    name: '经济实惠',
    description: '经济实惠的食材选择',
    categoryId: 'dietary-preferences',
    restrictions: JSON.stringify(['成本控制', '性价比高', '营养均衡']),
    aiPrompt: '用户需要经济实惠的饮食方案，建议选择性价比高的食材，如鸡蛋、豆类、应季蔬菜等，同时保证营养均衡。',
    sortOrder: 3,
  },
  {
    id: 'low-calorie',
    name: '低卡',
    description: '控制总热量摄入',
    categoryId: 'dietary-preferences',
    restrictions: JSON.stringify(['控制热量', '高纤维', '饱腹感']),
    aiPrompt: '用户需要低卡路里饮食，每餐热量控制在300-400卡路里。优先选择高纤维、低脂肪的食物，如蔬菜、瘦肉、全谷物等，增加饱腹感。',
    sortOrder: 4,
  },

  // 特殊需求类 - 特定人群或特殊时期
  {
    id: 'kid-friendly',
    name: '儿童友好',
    description: '适合儿童的饮食',
    categoryId: 'special-needs',
    restrictions: JSON.stringify(['营养丰富', '口感好', '色彩丰富']),
    aiPrompt: '用户需要适合儿童的饮食，建议选择营养丰富、口感好、色彩丰富的食物，避免过于辛辣或刺激性食物。',
    sortOrder: 1,
  },
  {
    id: 'elderly-friendly',
    name: '老年友好',
    description: '适合老年人的饮食',
    categoryId: 'special-needs',
    restrictions: JSON.stringify(['易消化', '营养丰富', '软烂适中']),
    aiPrompt: '用户需要适合老年人的饮食，建议选择易消化、营养丰富的食物，如蒸蛋、粥类、软烂的蔬菜等，注意补充钙质和蛋白质。',
    sortOrder: 2,
  },
  {
    id: 'pregnancy-friendly',
    name: '孕期友好',
    description: '适合孕妇的饮食',
    categoryId: 'special-needs',
    restrictions: JSON.stringify(['叶酸', '铁质', '蛋白质', '避免生食']),
    aiPrompt: '用户需要适合孕妇的饮食，建议多食用富含叶酸、铁质、蛋白质的食物，如绿叶蔬菜、瘦肉、蛋类等，避免生食和刺激性食物。',
    sortOrder: 3,
  },
];

// 标签冲突关系数据 - 更新以适应新分类
const seedTagConflicts = [
  // 互斥标签对 - 目标完全相反
  {
    id: 'conflict-1',
    tagId1: 'low-protein',
    tagId2: 'high-protein',
    conflictType: 'mutual_exclusive',
    description: '低蛋白和高蛋白目标相反，不能同时选择',
  },
  {
    id: 'conflict-2',
    tagId1: 'weight-loss',
    tagId2: 'muscle-gain',
    conflictType: 'mutual_exclusive',
    description: '减重和增肌目标相反，建议选择其中一个',
  },
  {
    id: 'conflict-3',
    tagId1: 'low-calorie',
    tagId2: 'muscle-gain',
    conflictType: 'mutual_exclusive',
    description: '低卡饮食不利于增肌，目标冲突',
  },

  // 警告类冲突 - 需要特别注意
  {
    id: 'conflict-4',
    tagId1: 'low-fat',
    tagId2: 'high-omega3',
    conflictType: 'warning',
    description: '低脂饮食可能限制omega-3摄入，需要特别注意',
  },
  {
    id: 'conflict-5',
    tagId1: 'dairy-free',
    tagId2: 'high-calcium',
    conflictType: 'warning',
    description: '无乳制品饮食需要其他钙源补充',
  },
  {
    id: 'conflict-6',
    tagId1: 'vegetarian',
    tagId2: 'high-protein',
    conflictType: 'warning',
    description: '素食高蛋白需要更多植物蛋白来源',
  },
  {
    id: 'conflict-7',
    tagId1: 'low-sugar',
    tagId2: 'energy-boost',
    conflictType: 'warning',
    description: '低糖饮食需要选择复合碳水化合物来提神',
  },
  {
    id: 'conflict-8',
    tagId1: 'gluten-free',
    tagId2: 'high-fiber',
    conflictType: 'warning',
    description: '无麸质饮食需要其他高纤维食物来源',
  },

  // 信息类冲突 - 提供建议
  {
    id: 'conflict-9',
    tagId1: 'low-salt',
    tagId2: 'heart-health',
    conflictType: 'info',
    description: '低盐饮食有助于护心，两者可以配合',
  },
  {
    id: 'conflict-10',
    tagId1: 'high-fiber',
    tagId2: 'gut-health',
    conflictType: 'info',
    description: '高纤维饮食有助于护肠，两者可以配合',
  },
  {
    id: 'conflict-11',
    tagId1: 'high-omega3',
    tagId2: 'heart-health',
    conflictType: 'info',
    description: '高omega-3饮食有助于护心，两者可以配合',
  },
  {
    id: 'conflict-12',
    tagId1: 'high-vitamin-c',
    tagId2: 'high-iron',
    conflictType: 'info',
    description: '高维C有助于铁吸收，两者可以配合',
  },
  {
    id: 'conflict-13',
    tagId1: 'high-vitamin-d',
    tagId2: 'high-calcium',
    conflictType: 'info',
    description: '高维D有助于钙吸收，两者可以配合',
  },
  {
    id: 'conflict-14',
    tagId1: 'pregnancy-friendly',
    tagId2: 'high-iron',
    conflictType: 'info',
    description: '孕期需要更多铁质，两者可以配合',
  },
  {
    id: 'conflict-15',
    tagId1: 'elderly-friendly',
    tagId2: 'high-calcium',
    conflictType: 'info',
    description: '老年人需要更多钙质，两者可以配合',
  },
];

// 种子函数
export async function seedDatabase(d1: D1Database) {
  const db = createDB(d1);

  try {
    // 插入标签分类（覆盖模式）
    console.log('🌱 插入/更新标签分类...');
    for (const category of seedTagCategories) {
      await db
        .insert(tagCategories)
        .values(category)
        .onConflictDoUpdate({
          target: tagCategories.id,
          set: {
            name: category.name,
            description: category.description,
            sortOrder: category.sortOrder,
          },
        });
    }

    // 插入标签（覆盖模式）
    console.log('🏷️ 插入/更新标签...');
    for (const tag of seedTags) {
      await db
        .insert(tags)
        .values(tag)
        .onConflictDoUpdate({
          target: tags.id,
          set: {
            name: tag.name,
            description: tag.description,
            categoryId: tag.categoryId,
            restrictions: tag.restrictions,
            aiPrompt: tag.aiPrompt,
            sortOrder: tag.sortOrder,
          },
        });
    }

    // 插入标签冲突关系（覆盖模式）
    console.log('🔄 插入/更新标签冲突关系...');
    for (const conflict of seedTagConflicts) {
      await db
        .insert(tagConflicts)
        .values(conflict)
        .onConflictDoUpdate({
          target: tagConflicts.id,
          set: {
            tagId1: conflict.tagId1,
            tagId2: conflict.tagId2,
            conflictType: conflict.conflictType,
            description: conflict.description,
          },
        });
    }

    console.log('✅ 数据库种子数据插入/更新完成！');
    console.log(`📊 共处理 ${seedTagCategories.length} 个分类，${seedTags.length} 个标签，${seedTagConflicts.length} 个标签冲突关系`);
  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
    throw error;
  }
} 