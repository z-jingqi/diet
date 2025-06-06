import type { Message, MessageType } from '../types/chat';
import { mockRecipes } from './recipe';

// 聊天消息数据
export const mockMessages: Message[] = [
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
    content: JSON.stringify({
      description: `# 低钠鸡胸肉沙拉推荐

这是一道非常适合控制钠摄入人群的沙拉，具有以下特点：

## 营养特点
- 钠含量仅为 107mg，远低于普通菜谱
- 富含优质蛋白质（45.8g）
- 提供丰富的膳食纤维

## 制作特点
- 制作简单，只需 20 分钟
- 适合 2 人食用
- 适合减脂人群`,
      recipes: [mockRecipes[0]]
    }),
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:25")
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
    content: JSON.stringify({
      description: `# 低钠菜谱推荐

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
      recipes: [mockRecipes[1], mockRecipes[2]]
    }),
    type: "recipe" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:50")
  },
  {
    id: "msg-10",
    content: "这些菜谱都很适合您。您可以根据自己的喜好选择，需要我详细解释某个菜谱吗？",
    type: "chat" as MessageType,
    isUser: false,
    createdAt: new Date("2024-03-20T10:00:55")
  }
]; 
 