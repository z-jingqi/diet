import { useNavigate, NavigateOptions } from '@tanstack/react-router';
import useAuthStore from '@/store/auth-store';
import { showAuthPrompt } from '@/utils/auth-utils';

// 需要认证保护的路由路径
const PROTECTED_ROUTES = ['/profile', '/recipe'];

// 检查路径是否需要认证
const isProtectedRoute = (path: string) => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

export const useAuthNavigate = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthStore();

  const authNavigate = (options: NavigateOptions) => {
    const targetPath = options.to;
    
    // 检查目标路由是否需要认证
    if (targetPath && isProtectedRoute(targetPath) && requireAuth()) {
      // 显示认证提示
      showAuthPrompt(() => navigate({ to: '/login' }));
      
      // 不执行导航
      return;
    }
    
    // 执行正常导航
    navigate(options);
  };

  return authNavigate;
}; 
