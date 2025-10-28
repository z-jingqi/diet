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
import { ConversationList } from "@/components/chat/conversation-list";
import { RecipePanel } from "@/components/chat/recipe-panel";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const closeRecipe = () => setSelectedRecipe(undefined);

  return (
    <div className="chat-layout flex h-full min-h-0 flex-1 overflow-hidden">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-20 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Conversation List Sidebar - Hidden on mobile by default */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "top-16" // offset for navbar
        )}
      >
        <ConversationList
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setIsSidebarOpen(false); // Close sidebar on mobile after selection
          }}
        />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area with resizable panels */}
      <ResizablePanelGroup direction="horizontal" className="flex flex-1">
        <ResizablePanel
          defaultSize={selectedRecipe && !isMobile ? 60 : 100}
          minSize={45}
          className="flex"
        >
          <div className="flex w-full flex-1">
            <ChatInterface
              conversationId={activeConversationId}
              onRecipeSelect={setSelectedRecipe}
            />
          </div>
        </ResizablePanel>

        {/* Recipe Panel - Only show on desktop when recipe is selected */}
        {selectedRecipe && !isMobile ? (
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
