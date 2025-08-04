import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import PageTransition from "./PageTransition";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 min-h-0 relative">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default Layout;
