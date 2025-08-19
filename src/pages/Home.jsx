import React from "react";
import { Link } from "react-router-dom";
import AllTools from "./tools/AllTools";
import Problems from "./problem/Problems";
import AboutUs from "./about/AboutUs";

const Home = () => {
  const home = "home";
  const [renderSection, setRenderSection] = React.useState("tools");

  // Darker gradient themes for better contrast
  const cards = [
    {
      key: "tools",
      title: "Marketplace",
      desc: "Add your Tools, Products and reach users looking to buy or exchange.",
      color: "from-indigo-700 via-violet-800 to-pink-900",
    },
    {
      key: "problems",
      title: "Repairing Problems",
      desc: "Browse tools from other users and filter what you need.",
      color: "from-indigo-700 via-teal-800 to-yellow-900",
    },
    {
      key: "about",
      title: "About Us",
      desc: "Send requests to exchange tools safely and easily.",
      color: "from-indigo-700 via-cyan-800 to-green-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-12 py-10 relative">
      {/* Signup Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Link
          to="/signup"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-700 to-purple-800 
                     text-white rounded-xl shadow-lg hover:shadow-xl 
                     hover:scale-105 transform transition font-semibold text-sm sm:text-base"
        >
          Sign Up
        </Link>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-12 mt-5 sm:mb-16 px-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-700 to-pink-700 bg-clip-text text-transparent">
            7 EMPIRE MOBILE CARE
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          A modern platform to list your mobile repairing problems, buy, or
          exchange tools & products with the community.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {cards.map((card) => {
          const isActive = renderSection === card.key;
          return (
            <div
              key={card.key}
              onClick={() => setRenderSection(card.key)}
              className={`relative p-5 sm:p-6 rounded-2xl shadow-lg cursor-pointer 
                          transition-transform transform hover:scale-105
                ${
                  isActive
                    ? `bg-gradient-to-r ${card.color} text-white`
                    : "bg-white text-gray-800 hover:shadow-xl"
                }`}
            >
              <h2
                className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
                  isActive ? "text-white" : "text-gray-800"
                }`}
              >
                {card.title}
              </h2>
              <p
                className={`text-sm sm:text-base ${
                  isActive ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {card.desc}
              </p>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/80 rounded-t-2xl"></div>
              )}
            </div>
          );
        })}
      </section>

      {/* Render Section */}
      <div className="mt-10 sm:mt-12">
        {renderSection === "tools" && <AllTools context={home} />}
        {renderSection === "problems" && <Problems context={home} />}
        {renderSection === "about" && <AboutUs />}
      </div>
    </div>
  );
};

export default Home;
