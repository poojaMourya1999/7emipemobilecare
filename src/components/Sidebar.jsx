import { NavLink } from 'react-router-dom';
import { 
  X, 
  Home, 
  User, 
  RefreshCw, 
  ShoppingCart, 
  Wrench,
  LogOut,
  HelpCircle, // For problems
  CheckCircle, // For solutions
  List, // For all problems
  BookOpen, // For solutions browser
  Store,
  Package
} from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  // Common links for all users
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
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col p-4">
      {/* Top Header Section */}
      <div>
        {/* Header for Mobile */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-indigo-600">Problem Solver</h2>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Header for Desktop */}
        <div className="hidden lg:block mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Problem Solver</h2>
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
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
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
      <div className="mt-auto pt-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;