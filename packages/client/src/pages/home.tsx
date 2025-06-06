import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import { ChatPage } from "./chat";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HomePage() {
  return (
    <div className="flex h-screen">
      {/* 侧边抽屉 */}
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 focus-visible:ring-0"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-64 fixed left-0 top-0 bottom-0 right-auto translate-x-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <DrawerHeader className="relative">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 focus-visible:ring-0"
              >
                <ChevronsLeft className="h-5 w-5" />
              </Button>
            </DrawerClose>
            <DrawerTitle>功能菜单</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start focus-visible:ring-0"
                onClick={() => {
                  // TODO: 跳转到收藏的菜谱页面
                }}
              >
                收藏的菜谱
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start focus-visible:ring-0"
                onClick={() => {
                  // TODO: 跳转到周计划页面
                }}
              >
                周计划
              </Button>
            </nav>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-auto p-4">
        <ChatPage />
      </main>
    </div>
  );
}
 