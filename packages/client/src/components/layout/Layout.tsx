import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 