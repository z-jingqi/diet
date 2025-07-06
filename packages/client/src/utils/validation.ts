// 用户名验证规则
export const USERNAME_RULES = {
  minLength: 3,
  maxLength: 20,
  required: true,
} as const;

// 密码验证规则
export const PASSWORD_RULES = {
  minLength: 6,
  required: true,
} as const;

// 验证用户名
export const validateUsername = (
  username: string,
  isAvailable?: boolean | null
): string | null => {
  if (!username.trim()) {
    return "用户名不能为空";
  }
  if (username.length < USERNAME_RULES.minLength) {
    return `用户名长度至少${USERNAME_RULES.minLength}个字符`;
  }
  if (username.length > USERNAME_RULES.maxLength) {
    return `用户名长度不能超过${USERNAME_RULES.maxLength}个字符`;
  }
  if (isAvailable === false) {
    return "用户名已被使用";
  }
  return null;
};

// 验证密码
export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return "密码不能为空";
  }
  if (password.length < PASSWORD_RULES.minLength) {
    return `密码长度至少${PASSWORD_RULES.minLength}位`;
  }
  return null;
};

// 验证表单数据
export const validateFormData = (
  formData: { username: string; password: string },
  isAvailable?: boolean | null
) => {
  const errors: Record<string, string> = {};

  // 验证用户名
  const usernameError = validateUsername(formData.username, isAvailable);
  if (usernameError) {
    errors.username = usernameError;
  }

  // 验证密码
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
