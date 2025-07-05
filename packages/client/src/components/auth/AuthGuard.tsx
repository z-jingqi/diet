import React, { useEffect } from "react";
import useAuthStore from "@/store/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // No need to call checkAuth() here since it's already being called in App.tsx

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to continue.</div>;
  }

  return <>{children}</>;
};

export default AuthGuard; 
