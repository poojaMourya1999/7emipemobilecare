import React from "react";
import {
  FaStar,
  FaMobileAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaArrowLeft, // ✅ Import back arrow
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";

const PublicProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-center py-14 shadow-lg relative">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        <img
          src={logo}
          alt="7empire Mobile care"
          className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto"
        />
        <h1 className="text-3xl font-bold text-white mt-4">
          7 EMPIRE MOBILE CARE
        </h1>
        <p className="text-blue-100 mt-1 text-lg">
          Your Trusted Device Specialists
        </p>
      </div>

      {/* Rating & Stats */}
      <div className="grid grid-cols-3 gap-6 px-6 py-8 bg-white rounded-xl shadow-md mx-6 -mt-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <FaStar className="text-yellow-400 text-3xl mb-1" />
          <span className="text-gray-800 font-semibold">4.9</span>
          <span className="text-sm text-gray-500">(1.2k reviews)</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <FaMobileAlt className="text-blue-500 text-3xl mb-1" />
          <span className="text-gray-800 font-semibold">8.5k+</span>
          <span className="text-sm text-gray-500">devices fixed</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <FaShieldAlt className="text-green-500 text-3xl mb-1" />
          <span className="text-gray-800 font-semibold">6 months</span>
          <span className="text-sm text-gray-500">warranty</span>
        </div>
      </div>

      {/* Vision */}
      <div className="p-6 mx-6 mt-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Vision</h2>
        <p className="text-gray-600 leading-relaxed">
          To revolutionize mobile repair services by combining technical
          excellence with environmental responsibility. We aim to extend device
          lifespans through sustainable practices while delivering unmatched
          service quality.
        </p>
      </div>

      {/* Services */}
      <div className="p-6 mx-6 mt-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Screen Replacement (30 min)",
            "Battery Replacement (20 min)",
            "Water Damage Repair",
            "Software Issues & Updates",
            "Charging Port Repair",
            "Camera & Speaker Fixes",
          ].map((service, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
            >
              <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-6 mx-6">
        <button
          onClick={() => navigate("/signin")}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          Book Repair Now
        </button>
      </div>

      {/* Location */}
      <div className="p-6 mx-6 mb-8 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Visit Us</h2>

        <div className="flex row gap-10">
          {/* Location 1 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <FaMapMarkerAlt className="text-red-500 text-2xl mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-800">Address Service Center</h3>
              <p className="text-gray-600 text-sm">Slaiya Near to Kanal Kinship Colony</p>
              <p className="text-gray-600 text-sm">Open: Mon–Sat 9AM–7PM</p>
            </div>
          </div>

          {/* Location 2 */}
          <div className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <FaMapMarkerAlt className="text-red-500 text-2xl mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-800">Uptown Repair Hub</h3>
              <p className="text-gray-600 text-sm">Kolar in front of Narayana School</p>
              <p className="text-gray-600 text-sm">Open: Mon–Fri 10AM–6PM</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PublicProfile;
