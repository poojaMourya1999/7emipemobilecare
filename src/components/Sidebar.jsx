import { NavLink } from 'react-router-dom';
import {
  X,
  Home,
  User,
  RefreshCw,
  ShoppingCart,
  Wrench,
  LogOut,
  HelpCircle,
  CheckCircle,
  List,
  BookOpen,
  Store,
  Package,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ closeSidebar, isMobile }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Others Problems', path: '/others-problems', icon: <List className="w-5 h-5" /> },
    { name: 'My Problems', path: '/my-problems', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'Solutions by me', path: '/solutions', icon: <CheckCircle className="w-5 h-5" /> },
    { name: 'Marketplace', path: '/others-tools', icon: <Store className="w-5 h-5" /> },
    { name: 'My Products', path: '/users-tools', icon: <Package className="w-5 h-5" /> },
    { name: 'Exchange', path: '/exchange', icon: <RefreshCw className="w-5 h-5" /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/';
  };

  const organization = localStorage.getItem('organization') || 'Problem Solver';

  return (
    <>
      <motion.aside 
        className="h-screen w-64 bg-white shadow-lg flex flex-col fixed lg:relative z-50"
        initial={isMobile ? { x: -300 } : false}
        animate={{ x: 0 }}
        exit={isMobile ? { x: -300 } : false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Top Header Section */}
          <div>
            {/* Header for Mobile */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-indigo-600">{organization}</h2>
              <button 
                onClick={closeSidebar}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Header for Desktop */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold text-indigo-600 bg-gradient-to-r from-indigo-700 to-pink-700 bg-clip-text text-transparent">
                {organization}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Collaborative problem solving</p>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout Button at Bottom */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {isMobile && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;