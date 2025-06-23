import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography, MutedText } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, Mail, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/auth-store";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";

const LoginPage = () => {
  const authNavigate = useAuthNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, enableGuest, isLoading, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = "邮箱不能为空";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "邮箱格式不正确";
      }

      if (!formData.nickname.trim()) {
        newErrors.nickname = "昵称不能为空";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "两次输入的密码不一致";
      }
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
        await register(formData.username, formData.email, formData.password, formData.nickname);
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
              {isLogin ? "请输入您的用户名和密码" : "请填写以下信息创建账号"}
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

              {!isLogin && (
                <>
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="邮箱"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={cn("pl-10", errors.email && "border-red-500")}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <MutedText className="text-red-500 text-sm mt-1">{errors.email}</MutedText>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      placeholder="昵称"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                      className={cn(errors.nickname && "border-red-500")}
                      disabled={isLoading}
                    />
                    {errors.nickname && (
                      <MutedText className="text-red-500 text-sm mt-1">{errors.nickname}</MutedText>
                    )}
                  </div>
                </>
              )}

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

              {!isLogin && (
                <div>
                  <Input
                    type="password"
                    placeholder="确认密码"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={cn(errors.confirmPassword && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <MutedText className="text-red-500 text-sm mt-1">{errors.confirmPassword}</MutedText>
                  )}
                </div>
              )}

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
                        email: "",
                        password: "",
                        confirmPassword: "",
                        nickname: "",
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
