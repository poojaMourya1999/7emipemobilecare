import { useNavigate } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import { useEffect, useState } from "react";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
 
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
      <h1 className="text-xl font-bold text-gray-800">My App</h1>
      <p className="text-right" onClick={()=>navigate('/notification')}>
        <IoMdNotifications />
      </p>
    </header>
  );
};

export default Header;
