import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/conversations/[id]
 * 获取单个对话及其所有消息
 * 需要用户登录，且只能访问自己的对话
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId, // 确保只能访问自己的对话
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            recipe: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error(`[GET /api/conversations/${(await context.params).id}] Error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations/[id]
 * 删除对话及其所有消息
 * 需要用户登录，且只能删除自己的对话
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // 首先验证对话是否属于当前用户
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Prisma 的 onDelete: Cascade 会自动删除关联的 messages
    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /api/conversations/${(await context.params).id}] Error:`, error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversations/[id]
 * 更新对话信息（如标题）
 * 需要用户登录，且只能更新自己的对话
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 首先验证对话是否属于当前用户
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error(`[PATCH /api/conversations/${(await context.params).id}] Error:`, error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}

