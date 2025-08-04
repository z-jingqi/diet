// 统一的查询配置，避免无限重试和过度请求

export const DEFAULT_QUERY_OPTIONS = {
  // 重试配置
  retry: 2, // 最多重试2次
  retryDelay: 1000, // 1秒重试延迟
  
  // 缓存配置
  staleTime: 5 * 60 * 1000, // 5分钟缓存
  gcTime: 10 * 60 * 1000,   // 10分钟垃圾回收时间
  
  // 避免不必要的重新请求
  refetchOnWindowFocus: false, // 避免窗口聚焦时重新请求
  refetchOnReconnect: false,   // 避免网络重连时重新请求
  refetchOnMount: true,        // 组件挂载时重新请求（确保数据新鲜）
} as const;

// 预加载查询配置（更保守的重试策略）
export const PRELOAD_QUERY_OPTIONS = {
  ...DEFAULT_QUERY_OPTIONS,
  retry: 1, // 预加载时只重试1次
  retryDelay: 2000, // 2秒重试延迟
  refetchOnMount: false, // 预加载时不重新请求
} as const;

// 缓存优先的查询配置（减少卡顿）
export const CACHE_FIRST_QUERY_OPTIONS = {
  ...DEFAULT_QUERY_OPTIONS,
  staleTime: 10 * 60 * 1000, // 10分钟缓存
  refetchOnMount: false, // 组件挂载时不重新请求，优先使用缓存
  refetchOnWindowFocus: false, // 避免窗口聚焦时重新请求
  refetchOnReconnect: false, // 避免网络重连时重新请求
} as const;

// 关键查询配置（更积极的重试策略）
export const CRITICAL_QUERY_OPTIONS = {
  ...DEFAULT_QUERY_OPTIONS,
  retry: 3, // 关键查询重试3次
  retryDelay: 500, // 0.5秒重试延迟
} as const;

// 根据网络状况调整配置
export function getAdaptiveQueryOptions(networkType?: string) {
  const isSlowNetwork = networkType === 'slow-2g' || networkType === '2g';
  
  if (isSlowNetwork) {
    return {
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1, // 慢网络时减少重试
      retryDelay: 3000, // 增加重试延迟
      staleTime: 10 * 60 * 1000, // 增加缓存时间
    };
  }
  
  return DEFAULT_QUERY_OPTIONS;
} 
