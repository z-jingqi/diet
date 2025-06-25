import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography, MutedText } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/auth-store";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";

const LoginPage = () => {
  const authNavigate = useAuthNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, enableGuest, isLoading, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名长度至少3个字符";
    } else if (formData.username.length > 20) {
      newErrors.username = "用户名长度不能超过20个字符";
    }

    if (!formData.password.trim()) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度至少6位";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register(formData.username, formData.password);
      }
      authNavigate({ to: "/" });
    } catch (error) {
      console.error("操作失败，请重试", error);
    }
  };

  const handleGuestMode = () => {
    enableGuest();
    authNavigate({ to: "/" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Typography variant="h2" className="text-gray-900">
            {isLogin ? "登录" : "注册"}
          </Typography>
          <MutedText className="mt-2">
            {isLogin ? "欢迎回来，请登录您的账号" : "创建新账号开始使用"}
          </MutedText>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "登录账号" : "创建账号"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "请输入您的用户名和密码" : "请填写用户名和密码创建账号"}
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
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={cn("pl-10", errors.username && "border-red-500")}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <MutedText className="text-red-500 text-sm mt-1">{errors.username}</MutedText>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="密码"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn("pl-10", errors.password && "border-red-500")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <MutedText className="text-red-500 text-sm mt-1">{errors.password}</MutedText>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "登录" : "注册"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">或者</span>
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
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        username: "",
                        password: "",
                      });
                      setErrors({});
                      clearError();
                    }}
                    disabled={isLoading}
                  >
                    {isLogin ? "没有账号？点击注册" : "已有账号？点击登录"}
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
