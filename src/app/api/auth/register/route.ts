import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(20, "用户名最多20个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  password: z
    .string()
    .min(6, "密码至少6个字符")
    .max(100, "密码最多100个字符"),
  name: z.string().min(1, "姓名不能为空").max(50, "姓名最多50个字符"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 验证输入
    const validatedData = registerSchema.parse(body);

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "用户名已存在" },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        password: hashedPassword,
        name: validatedData.name,
      },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    return NextResponse.json(
      { message: "注册成功", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "验证失败" },
        { status: 400 }
      );
    }

    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}

