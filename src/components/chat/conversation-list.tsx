"use client";

import { useState } from "react";
import { Plus, Loader2, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationListItem } from "./conversation-list-item";
import { useConversations } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";
import { prismaMessageToUIMessage } from "@/lib/db/message-converter";

type ConversationListProps = {
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  className?: string;
};

export function ConversationList({
  activeConversationId,
  onSelectConversation,
  className,
}: ConversationListProps) {
  const { status: sessionStatus } = useSession();
  const isAuthenticated = sessionStatus === "authenticated";

  const {
    conversations,
    isLoading,
    error,
    createConversation,
    deleteConversation,
  } = useConversations();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      setIsCreating(true);
      const conversation = await createConversation(newTitle.trim());
      setNewTitle("");
      onSelectConversation(conversation.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个对话吗？")) return;

    try {
      await deleteConversation(id);
      if (activeConversationId === id) {
        // 如果删除的是当前对话，跳转到第一个对话或创建新对话
        if (conversations.length > 1) {
          const nextConversation = conversations.find((c) => c.id !== id);
          if (nextConversation) {
            onSelectConversation(nextConversation.id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <div className={cn("flex h-full flex-col bg-muted/30", className)}>
      <div className="border-b p-4">
        <h2 className="mb-3 text-lg font-semibold">对话历史</h2>

        {!isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              登录后可以保存对话历史
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/login")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              登录
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="新对话标题..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              disabled={isCreating}
            />
            <Button
              size="icon"
              onClick={handleCreate}
              disabled={isCreating || !newTitle.trim()}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="sr-only">创建新对话</span>
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {!isAuthenticated ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <p className="mb-2">未登录时，对话不会保存</p>
              <p>刷新页面后对话将丢失</p>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {!isLoading && !error && conversations.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  还没有对话，创建一个开始吧！
                </div>
              )}

              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  id={conversation.id}
                  title={conversation.title}
                  lastMessage={
                    conversation.messages[0]
                      ? prismaMessageToUIMessage(conversation.messages[0])
                      : undefined
                  }
                  updatedAt={conversation.updatedAt}
                  messageCount={conversation._count.messages}
                  isActive={conversation.id === activeConversationId}
                  onSelect={() => onSelectConversation(conversation.id)}
                  onDelete={() => handleDelete(conversation.id)}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

