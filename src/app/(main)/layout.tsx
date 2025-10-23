import Link from "next/link";
import { MessageSquare, Book, User } from "lucide-react";
import { UserButton } from "@/components/user-button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <Link href="/" className="text-2xl font-bold">
          DietAI
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/chat">Chat</Link>
          <Link href="/cookbook">Cookbook</Link>
          <UserButton />
        </nav>
        <div className="md:hidden">
          {/* Mobile Menu Button will go here */}
        </div>
      </header>

      <main className="flex flex-1 flex-col pb-16 md:pb-0">{children}</main>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <nav className="flex items-center justify-around p-2">
          <Link href="/chat" className="flex flex-col items-center gap-1">
            <MessageSquare size={20} />
            <span className="text-xs">Chat</span>
          </Link>
          <Link href="/cookbook" className="flex flex-col items-center gap-1">
            <Book size={20} />
            <span className="text-xs">Cookbook</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1">
            <User size={20} />
            <span className="text-xs">Me</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
