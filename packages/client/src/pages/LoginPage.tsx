import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MutedText } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { Link } from "@tanstack/react-router";
import { validateFormData } from "@/utils/validation";

const LoginPage = () => {
  const authNavigate = useAuthNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, enableGuest, isLoading, clearError } = useAuth();

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateFormData(formData);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.username, formData.password);
      authNavigate({ to: "/" });
    } catch (error) {
      console.error("登录失败，请重试", error);
    }
  };

  const handleGuestMode = () => {
    enableGuest();
    authNavigate({ to: "/" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">登录账号</CardTitle>
            <CardDescription className="text-center">
              请输入您的用户名和密码
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="用户名"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className={cn("pl-10", errors.username && "border-red-500")}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <MutedText className="text-red-500 text-sm mt-1">
                    {errors.username}
                  </MutedText>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="密码"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={cn("pl-10", errors.password && "border-red-500")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <MutedText className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </MutedText>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                登录
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    或者
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGuestMode}
                  disabled={isLoading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  游客模式
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm"
                    asChild
                    disabled={isLoading}
                  >
                    <Link to="/register">没有账号？点击注册</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
