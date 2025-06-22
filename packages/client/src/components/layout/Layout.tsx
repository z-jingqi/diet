import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Layout; 