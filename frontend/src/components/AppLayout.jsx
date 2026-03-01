import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

const AppLayout = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/70 backdrop-blur">
      <NavBar />
    </header>

    <main className="px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
