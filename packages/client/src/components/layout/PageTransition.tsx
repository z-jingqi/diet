import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { ReactNode, useEffect } from "react";
import useNavigationDirection from "@/hooks/useNavigationDirection";
import useMediaQuery from "@/hooks/useMediaQuery";
import { isLowEndDevice, preventScroll } from "@/utils/mobile-utils";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const { direction, isInitialNavigation } = useNavigationDirection();
  
  // 检测设备性能，低端设备使用简化动画
  const isLowEnd = isLowEndDevice();
  const isMobileDevice = useMediaQuery("(max-width: 768px)");
  
  // 检测网络状态，慢网络时调整动画
  const isSlowNetwork = (navigator as any).connection?.effectiveType === 'slow-2g' || 
                       (navigator as any).connection?.effectiveType === '2g';

  // 调试信息（开发环境）- 只在有动画时显示
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isMobileDevice && !isInitialNavigation) {
      console.log('PageTransition Debug:', {
        pathname: location.pathname,
        direction,
        routeDepth: getRouteDepth(location.pathname),
        animationType: `${direction} slide`,
        networkType: (navigator as any).connection?.effectiveType || 'unknown',
        isSlowNetwork,
        animationDuration: isSlowNetwork ? 0.08 : (isLowEnd ? 0.12 : 0.15),
        timestamp: Date.now()
      });
    }
  }, [location.pathname, direction, isInitialNavigation, isMobileDevice, isLowEnd, isSlowNetwork]);

  // 辅助函数：获取路由深度（用于调试）
  const getRouteDepth = (path: string): number => {
    const ROUTE_HIERARCHY: Record<string, number> = {
      '/': 0, '/login': 0, '/register': 0, '/$sessionId': 0,
      '/profile': 1,
      '/favorite-recipes': 2,
      '/recipe': 3, '/shopping-list': 3,
    };
    
    if (ROUTE_HIERARCHY[path] !== undefined) {
      return ROUTE_HIERARCHY[path];
    }
    
    if (path.startsWith('/recipe/')) {
      return 3;
    }
    
    return path.split('/').filter(Boolean).length;
  };

  // 在动画期间防止页面滚动
  useEffect(() => {
    if (!isInitialNavigation && isMobileDevice) {
      preventScroll(true);
      
      const timer = setTimeout(() => {
        preventScroll(false);
      }, isSlowNetwork ? 120 : 200); // 慢网络时进一步缩短滚动锁定时间
      
      return () => {
        clearTimeout(timer);
        preventScroll(false);
      };
    }
  }, [location.pathname, isInitialNavigation, isMobileDevice, isSlowNetwork]);

  // 动画变量 - 针对低端设备优化
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0.8, // 稍微提高初始透明度，减少白屏感
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0.8, // 保持透明度，减少闪烁
    }),
  };

  // 桌面端不显示动画，直接渲染内容
  if (!isMobileDevice) {
    return (
      <div className="w-full h-full">
        {children}
      </div>
    );
  }

  // 初始加载时不显示动画
  if (isInitialNavigation) {
    return (
      <div className="w-full h-full">
        {children}
      </div>
    );
  }



  return (
    <div className="relative w-full h-full overflow-hidden page-transition-container">
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "tween",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: isSlowNetwork ? 0.08 : (isLowEnd ? 0.12 : 0.15), // 慢网络时进一步缩短动画时间
            staggerChildren: 0.01, // 进一步减少子元素错开时间
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden', // 防止闪烁
            perspective: 1000, // 硬件加速
            transformStyle: 'preserve-3d', // 保持3D变换
          }}
          onAnimationStart={() => {
            // 动画开始时的额外优化
            document.body.style.userSelect = 'none';
          }}
          onAnimationComplete={() => {
            // 动画完成后清理
            document.body.style.userSelect = '';
          }}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
