import type { Message, MessageType } from '../types/chat';
import type { Recipe } from '../types/recipe';

// 获取食谱数据的函数，避免循环依赖
const getMockRecipes = async (): Promise<Recipe[]> => {
  // 使用 ESM 动态导入
  const { mockRecipes } = await import('./recipe');
  return mockRecipes;
};

// 聊天消息数据
export const mockMessages: Message[] = [
  {
    id: "msg-long",
    content: `# 肾脏病患者的饮食建议

## 基本原则
1. 控制蛋白质摄入
   - 优质蛋白为主，如鱼、禽、蛋、奶
   - 每日蛋白质摄入量控制在0.8-1.0g/kg体重
   - 避免高蛋白饮食，减轻肾脏负担

2. 限制钠的摄入
   - 每日钠摄入量控制在2000mg以下
   - 避免使用含钠量高的调味料
   - 选择新鲜食材，避免加工食品

3. 控制钾的摄入
   - 每日钾摄入量控制在2000mg以下
   - 避免高钾食物，如香蕉、土豆、番茄
   - 蔬菜水果要适量，注意烹饪方式

4. 限制磷的摄入
   - 每日磷摄入量控制在800-1000mg
   - 避免含磷添加剂的食物
   - 选择低磷的蛋白质来源

## 具体建议
1. 主食选择
   - 以精白米面为主
   - 适量搭配低磷的杂粮
   - 控制总热量摄入

2. 蛋白质来源
   - 优先选择鱼肉、禽肉
   - 适量食用蛋类和奶制品
   - 控制豆制品的摄入

3. 蔬菜水果
   - 选择低钾的蔬菜
   - 水果要适量，注意种类
   - 避免生食，建议煮熟后食用

4. 烹饪方式
   - 采用蒸、煮、炖等烹饪方式
   - 避免油炸、烧烤
   - 使用低钠调味料

## 注意事项
1. 饮食要规律，少量多餐
2. 保持充足的水分摄入
3. 定期监测各项指标
4. 根据病情调整饮食方案
5. 保持适度运动，增强体质

希望这些建议对您有所帮助。如果您有任何具体的饮食问题，欢迎随时咨询。`,
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:00")
  },
  {
    id: "msg-1",
    content: "你好，我想找一些低钠的食谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:00")
  },
  {
    id: "msg-2",
    content: "您好！我很乐意帮您寻找低钠食谱。请问您有什么特别的饮食需求或偏好吗？比如是否对某些食材过敏，或者是否有其他饮食限制？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:05")
  },
  {
    id: "msg-3",
    content: "我最近在控制钠的摄入，希望能找到一些简单易做的菜谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:15")
  },
  {
    id: "msg-4",
    content: "明白了。我为您推荐几道低钠且容易制作的菜谱，这些菜谱都经过精心设计，既保证了营养均衡，又控制了钠的摄入。",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:20")
  },
  {
    id: "msg-5",
    content: `# 低钠鸡胸肉沙拉推荐

这是一道非常适合控制钠摄入人群的沙拉，具有以下特点：

## 营养特点
- 钠含量仅为 107mg，远低于普通菜谱
- 富含优质蛋白质（45.8g）
- 提供丰富的膳食纤维

## 制作特点
- 制作简单，只需 20 分钟
- 适合 2 人食用
- 适合减脂人群`,
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:25"),
    recipes: [] // 暂时为空数组，在运行时动态填充
  },
  {
    id: "msg-6",
    content: "这个低钠鸡胸肉沙拉看起来不错，能详细说说它的营养特点吗？",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:35")
  },
  {
    id: "msg-7",
    content: "这道菜谱的钠含量仅为107mg，远低于普通菜谱。同时，它富含优质蛋白质（45.8g）和膳食纤维，非常适合控制钠摄入的人群。您觉得这个菜谱怎么样？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:40")
  },
  {
    id: "msg-8",
    content: "很好，我还想看看其他低钠的菜谱",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:00:45")
  },
  {
    id: "msg-9",
    content: `# 低钠菜谱推荐

为您推荐两道低钠菜谱，它们都具有以下特点：

## 低磷糙米粥
- 钠含量仅 79mg，适合严格控制钠摄入
- 蛋白质含量 25.6g，提供优质蛋白
- 易消化，适合消化功能较弱人群

## 高蛋白西兰花炒鸡胸
- 钠含量 181mg，适合控制钠摄入
- 蛋白质含量高达 89.4g，满足增肌需求
- 营养均衡，适合健身人群

两道菜都简单易做，营养均衡，您可以根据自己的需求选择。`,
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:50"),
    recipes: [] // 暂时为空数组，在运行时动态填充
  },
  {
    id: "msg-10",
    content: "这些菜谱都很适合您。您可以根据自己的喜好选择，需要我详细解释某个菜谱吗？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:55")
  },
  {
    id: "msg-11",
    content: "香蕉可以吃吗？",
    type: "chat" as MessageType,
    isUser: true,
    createdAt: new Date("2024-03-20T10:01:00")
  },
  {
    id: "msg-12",
    content: "香蕉富含钾元素，对肾脏病患者需要控制摄入量。建议每次食用不超过半根，每周不超过2-3次。您可以选择苹果、梨等低钾水果作为替代。",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:01:05")
  }
];

// 初始化食谱数据
export const initializeMockData = async () => {
  const recipes = await getMockRecipes();
  mockMessages.forEach((message) => {
    if (message.type === "recipe" && message.recipes) {
      message.recipes = recipes;
    }
  });
}; 
 