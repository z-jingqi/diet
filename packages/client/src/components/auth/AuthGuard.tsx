import React from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

interface AuthGuardProps {
  children: React.ReactNode;
  showToast?: boolean;
  toastMessage?: string;
  toastDescription?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  showToast = true,
  toastMessage = '需要登录才能访问此功能',
  toastDescription = '请先登录您的账户'
}) => {
  const { checkAuthAndExecute } = useAuthCheck();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    checkAuthAndExecute(() => {
      // 如果认证通过，重新触发点击事件
      const target = e.target as HTMLElement;
      if (target.click) {
        target.click();
      }
    }, {
      showToast,
      toastMessage,
      toastDescription
    });
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

export default AuthGuard; 
