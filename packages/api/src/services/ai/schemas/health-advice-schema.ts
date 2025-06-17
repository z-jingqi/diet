export const HEALTH_ADVICE_SCHEMA = {
  type: "object",
  description: "健康建议数据结构",
  required: ["type", "title", "status", "reasons", "suggestions", "scenarios"],
  properties: {
    type: {
      type: "string",
      description: "建议类型",
      enum: ["diet", "exercise", "lifestyle", "mental", "environment", "social", "seasonal", "other"]
    },
    title: { 
      type: "string",
      description: "建议标题"
    },
    status: {
      type: "string",
      description: "建议状态",
      enum: ["recommended", "moderate", "not_recommended", "forbidden"]
    },
    reasons: {
      type: "array",
      description: "原因分析列表",
      items: {
        type: "object",
        required: ["type", "content"],
        properties: {
          type: {
            type: "string",
            description: "原因类型",
            enum: ["health", "fitness", "lifestyle", "mental", "environment", "social", "seasonal", "safety", "other"]
          },
          content: { 
            type: "string",
            description: "原因说明"
          },
          details: {
            type: "object",
            description: "详细数据",
            properties: {
              health: {
                type: "object",
                description: "健康相关数据",
                required: ["impact"],
                properties: {
                  disease: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "相关疾病列表"
                  },
                  nutrients: {
                    type: "array",
                    description: "营养成分列表",
                    items: {
                      type: "object",
                      required: ["name", "amount", "unit"],
                      properties: {
                        name: { 
                          type: "string",
                          description: "营养成分名称"
                        },
                        amount: { 
                          type: "number",
                          description: "含量"
                        },
                        unit: { 
                          type: "string",
                          description: "单位"
                        }
                      }
                    }
                  },
                  impact: { 
                    type: "string",
                    description: "影响说明"
                  }
                }
              },
              fitness: {
                type: "object",
                description: "健身相关数据",
                required: ["impact"],
                properties: {
                  calories: { 
                    type: "number",
                    description: "卡路里"
                  },
                  protein: { 
                    type: "number",
                    description: "蛋白质含量"
                  },
                  carbs: { 
                    type: "number",
                    description: "碳水化合物含量"
                  },
                  fat: { 
                    type: "number",
                    description: "脂肪含量"
                  },
                  impact: { 
                    type: "string",
                    description: "对健身目标的影响"
                  }
                }
              },
              lifestyle: {
                type: "object",
                description: "生活方式相关数据",
                required: ["impact"],
                properties: {
                  time: { 
                    type: "string",
                    description: "建议时间"
                  },
                  frequency: { 
                    type: "string",
                    description: "建议频率"
                  },
                  duration: { 
                    type: "string",
                    description: "建议持续时间"
                  },
                  impact: { 
                    type: "string",
                    description: "对生活的影响"
                  }
                }
              },
              mental: {
                type: "object",
                description: "心理相关数据",
                required: ["impact"],
                properties: {
                  stress: { 
                    type: "number", 
                    minimum: 1, 
                    maximum: 10,
                    description: "压力水平（1-10）"
                  },
                  mood: { 
                    type: "string",
                    description: "情绪状态"
                  },
                  sleep: { 
                    type: "string",
                    description: "睡眠质量"
                  },
                  impact: { 
                    type: "string",
                    description: "对心理的影响"
                  }
                }
              },
              environment: {
                type: "object",
                description: "环境相关数据",
                required: ["impact"],
                properties: {
                  airQuality: { 
                    type: "string",
                    description: "空气质量"
                  },
                  temperature: { 
                    type: "number",
                    description: "温度（摄氏度）"
                  },
                  humidity: { 
                    type: "number",
                    description: "湿度（百分比）"
                  },
                  noise: { 
                    type: "string",
                    description: "噪音水平"
                  },
                  impact: { 
                    type: "string",
                    description: "对环境的影响"
                  }
                }
              },
              social: {
                type: "object",
                description: "社交相关数据",
                required: ["impact"],
                properties: {
                  activity: { 
                    type: "string",
                    description: "社交活动类型"
                  },
                  frequency: { 
                    type: "string",
                    description: "社交频率"
                  },
                  intensity: { 
                    type: "string",
                    description: "社交强度"
                  },
                  impact: { 
                    type: "string",
                    description: "对社交的影响"
                  }
                }
              },
              seasonal: {
                type: "object",
                description: "季节相关数据",
                required: ["impact"],
                properties: {
                  season: { 
                    type: "string",
                    description: "季节"
                  },
                  temperature: {
                    type: "object",
                    description: "温度范围",
                    properties: {
                      min: { 
                        type: "number",
                        description: "最低温度"
                      },
                      max: { 
                        type: "number",
                        description: "最高温度"
                      }
                    }
                  },
                  humidity: {
                    type: "object",
                    description: "湿度范围",
                    properties: {
                      min: { 
                        type: "number",
                        description: "最低湿度"
                      },
                      max: { 
                        type: "number",
                        description: "最高湿度"
                      }
                    }
                  },
                  impact: { 
                    type: "string",
                    description: "对季节的影响"
                  }
                }
              }
            }
          }
        }
      }
    },
    suggestions: {
      type: "array",
      description: "具体建议列表",
      items: {
        type: "object",
        required: ["type", "content", "priority"],
        properties: {
          type: {
            type: "string",
            description: "建议类型",
            enum: ["alternative", "precaution", "recommendation"]
          },
          content: { 
            type: "string",
            description: "具体建议内容"
          },
          priority: {
            type: "string",
            description: "建议优先级",
            enum: ["high", "medium", "low"]
          }
        }
      }
    },
    scenarios: {
      type: "array",
      description: "适用场景列表",
      items: {
        type: "object",
        required: ["type", "description"],
        properties: {
          type: {
            type: "string",
            description: "场景类型",
            enum: ["health", "fitness", "lifestyle", "mental", "environment", "social", "seasonal", "other"]
          },
          description: { 
            type: "string",
            description: "场景描述"
          },
          conditions: {
            type: "object",
            description: "适用条件",
            properties: {
              age: {
                type: "object",
                description: "年龄范围",
                properties: {
                  min: { 
                    type: "number",
                    description: "最小年龄"
                  },
                  max: { 
                    type: "number",
                    description: "最大年龄"
                  }
                }
              },
              gender: {
                type: "string",
                description: "性别",
                enum: ["male", "female", "all"]
              },
              health: { 
                type: "array", 
                items: { type: "string" },
                description: "健康状况列表"
              },
              fitness: { 
                type: "array", 
                items: { type: "string" },
                description: "健身目标列表"
              },
              mental: { 
                type: "array", 
                items: { type: "string" },
                description: "心理状态列表"
              },
              environment: { 
                type: "array", 
                items: { type: "string" },
                description: "环境条件列表"
              },
              social: { 
                type: "array", 
                items: { type: "string" },
                description: "社交状态列表"
              },
              seasonal: { 
                type: "array", 
                items: { type: "string" },
                description: "季节条件列表"
              }
            }
          }
        }
      }
    }
  }
} as const; 