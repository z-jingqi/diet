/**
 * 建议状态
 */
export type AdviceStatus =
  | "recommended"    // 推荐
  | "moderate"       // 适量/适度
  | "not_recommended" // 不推荐
  | "forbidden";     // 禁止

/**
 * 建议类型
 */
export type SuggestionType = 
  | "alternative"    // 替代方案
  | "precaution"     // 注意事项
  | "recommendation"; // 推荐建议

/**
 * 原因类型
 */
export type ReasonType =
  | "health"         // 健康相关
  | "fitness"        // 健身相关
  | "lifestyle"      // 生活方式相关
  | "mental"         // 心理相关
  | "environment"    // 环境相关
  | "social"         // 社交相关
  | "seasonal"       // 季节相关
  | "safety"         // 安全相关
  | "other";         // 其他原因

/**
 * 场景类型
 */
export type ScenarioType = 
  | "health"         // 健康场景
  | "fitness"        // 健身场景
  | "lifestyle"      // 生活方式场景
  | "mental"         // 心理场景
  | "environment"    // 环境场景
  | "social"         // 社交场景
  | "seasonal"       // 季节场景
  | "other";         // 其他场景

/**
 * 健康建议类型
 */
export type HealthAdviceType = 
  | "diet"           // 饮食相关
  | "exercise"       // 运动相关
  | "lifestyle"      // 生活方式相关
  | "mental"         // 心理相关
  | "environment"    // 环境相关
  | "social"         // 社交相关
  | "seasonal"       // 季节相关
  | "other";         // 其他类型

/**
 * 健康建议响应接口
 */
export interface HealthAdviceResponse {
  /** 建议类型 */
  type: HealthAdviceType;
  /** 建议标题 */
  title: string;
  /** 建议状态 */
  status: AdviceStatus;
  /** 生成时间 */
  timestamp: string;
  /** 原因分析列表 */
  reasons: {
    /** 原因类型 */
    type: ReasonType;
    /** 原因说明 */
    content: string;
    /** 详细数据 */
    details?: {
      /** 健康相关数据 */
      health?: {
        /** 相关疾病列表 */
        disease?: string[];
        /** 营养成分列表 */
        nutrients?: {
          /** 营养成分名称 */
          name: string;
          /** 含量 */
          amount: number;
          /** 单位 */
          unit: string;
          /** 影响说明 */
          impact: string;
        }[];
      };
      /** 健身相关数据 */
      fitness?: {
        /** 卡路里 */
        calories?: number;
        /** 蛋白质含量 */
        protein?: number;
        /** 碳水化合物含量 */
        carbs?: number;
        /** 脂肪含量 */
        fat?: number;
        /** 对健身目标的影响 */
        impact: string;
      };
      /** 生活方式相关数据 */
      lifestyle?: {
        /** 时间相关 */
        time?: string;
        /** 频率相关 */
        frequency?: string;
        /** 持续时间 */
        duration?: string;
        /** 对生活的影响 */
        impact: string;
      };
      /** 心理相关数据 */
      mental?: {
        /** 压力水平 */
        stress?: number;
        /** 情绪状态 */
        mood?: string;
        /** 睡眠质量 */
        sleep?: string;
        /** 对心理的影响 */
        impact: string;
      };
      /** 环境相关数据 */
      environment?: {
        /** 空气质量 */
        airQuality?: string;
        /** 温度 */
        temperature?: number;
        /** 湿度 */
        humidity?: number;
        /** 噪音水平 */
        noise?: string;
        /** 对环境的影响 */
        impact: string;
      };
      /** 社交相关数据 */
      social?: {
        /** 社交活动类型 */
        activity?: string;
        /** 社交频率 */
        frequency?: string;
        /** 社交强度 */
        intensity?: string;
        /** 对社交的影响 */
        impact: string;
      };
      /** 季节相关数据 */
      seasonal?: {
        /** 季节 */
        season?: string;
        /** 温度范围 */
        temperature?: {
          min: number;
          max: number;
        };
        /** 湿度范围 */
        humidity?: {
          min: number;
          max: number;
        };
        /** 对季节的影响 */
        impact: string;
      };
    };
  }[];
  /** 具体建议列表 */
  suggestions: {
    /** 建议类型 */
    type: SuggestionType;
    /** 建议内容 */
    content: string;
    /** 建议优先级 */
    priority: "high" | "medium" | "low";
  }[];
  /** 适用场景列表 */
  scenarios: {
    /** 场景类型 */
    type: ScenarioType;
    /** 场景描述 */
    description: string;
    /** 适用条件 */
    conditions?: {
      /** 年龄范围 */
      age?: {
        /** 最小年龄 */
        min?: number;
        /** 最大年龄 */
        max?: number;
      };
      /** 性别 */
      gender?: "male" | "female" | "all";
      /** 健康状况列表 */
      health?: string[];
      /** 健身目标列表 */
      fitness?: string[];
      /** 心理状态列表 */
      mental?: string[];
      /** 环境条件列表 */
      environment?: string[];
      /** 社交状态列表 */
      social?: string[];
      /** 季节条件列表 */
      seasonal?: string[];
    };
  }[];
}
