import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { UIMessage } from "ai";
import type { Prisma } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/conversations/[id]/messages
 * 保存消息到对话中
 * 支持保存单条或多条消息
 * 需要用户登录，且只能向自己的对话添加消息
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await context.params;
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // 验证对话是否存在且属于当前用户
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 批量创建消息
    const createdMessages = await prisma.$transaction(
      messages.map((message: UIMessage) =>
        prisma.message.create({
          data: {
            id: message.id,
            role: message.role,
            parts: message.parts as Prisma.JsonArray,
            metadata: (message.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
            conversationId,
          },
        })
      )
    );

    // 更新对话的 updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ messages: createdMessages }, { status: 201 });
  } catch (error) {
    console.error(
      `[POST /api/conversations/${(await context.params).id}/messages] Error:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to save messages" },
      { status: 500 }
    );
  }
}

