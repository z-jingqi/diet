"use client";

import { useState } from "react";
import type { ChatHistoryItem, ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";
import "@/styles/chat.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { RecipePanel } from "@/components/chat/recipe-panel";

const historyItems: ChatHistoryItem[] = [
  {
    id: "1",
    conversationId: "1",
    title: "Stir Fry Night",
    preview: "Chicken • Broccoli • Soy sauce",
  },
  {
    id: "2",
    conversationId: "2",
    title: "Vegan Power Bowl",
    preview: "Quinoa • Chickpeas • Kale",
  },
  {
    id: "3",
    conversationId: "3",
    title: "15-min Pasta",
    preview: "Penne • Tomato • Basil",
  },
];

export default function ChatPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);

  const closeRecipe = () => setSelectedRecipe(undefined);

  return (
    <div className="chat-layout flex h-full min-h-0 flex-1 overflow-hidden">
      <ChatSidebar historyItems={historyItems} />

      <ResizablePanelGroup direction="horizontal" className="flex h-full flex-1 min-h-0">
        <ResizablePanel defaultSize={selectedRecipe ? 60 : 100} minSize={45} className="flex h-full min-h-0">
          <div className="flex h-full min-h-0 w-full flex-1">
            <ChatInterface onRecipeSelect={setSelectedRecipe} />
          </div>
        </ResizablePanel>

        {selectedRecipe ? (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={25} maxSize={50} className="flex h-full min-h-0">
              <RecipePanel recipe={selectedRecipe} onClose={closeRecipe} />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </div>
  );}
