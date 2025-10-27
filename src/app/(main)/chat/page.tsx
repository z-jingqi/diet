"use client";

import { useState } from "react";
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
import { mockChatHistory } from "@/mocks/chat";

export default function ChatPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);

  const closeRecipe = () => setSelectedRecipe(undefined);

  const handleCreateChat = () => {
    // TODO: implement create chat flow
    console.log("Create new chat");
  };

  const handleSelectConversation = (conversationId: string) => {
    // TODO: implement conversation switch logic
    console.log("Switch to conversation", conversationId);
  };

  return (
    <div className="chat-layout flex h-full min-h-0 flex-1 overflow-hidden">
      <ChatSidebar
        historyItems={mockChatHistory}
        onCreateChat={handleCreateChat}
        onSelectConversation={handleSelectConversation}
      />

      <ResizablePanelGroup direction="horizontal" className="flex flex-1">
        <ResizablePanel
          defaultSize={selectedRecipe ? 60 : 100}
          minSize={45}
          className="flex"
        >
          <div className="flex w-full flex-1">
            <ChatInterface onRecipeSelect={setSelectedRecipe} />
          </div>
        </ResizablePanel>

        {selectedRecipe ? (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={40}
              minSize={25}
              maxSize={50}
              className="flex"
            >
              <RecipePanel recipe={selectedRecipe} onClose={closeRecipe} />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </div>
  );
}
