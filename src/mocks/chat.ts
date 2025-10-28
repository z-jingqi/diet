import type { ChatHistoryItem, ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";

const mockRecipe: Recipe = {
  id: "recipe-1",
  title: "Chicken & Broccoli Stir Fry",
  description: "A 20-minute stir fry with a savory soy-garlic sauce and crunchy vegetables.",
  ingredients: [
    { name: "Chicken breast", amount: 2, unit: "pcs" },
    { name: "Broccoli florets", amount: 2, unit: "cups" },
    { name: "Soy sauce", amount: 2, unit: "tbsp" },
    { name: "Sesame oil", amount: 1, unit: "tbsp" },
    { name: "Garlic", amount: 2, unit: "cloves", notes: "minced" },
    { name: "Ginger", amount: 1, unit: "tsp", notes: "grated" },
  ],
  steps: [
    {
      order: 1,
      instruction: "Heat sesame oil in a wok and sauté garlic and ginger until fragrant.",
      durationMinutes: 2,
      tools: ["wok", "spatula"],
    },
    {
      order: 2,
      instruction: "Add sliced chicken and cook until golden brown.",
      durationMinutes: 5,
    },
    {
      order: 3,
      instruction: "Toss in broccoli and stir-fry for 3-4 minutes.",
    },
    {
      order: 4,
      instruction: "Pour in soy sauce, toss, and cook for 2 more minutes.",
    },
    {
      order: 5,
      instruction: "Serve hot over steamed rice or noodles.",
    },
  ],
  difficulty: "easy",
  servings: 2,
  prepTimeMinutes: 10,
  cookTimeMinutes: 10,
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: "assistant-1",
    conversationId: "conversation-1",
    role: "assistant",
    parts: [{ type: "text", text: "Hello! What ingredients do you have today?" }],
    createdAt: new Date("2025-01-01T10:00:00Z"),
  },
  {
    id: "user-1",
    conversationId: "conversation-1",
    role: "user",
    parts: [
      {
        type: "text",
        text: "I have some chicken breast, broccoli, and soy sauce.",
      },
    ],
    createdAt: new Date("2025-01-01T10:00:15Z"),
    metadata: { intent: "generate_recipe" },
  },
  {
    id: "assistant-2",
    conversationId: "conversation-1",
    role: "assistant",
    parts: [
      { type: "text", text: "Great! Here's a quick stir-fry recipe you can try." },
    ],
    recipeId: "recipe-1",
    recipe: mockRecipe,
    createdAt: new Date("2025-01-01T10:00:20Z"),
    metadata: { hasRecipe: true },
  },
];

export const mockChatHistory: ChatHistoryItem[] = [
  {
    id: "conversation-1",
    conversationId: "conversation-1",
    title: "Stir Fry Night",
    preview: "Great! Here's a quick stir-fry recipe you can try.",
    lastMessageAt: new Date("2025-01-01T10:00:20Z"),
    tags: ["chicken", "quick"],
  },
  {
    id: "conversation-2",
    conversationId: "conversation-2",
    title: "Vegan Power Bowl",
    preview: "A protein-packed vegan idea with quinoa and chickpeas.",
    lastMessageAt: new Date("2025-01-02T08:12:00Z"),
    tags: ["vegan"],
  },
  {
    id: "conversation-3",
    conversationId: "conversation-3",
    title: "15-min Pasta",
    preview: "Simple tomato basil pasta ready in 15 minutes.",
    lastMessageAt: new Date("2025-01-03T19:45:00Z"),
    tags: ["pasta", "quick"],
  },
];
