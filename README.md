# 📄 项目说明文档：智能饮食推荐与食材筛选系统

## 🧠 项目目标

本项目旨在为用户提供一个智能饮食推荐网页 App，功能包括：

- 支持多种饮食限制条件（如 IgA肾病、高血压、糖尿病等）
- 查询日常食材（蔬菜、水果、肉类、饮品、海鲜、河鲜等）是否可食用，标记为【可吃】【不建议】【适量】
- 支持输入一道菜名，自动识别其食材组成，并判断是否适合用户
- 支持基于用户可食用食材范围和饮食限制，**AI 自动生成推荐菜谱**
- 支持未来上传/补充菜谱、饮食注意事项等知识

## 🔍 目标用户

- 需要特殊饮食管理的人群（如 IgA肾病、高血压、糖尿病等）
- 想要清楚知道"我能不能吃？""这道菜对我合适吗？"的用户
- 家属、营养师等辅助饮食管理者

## 📚 功能模块设计

### 1. ✅ 饮食限制条件配置

用户可以选择一个或多个饮食限制条件，系统会根据选择的条件提供相应的饮食建议：

```ts
interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
  restrictions: {
    protein?: {
      min?: number;
      max?: number;
      unit: string;
    };
    potassium?: {
      min?: number;
      max?: number;
      unit: string;
    };
    phosphorus?: {
      min?: number;
      max?: number;
      unit: string;
    };
    sodium?: {
      min?: number;
      max?: number;
      unit: string;
    };
    other?: {
      [key: string]: {
        min?: number;
        max?: number;
        unit: string;
      };
    };
  };
  recommendations: string[];
  avoidFoods: string[];
  preferredFoods: string[];
}
```

### 2. ✅ 食材可用性查询模块

用户可以搜索任意一个食材，系统根据后台数据库返回是否【可吃】【不建议】【适量】

字段结构：

```ts
{
  id: string
  name: string
  category: 'vegetable' | 'fruit' | 'meat' | 'seafood' | 'beverage' | 'grain' | 'dairy' | 'other'
  allowed: 'yes' | 'no' | 'limited'
  reason?: string
  altNames?: string[]
  nutrition?: {
    protein?: number        // 单位：g/100g
    potassium?: number      // 单位：mg/100g
    phosphorus?: number     // 单位：mg/100g
    sodium?: number         // 单位：mg/100g
    calories?: number       // 单位：kcal/100g
  }
  season?: {
    spring?: boolean
    summer?: boolean
    autumn?: boolean
    winter?: boolean
  }
  storage?: {
    method: string
    duration: string
  }
  cooking?: {
    methods: string[]      // 推荐烹饪方式
    tips?: string         // 烹饪建议
  }
}
```

### 3. 🍳 菜谱风险分析模块

用户输入一道菜名（如"西红柿炖牛腩"），系统识别成分并评估：

```ts
{
  id: string
  name: "西红柿炖牛腩",
  ingredients: [
    { 
      name: "西红柿", 
      amount: "2个", 
      allowed: "yes",
      nutrition: {
        potassium: 237,
        sodium: 5
      }
    },
    { 
      name: "牛腩", 
      amount: "500g", 
      allowed: "limited", 
      reason: "高嘌呤",
      nutrition: {
        protein: 26.1,
        potassium: 318,
        phosphorus: 198
      }
    },
    { 
      name: "生抽", 
      amount: "1勺", 
      allowed: "limited", 
      reason: "含钠较高",
      nutrition: {
        sodium: 5058
      }
    }
  ],
  overallRisk: "limited",
  suggestion: "建议少量食用，可将牛腩更换为鸡胸肉",
  nutrition: {
    totalProtein: 65.2,    // 单位：g
    totalPotassium: 873,   // 单位：mg
    totalPhosphorus: 396,  // 单位：mg
    totalSodium: 5063,     // 单位：mg
    totalCalories: 450     // 单位：kcal
  }
}
```

### 4. 🧠 AI 菜谱生成模块

支持根据用户选择的饮食限制条件生成菜谱，返回结构如下：

```ts
{
  id: string;
  name: string;
  dietaryRestrictions: string[];  // 适用的饮食限制条件
  ingredients: [
    { 
      name: string;
      amount: string;
      nutrition: {
        protein: number;
        potassium: number;
        phosphorus: number;
        sodium: number;
        calories: number;
      }
    }
  ];
  steps: [
    {
      order: number;
      description: string;
      tips?: string;
    }
  ];
  nutrition: {
    totalProtein: number;    // 单位：g
    totalPotassium: number;  // 单位：mg
    totalPhosphorus: number; // 单位：mg
    totalSodium: number;     // 单位：mg
    totalCalories: number;   // 单位：kcal
  };
  dietNote: string;
  tags: string[];
  difficulty: '简单' | '中等' | '困难';
  cookingTime: string;
  servings: number;
}
```

## 🧩 技术架构

| 分类 | 技术/库 | 用途 |
|------|---------|------|
| 项目结构 | Turborepo | Monorepo 管理工具 |
| 前端框架 | Vite + React | 轻量级前端框架，开发体验好 |
| UI | shadcn/ui + Tailwind CSS | 高颜值组件库和样式系统 |
| 状态管理 | Zustand | 管理用户选择、搜索历史等状态 |
| 数据存储 | JSON 文件 | 静态数据存储，支持增量更新 |
| 搜索 | Fuse.js | 支持模糊搜索菜名和食材 |
| AI 接口 | OpenAI API | 菜谱生成和食材分析 |
| 表单 | react-hook-form + zod | 表单验证和类型安全 |
| 动画 | Framer Motion | 页面过渡和交互动画 |
| 路由 | React Router | 客户端路由管理 |
| 构建工具 | Vite | 快速的开发服务器和构建工具 |
| API 服务 | Express | 后端 API 服务 |
| 部署 | 阿里云函数计算 | Serverless 部署方案 |

## 📁 项目结构

```
.
├── packages/
│   ├── client/           # 前端应用
│   │   ├── src/
│   │   │   ├── pages/    # 页面组件
│   │   │   ├── components/ # 共享组件
│   │   │   │   ├── ui/   # 基础 UI 组件
│   │   │   │   ├── food/ # 食材相关组件
│   │   │   │   ├── recipe/ # 菜谱相关组件
│   │   │   │   └── dietary/ # 饮食限制条件相关组件
│   │   │   ├── data/    # JSON 数据文件
│   │   │   ├── lib/     # 工具函数
│   │   │   ├── hooks/   # 自定义 Hooks
│   │   │   ├── types/   # TypeScript 类型定义
│   │   │   └── styles/  # 全局样式
│   │   ├── public/      # 静态资源
│   │   └── package.json # 前端依赖配置
│   │
│   └── api/             # 后端 API 服务
│       ├── src/
│       │   ├── routes/  # API 路由
│       │   ├── services/ # 业务逻辑
│       │   ├── models/  # 数据模型
│       │   └── utils/   # 工具函数
│       ├── template.yml # 阿里云函数计算配置
│       └── package.json # API 依赖配置
│
├── package.json         # 工作空间配置
├── turbo.json          # Turborepo 配置
├── tsconfig.json       # TypeScript 配置
└── README.md           # 项目文档

```

## 📊 数据存储策略

### 1. 饮食限制条件数据 (data/restrictions/)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-03-20",
  "restrictions": [
    {
      "id": "iga_nephropathy",
      "name": "IgA肾病",
      "description": "需要控制蛋白质、钾、磷的摄入",
      "restrictions": {
        "protein": {
          "max": 1.2,
          "unit": "g/kg体重"
        },
        "potassium": {
          "max": 2500,
          "unit": "mg"
        },
        "phosphorus": {
          "max": 1000,
          "unit": "mg"
        }
      },
      "recommendations": [
        "控制蛋白质摄入",
        "限制高钾食物",
        "限制高磷食物",
        "控制钠盐摄入"
      ],
      "avoidFoods": [
        "菠菜",
        "香蕉",
        "动物内脏"
      ],
      "preferredFoods": [
        "鸡胸肉",
        "西兰花",
        "胡萝卜"
      ]
    },
    {
      "id": "hypertension",
      "name": "高血压",
      "description": "需要控制钠盐摄入",
      "restrictions": {
        "sodium": {
          "max": 2000,
          "unit": "mg"
        }
      },
      "recommendations": [
        "控制钠盐摄入",
        "增加钾的摄入",
        "控制总热量"
      ],
      "avoidFoods": [
        "咸菜",
        "腊肉",
        "方便面"
      ],
      "preferredFoods": [
        "新鲜蔬菜",
        "水果",
        "全谷物"
      ]
    }
  ]
}
```

### 2. 基础食材数据库 (data/foods/)

```json
// data/foods/vegetables.json
{
  "version": "1.0.0",
  "lastUpdated": "2024-03-20",
  "data": [
    {
      "id": "veg_001",
      "name": "西红柿",
      "category": "vegetable",
      "allowed": "yes",
      "reason": "低钾低磷，适合肾病患者",
      "altNames": ["番茄", "tomato"],
      "nutrition": {
        "protein": 0.9,
        "potassium": 237,
        "phosphorus": 24,
        "sodium": 5,
        "calories": 18
      },
      "season": {
        "spring": true,
        "summer": true,
        "autumn": true,
        "winter": false
      },
      "storage": {
        "method": "常温避光",
        "duration": "3-5天"
      },
      "cooking": {
        "methods": ["生食", "炒", "煮", "炖"],
        "tips": "生食时注意清洗，烹饪时避免过度加热"
      }
    }
  ]
}
```

### 3. 本地存储数据 (localStorage)

```typescript
// 本地存储的键名
const STORAGE_KEYS = {
  SEARCH_HISTORY: 'diet_search_history',
  FAVORITE_RECIPES: 'diet_favorite_recipes',
  RECENT_VIEWS: 'diet_recent_views',
  CUSTOM_RESTRICTIONS: 'diet_custom_restrictions'
} as const;

// 搜索历史记录（最多保存20条）
interface SearchHistory {
  query: string;
  timestamp: string;
  results: number;
}

// 收藏的菜谱
interface FavoriteRecipe {
  id: string;
  name: string;
  savedAt: string;
  note?: string;
}

// 最近查看的食材
interface RecentView {
  id: string;
  name: string;
  category: string;
  viewedAt: string;
}

// 自定义禁忌食材
interface CustomRestriction {
  id: string;
  name: string;
  reason: string;
  addedAt: string;
}
```

### 4. AI 生成数据缓存 (data/cache/)

```json
// data/cache/ai-recipes.json
{
  "version": "1.0.0",
  "lastUpdated": "2024-03-20",
  "recipes": [
    {
      "id": "ai_recipe_001",
      "name": "低钾蔬菜沙拉",
      "generatedAt": "2024-03-20T10:30:00Z",
      "prompt": "使用低钾蔬菜制作一道沙拉",
      "recipe": {
        // 完整的菜谱数据
      },
      "usageCount": 5,
      "lastUsed": "2024-03-20T15:30:00Z"
    }
  ]
}
```

### 5. 分类数据 (data/categories.json)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-03-20",
  "categories": [
    {
      "id": "vegetable",
      "name": "蔬菜",
      "description": "包括叶菜类、根茎类、瓜果类等",
      "icon": "🥬",
      "subcategories": [
        {
          "id": "leafy",
          "name": "叶菜类",
          "description": "如菠菜、生菜等"
        }
      ]
    }
  ]
}
```

### 6. 营养标准数据 (data/standards.json)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-03-20",
  "dailyLimits": {
    "protein": {
      "min": 0.8,
      "max": 1.2,
      "unit": "g/kg体重"
    },
    "potassium": {
      "min": 1500,
      "max": 2500,
      "unit": "mg"
    },
    "phosphorus": {
      "min": 800,
      "max": 1000,
      "unit": "mg"
    },
    "sodium": {
      "min": 1500,
      "max": 2300,
      "unit": "mg"
    }
  },
  "riskLevels": {
    "potassium": {
      "low": 1500,
      "medium": 2000,
      "high": 2500
    }
  }
}
```

### 数据更新策略

1. **基础数据更新**：
   - 通过版本控制管理
   - 定期更新营养成分数据
   - 添加新的食材和分类

2. **本地存储管理**：
   - 使用 localStorage 存储用户偏好
   - 定期清理过期数据
   - 设置数据上限（如搜索历史最多20条）
   - 支持一键清除所有本地数据

3. **AI 缓存更新**：
   - 设置缓存过期时间（如7天）
   - 定期清理低使用率数据
   - 保留高频使用数据
   - 缓存大小限制（如最多100条）

4. **数据验证**：
   - 使用 JSON Schema 验证数据格式
   - 定期检查数据完整性
   - 确保数据一致性

## 🔁 AI 接口设计

统一接口封装如下：

```ts
interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  success: boolean;
  content: string;
  raw?: unknown;
}

interface AIRecipeRequest extends AIRequest {
  ingredients: string[];
  restrictions: string[];  // 饮食限制条件ID列表
  preferences?: string[];
}
```

支持多 AI 服务商自由切换。

## 📌 开发中注意事项

- AI 生成内容需二次校验，确保安全性
- 支持用户自定义饮食限制条件
- 知识库可拓展，多疾病配置支持
- 确保 JSON 数据格式统一，便于维护
- 使用 Vite 的静态资源处理功能优化加载性能
- 实现 PWA 支持离线访问
- 使用 Turborepo 管理多包依赖和构建
- 遵循 monorepo 最佳实践，保持包之间的独立性
- 使用阿里云函数计算实现 Serverless 部署
- 确保前后端 API 接口类型安全

## 🔮 未来可拓展功能

- 用户历史记录与本地存储
- 周推荐计划、营养图表
- 多疾病组合支持
- 离线支持 (PWA)
- 数据导入导出功能
- 社区分享功能
- 营养师在线咨询

## ✅ 总结

这是一个智能饮食推荐平台，支持多种饮食限制条件，结合 AI 菜谱生成、成分筛查、用户互动等功能。采用静态数据存储方案，无需后端服务，部署简单，维护方便。

## 🔍 搜索功能说明

### 1. 搜索策略
- 精确匹配：完全匹配食材名称
- 模糊匹配：使用 Fuse.js 进行模糊搜索
- 同义词匹配：支持常见别名和方言
- 分类过滤：按食材类别筛选

### 2. 搜索示例
```ts
// 精确搜索
searchFood("西红柿")  // 返回精确匹配结果

// 模糊搜索
searchFood("番茄")    // 返回"西红柿"相关结果

// 分类搜索
searchFood("蔬菜", { category: "vegetable" })  // 返回蔬菜类结果

// 组合搜索
searchFood("鱼", { 
  allowed: "yes",
  nutrition: {
    protein: { min: 15 }
  }
})  // 返回高蛋白且可食用的鱼类
```

## 🤖 AI 接口使用说明

### 1. 菜谱生成
```ts
// 示例 prompt
const prompt = `
基于以下可食用食材生成一道适合肾病患者食用的菜谱：
- 鸡胸肉
- 西兰花
- 胡萝卜
要求：
1. 低盐低脂
2. 蛋白质含量适中
3. 钾含量较低
4. 烹饪方法简单
`;

// AI 响应处理
interface AIRecipeResponse {
  recipe: Recipe;
  alternatives: {
    ingredients: string[];
    cookingMethods: string[];
  };
  nutritionAnalysis: {
    strengths: string[];
    warnings: string[];
  };
}
```

### 2. 食材分析
```ts
// 示例 prompt
const prompt = `
分析以下食材是否适合肾病患者食用：
- 菠菜
- 豆腐
- 虾
考虑因素：
1. 钾含量
2. 磷含量
3. 蛋白质含量
4. 钠含量
`;

// AI 响应处理
interface AIFoodAnalysisResponse {
  foods: {
    name: string;
    allowed: 'yes' | 'no' | 'limited';
    reasons: string[];
    alternatives: string[];
  }[];
  overallAssessment: string;
  recommendations: string[];
}
```
