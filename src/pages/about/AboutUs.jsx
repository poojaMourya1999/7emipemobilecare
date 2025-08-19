import React from "react";
import {
  FaExternalLinkAlt,
  FaStar,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.jpg'
import travel from '../../assets/travel.png'
import mobile from '../../assets/mobile.png'

const InfoCard = ({
  title = "Advanced Mobile Repair Techniques",
  description = "Learn professional-grade mobile repair skills with our comprehensive course covering the latest devices and repair methodologies.",
  platform = "Udemy",
  rating = 4.7,
  duration = "8 hours",
  isBookmarked = false,
  imageUrl = "https://images.unsplash.com/photo-1581093450021-4a7360e9a9d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  redirectUrl = "#",
  customClick,
}) => {
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);

  // Decide which click handler to use
  const handleClick = () => {
    if (typeof customClick === "function") {
      customClick();
    } else if (redirectUrl) {
      window.open(redirectUrl, "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
          <span className="text-indigo-600">{platform}</span>
          <FaExternalLinkAlt className="ml-1 text-indigo-400 text-xs" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>

          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className="text-gray-400 hover:text-yellow-500 transition"
          >
            {bookmarked ? (
              <FaBookmark className="text-yellow-400" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>

        <p className="text-gray-500 mt-2 text-sm line-clamp-3">
          {description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            <FaStar className="mr-1 text-yellow-400" />
            {rating}
          </div>
          <div className="flex items-center text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
            <FiClock className="mr-1" />
            {duration}
          </div>
          <div className="flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
            Certificate
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
      <InfoCard
        title="About Our Mission"
        description="Learn about our commitment to quality mobile repair services."
        platform="Our Vision"
        rating={4.9}
        duration="5 years"
        customClick={() => navigate("/about-us")}
        imageUrl={logo}
      />
      <InfoCard
        title="Mobile Repairing Videos"
        description="Watch our professional repair tutorials on YouTube."
        platform="YouTube"
        rating={4.5}
        duration="50+ videos"
        isBookmarked={true}
        imageUrl={mobile}
        redirectUrl="https://www.youtube.com/@7empireMobilecare"
      />
      <InfoCard
        title="Explore Natural Wonders"
        description="Discover breathtaking natural places we've visited and documented."
        platform="Google Travel Blog"
        rating={4.9}
        duration="10+ locations"
        imageUrl={travel}
        redirectUrl="https://worldthroughone.blogspot.com/"
      />
    </div>
  );
};

export default AboutUs;
