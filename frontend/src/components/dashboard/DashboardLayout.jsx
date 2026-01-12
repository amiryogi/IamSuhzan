import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiPhotograph,
  HiTag,
  HiUpload,
  HiCog,
  HiLogout,
  HiMenuAlt2,
  HiX,
  HiChartBar,
  HiTemplate,
  HiStar,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/dashboard", icon: <HiChartBar />, label: "Overview" },
    { path: "/dashboard/artworks", icon: <HiPhotograph />, label: "Artworks" },
    {
      path: "/dashboard/hero-slides",
      icon: <HiTemplate />,
      label: "Hero Slides",
    },
    { path: "/dashboard/awards", icon: <HiStar />, label: "Awards" },
    { path: "/dashboard/categories", icon: <HiTag />, label: "Categories" },
    { path: "/dashboard/upload", icon: <HiUpload />, label: "Upload" },
    { path: "/dashboard/settings", icon: <HiCog />, label: "Settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-dark/80 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-dark-100 
                   border-r border-dark-300 z-50 transform transition-transform 
                   duration-300 lg:transform-none ${
                     isOpen
                       ? "translate-x-0"
                       : "-translate-x-full lg:translate-x-0"
                   }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-300">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-semibold text-gradient">
                SUJAN
              </span>
            </Link>
            <p className="text-xs text-dark-400 mt-1">Admin Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl 
                             transition-all ${
                               location.pathname === item.path
                                 ? "bg-primary text-dark"
                                 : "text-light-300 hover:bg-dark-200 hover:text-light"
                             }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-dark-300">
            <div className="flex items-center gap-3 mb-4 p-3 bg-dark-200 rounded-xl">
              <div
                className="w-10 h-10 rounded-full bg-primary flex items-center 
                           justify-center text-dark font-semibold"
              >
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-light truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-dark-400 truncate">
                  {user?.email || "admin@artportfolio.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                       text-light-300 hover:bg-error/10 hover:text-error transition-colors"
            >
              <HiLogout className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 bg-dark-100 border-b border-dark-300 flex items-center 
                        justify-between px-6"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-light-300 hover:text-light"
          >
            <HiMenuAlt2 size={24} />
          </button>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-light-300 hover:text-primary transition-colors"
            >
              View Portfolio →
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
