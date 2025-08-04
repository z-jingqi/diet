// 移动端设备检测和优化工具

/**
 * 检测是否为移动设备
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 检测是否支持触摸
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * 获取安全区域边距（用于刘海屏等）
 */
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
  };
};

/**
 * 防止页面滚动（在动画期间使用）
 */
export const preventScroll = (prevent: boolean) => {
  if (typeof document === 'undefined') {
    return;
  }
  
  if (prevent) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
};

/**
 * 优化触摸事件的配置
 */
export const optimizedTouchOptions = {
  passive: false,
  capture: false,
} as const;

/**
 * 获取设备像素比
 */
export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') {
    return 1;
  }
  
  return window.devicePixelRatio || 1;
};

/**
 * 检测是否为低端设备（基于硬件并发数和内存）
 */
export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  // 低于 2 核心或 2GB 内存认为是低端设备
  return hardwareConcurrency < 2 || deviceMemory < 2;
};

export default {
  isMobile,
  isTouchDevice,
  getSafeAreaInsets,
  preventScroll,
  optimizedTouchOptions,
  getDevicePixelRatio,
  isLowEndDevice,
};
