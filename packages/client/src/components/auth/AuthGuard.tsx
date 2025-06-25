import React, { useEffect } from "react";
import { useAuthState } from "@/lib/gql/hooks/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthState();

  useEffect(() => {
    // 检查认证状态
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to continue.</div>;
  }

  return <>{children}</>;
};

export default AuthGuard; 
