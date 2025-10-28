import { useState, useEffect, useCallback } from "react";
import type { UIMessage } from "ai";
import type { Message as PrismaMessage } from "@prisma/client";

type ConversationWithMessages = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  messages: (PrismaMessage & { recipe?: { id: string } | null })[];
  _count: {
    messages: number;
  };
};

type ConversationListItem = Omit<ConversationWithMessages, "messages"> & {
  messages: PrismaMessage[];
};

/**
 * Hook for managing multiple conversations
 */
export function useConversations() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data.conversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(
    async (title: string) => {
      try {
        setError(null);
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }

        const data = await response.json();
        await fetchConversations(); // Refresh list
        return data.conversation;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error creating conversation:", err);
        throw err;
      }
    },
    [fetchConversations]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const response = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete conversation");
        }

        await fetchConversations(); // Refresh list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error deleting conversation:", err);
        throw err;
      }
    },
    [fetchConversations]
  );

  const updateConversationTitle = useCallback(
    async (id: string, title: string) => {
      try {
        setError(null);
        const response = await fetch(`/api/conversations/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        if (!response.ok) {
          throw new Error("Failed to update conversation");
        }

        await fetchConversations(); // Refresh list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error updating conversation:", err);
        throw err;
      }
    },
    [fetchConversations]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    deleteConversation,
    updateConversationTitle,
  };
}

/**
 * Hook for managing a single conversation
 */
export function useConversation(conversationId: string | null) {
  const [conversation, setConversation] = useState<ConversationWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/conversations/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }

      const data = await response.json();
      setConversation(data.conversation);
      return data.conversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching conversation:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMessages = useCallback(async (id: string, messages: UIMessage[]) => {
    try {
      setError(null);
      const response = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to save messages");
      }

      const data = await response.json();
      return data.messages;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error saving messages:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
    } else {
      setConversation(null);
    }
  }, [conversationId, fetchConversation]);

  return {
    conversation,
    isLoading,
    error,
    fetchConversation,
    saveMessages,
  };
}

