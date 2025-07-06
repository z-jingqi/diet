import React, { useState, useEffect } from "react";
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
import {
  Loader2,
  User,
  Lock,
  UserPlus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthNavigate } from "@/hooks/useAuthNavigate";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";
import { Link } from "@tanstack/react-router";
import { validateFormData, USERNAME_RULES } from "@/utils/validation";

const RegisterPage = () => {
  const authNavigate = useAuthNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, enableGuest, isLoading, clearError } = useAuth();
  const {
    validateUsername: validateUsernameAsync,
    resetValidation,
    isValidating,
    isAvailable,
    error: validationError,
  } = useUsernameValidation();

  // 当用户名变化时进行异步校验
  useEffect(() => {
    if (formData.username.trim()) {
      validateUsernameAsync(formData.username);
    } else {
      resetValidation();
    }
  }, [formData.username, validateUsernameAsync, resetValidation]);

  const validateForm = () => {
    const { errors: newErrors, isValid } = validateFormData(
      formData,
      isAvailable
    );
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
      await register(formData.username, formData.password);
      authNavigate({ to: "/" });
    } catch (error) {
      console.error("注册失败，请重试", error);
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

  // 渲染用户名输入框的右侧图标
  const renderUsernameIcon = () => {
    if (isValidating) {
      return (
        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
      );
    }

    if (
      formData.username.length >= USERNAME_RULES.minLength &&
      formData.username.length <= USERNAME_RULES.maxLength
    ) {
      if (isAvailable === true) {
        return (
          <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
        );
      } else if (isAvailable === false) {
        return (
          <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
        );
      }
    }

    return null;
  };

  // 渲染用户名验证状态文本
  const renderUsernameStatus = () => {
    if (validationError) {
      return (
        <MutedText className="text-red-500 text-sm mt-1">
          {validationError}
        </MutedText>
      );
    }

    if (
      formData.username.length >= USERNAME_RULES.minLength &&
      formData.username.length <= USERNAME_RULES.maxLength
    ) {
      if (isAvailable === true) {
        return (
          <MutedText className="text-green-600 text-sm mt-1">
            用户名可用
          </MutedText>
        );
      } else if (isAvailable === false) {
        return (
          <MutedText className="text-red-500 text-sm mt-1">
            用户名已被使用
          </MutedText>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">创建账号</CardTitle>
            <CardDescription className="text-center">
              请填写用户名和密码创建账号
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
                  {renderUsernameIcon()}
                </div>
                {errors.username && (
                  <MutedText className="text-red-500 text-sm mt-1">
                    {errors.username}
                  </MutedText>
                )}
                {renderUsernameStatus()}
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isValidating || isAvailable === false}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                注册
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
                    <Link to="/login">已有账号？点击登录</Link>
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

export default RegisterPage;
