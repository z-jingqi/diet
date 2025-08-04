import { useEffect, useState, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

type NavigationDirection = 'forward' | 'backward' | 'replace';

interface NavigationState {
  direction: NavigationDirection;
  isInitialNavigation: boolean;
}

// 路由层级定义，用于判断导航方向
const ROUTE_HIERARCHY: Record<string, number> = {
  // Root 层级 (0)
  '/': 0,                    // 主页/聊天页面
  '/login': 0,               // 登录页面
  '/register': 0,            // 注册页面
  
  // 一级页面 (1)
  '/profile': 1,             // 用户资料页面
  
  // 二级页面 (2)
  '/favorite-recipes': 2,    // 收藏食谱页面
  
  // 三级页面 (3)
  '/shopping-list': 3,       // 购物清单页面
  
  // 动态路由
  '/recipe': 3,              // 食谱详情页面（与购物清单同级）
  
  // 聊天会话路由
  '/$sessionId': 0,          // 聊天会话（与主页同级）
};

const useNavigationDirection = (): NavigationState => {
  const location = useLocation();
  const [state, setState] = useState<NavigationState>({
    direction: 'forward',
    isInitialNavigation: true,
  });
  
  const prevLocationRef = useRef<string>('');
  const isInitialLoadRef = useRef(true);
  const lastProcessedPathRef = useRef<string>('');
  const lastProcessedTimeRef = useRef<number>(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentTime = Date.now();
    
    // 防止重复处理同一路径（增加时间间隔检查）
    if (lastProcessedPathRef.current === currentPath && 
        currentTime - lastProcessedTimeRef.current < 100) {
      return;
    }
    
    // 初始加载
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevLocationRef.current = currentPath;
      lastProcessedPathRef.current = currentPath;
      lastProcessedTimeRef.current = currentTime;
      setState({
        direction: 'forward',
        isInitialNavigation: true,
      });
      return;
    }

    const prevPath = prevLocationRef.current;
    let direction: NavigationDirection = 'forward';

    // 简化的方向检测逻辑
    const currentDepth = getRouteDepth(currentPath);
    const prevDepth = getRouteDepth(prevPath);
    
    // 特殊情况处理
    if (isSpecialNavigation(prevPath, currentPath)) {
      direction = getSpecialNavigationDirection(prevPath, currentPath);
    } else if (currentDepth < prevDepth) {
      direction = 'backward';
    } else if (currentDepth > prevDepth) {
      direction = 'forward';
    } else {
      // 同级路由，使用特殊规则
      direction = getSpecialNavigationDirection(prevPath, currentPath);
    }

    // 调试信息（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('Navigation Direction Debug:', {
        from: prevPath,
        to: currentPath,
        direction,
        currentDepth,
        prevDepth,
        isSpecial: isSpecialNavigation(prevPath, currentPath),
        timestamp: currentTime,
        timeSinceLastProcess: currentTime - lastProcessedTimeRef.current
      });
    }

    prevLocationRef.current = currentPath;
    lastProcessedPathRef.current = currentPath;
    lastProcessedTimeRef.current = currentTime;
    setState({
      direction,
      isInitialNavigation: false,
    });
  }, [location.pathname]);

  return state;
};

// 获取路由深度
const getRouteDepth = (path: string): number => {
  // 检查精确匹配
  if (ROUTE_HIERARCHY[path] !== undefined) {
    return ROUTE_HIERARCHY[path];
  }
  
  // 检查动态路由
  if (path.startsWith('/recipe/')) {
    return 2;
  }
  
  if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
    return 1; // 会话 ID 路由
  }
  
  // 默认基于路径分段计算深度
  return path.split('/').filter(Boolean).length;
};

// 检查是否是特殊导航（如登录/注册之间的切换）
const isSpecialNavigation = (from: string, to: string): boolean => {
  const authRoutes = ['/login', '/register'];
  const mainRoutes = ['/', '/$sessionId']; // 主页和聊天会话
  const profileRoutes = ['/profile'];
  const recipeFlowRoutes = ['/favorite-recipes', '/recipe', '/shopping-list'];
  
  return authRoutes.includes(from) && authRoutes.includes(to) ||
         mainRoutes.includes(from) && mainRoutes.includes(to) ||
         profileRoutes.includes(from) && profileRoutes.includes(to) ||
         recipeFlowRoutes.includes(from) && recipeFlowRoutes.includes(to);
};

// 获取特殊导航的方向
const getSpecialNavigationDirection = (from: string, to: string): NavigationDirection => {
  // 登录/注册流程
  if (from === '/login' && to === '/register') {
    return 'forward';
  }
  if (from === '/register' && to === '/login') {
    return 'backward';
  }
  
  // 主页/聊天会话流程
  if (from === '/' && to.startsWith('/$sessionId')) {
    return 'forward';
  }
  if (from.startsWith('/$sessionId') && to === '/') {
    return 'backward';
  }
  
  // 用户资料流程
  if (from === '/' && to === '/profile') {
    return 'forward';
  }
  if (from === '/profile' && to === '/') {
    return 'backward';
  }
  
  // 收藏食谱流程
  if (from === '/profile' && to === '/favorite-recipes') {
    return 'forward';
  }
  if (from === '/favorite-recipes' && to === '/profile') {
    return 'backward';
  }
  
  // 食谱详情/购物清单流程
  if (from === '/favorite-recipes' && to.startsWith('/recipe/')) {
    return 'forward';
  }
  if (from.startsWith('/recipe/') && to === '/shopping-list') {
    return 'forward';
  }
  if (from === '/shopping-list' && to.startsWith('/recipe/')) {
    return 'backward';
  }
  if (from.startsWith('/recipe/') && to === '/favorite-recipes') {
    return 'backward';
  }
  
  return 'forward';
};

export default useNavigationDirection;
