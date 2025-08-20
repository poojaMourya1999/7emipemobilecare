import { useNavigate } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import { useState, useEffect } from "react";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
    
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user name from storage or context
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <header className="bg-white shadow h-16 flex items-center px-4 justify-between">
      <button className="lg:hidden" onClick={toggleSidebar}>
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      
      <h1 className="text-xl font-bold text-gray-800">
        {greeting}, <span className="bg-gradient-to-r from-indigo-700 to-pink-700 bg-clip-text text-transparent">{userName}!</span>
      </h1>
      
      <button 
        onClick={() => navigate('/notification')}
        className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
      >
        <IoMdNotifications className="text-xl" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          
        </span>
      </button>
    </header>
  );
};

export default Header;