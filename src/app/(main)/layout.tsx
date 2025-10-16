import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="text-2xl font-bold">
          DietAI
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/chat">Chat</Link>
          <Link href="/cookbook">Cookbook</Link>
          <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Sign In
          </Link>
        </nav>
        <div className="md:hidden">
          {/* Mobile Menu Button will go here */}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t">
        <nav className="flex items-center justify-around p-2">
          <Link href="/chat">Chat</Link>
          <Link href="/cookbook">Cookbook</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </footer>
    </div>
  );
}
