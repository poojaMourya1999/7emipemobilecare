import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { DASHBOARD } from '../services/apiUrl';
import { useNavigate } from 'react-router-dom';
import {
  FiTool,
  FiShoppingCart,
  FiUsers,
  FiHelpCircle,
  FiCheckCircle,
  FiActivity,
  FiTrendingUp,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
  FiRepeat
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AiFillCheckCircle } from 'react-icons/ai';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalTools: 0,
    userTools: 0,
    cartTools: 0,
    userCount: 0,
    problemCount: 0,
    solutionCount: 0
  });

  // Sample recent activities - replace with real data
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'solution',
      title: 'You submitted a solution to "Login System Bug"',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'problem',
      title: 'Your problem "API Integration" got a new solution',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'tool',
      title: 'Your tool "React Component Library" got 5 new views',
      time: '2 days ago',
      read: true
    }
  ]);

  const stats = [
    {
      title: 'Products',
      value: data?.userTools || 0,
      icon: <FiPackage className="text-xl" />,  // Appropriate for tools
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-l-4 border-blue-500',
      hover: 'hover:shadow-blue-100',
      clickFunction: () => navigate('/users-tools')
    },
    {
      title: 'Cart Items',
      value: data?.cartTools || 0,
      icon: <FiShoppingCart className="text-xl" />,  // Perfect for cart
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-l-4 border-green-500',
      hover: 'hover:shadow-green-100',
      clickFunction: () => navigate('/cart')
    },
    {
      title: 'Problems',
      value: data?.problemCount || 0,
      icon: <FiAlertCircle className="text-xl" />,  // Better for problems (using AlertCircle instead of HelpCircle)
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      border: 'border-l-4 border-gray-500',
      hover: 'hover:shadow-gray-100',
      clickFunction: () => navigate('/my-problems')
    },
    {
      title: 'Solutions',
      value: data?.solutionCount || 0,
      icon: <AiFillCheckCircle className="text-xl" />,  // Good for solutions
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      border: 'border-l-4 border-yellow-500',
      hover: 'hover:shadow-yellow-100',
      clickFunction: () => navigate('/solutions')
    },
    {
      title: 'Exchanges',
      value: data?.exchangeTools || 0,
      icon: <FiRepeat className="text-xl" />,  // Using Repeat icon for exchanges
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-l-4 border-purple-500',
      hover: 'hover:shadow-purple-100',
      clickFunction: () => navigate('/exchange')
    },
    {
      title: 'Marketplace',
      value: data?.totalTools || 0,
      icon: <FiShoppingBag className="text-xl" />,  // ShoppingBag better represents marketplace
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
      border: 'border-l-4 border-pink-500',
      hover: 'hover:shadow-pink-100',
      clickFunction: () => navigate('/others-tools')
    }
  ];

  const handleDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService({
        endpoint: DASHBOARD,
        method: 'GET',
      });
      setData(res?.stats || {});
      // Simulate loading for demo purposes
      setTimeout(() => setLoading(false), 800);
    } catch (error) {
      console.log('dashboard error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDashboard();
  }, []);

  const markAsRead = (id) => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, read: true } : activity
    ));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-gray-800"
        >
          Dashboard Overview
        </motion.h2>
        <button
          onClick={handleDashboard}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <FiRefreshCw className="mr-1" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            onClick={stat.clickFunction}
            className={`rounded-lg p-4 transition cursor-pointer ${stat.bg} ${stat.border} shadow-sm hover:shadow-md ${stat.hover} hover:translate-y-[-2px]`}
          >
            {loading ? (
              <Skeleton count={2} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-full ${stat.bg} shadow-inner`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wider">{stat.title}</h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="text-xs text-gray-500 flex items-center">
                    <FiTrendingUp className="mr-1" /> 0% today
                  </span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiActivity className="mr-2 text-blue-500" /> Recent Activity
          </h3>
          <button
            className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center"
            onClick={() => navigate('/activity')}
          >
            View All <FiArrowRight className="ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} height={60} />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <motion.li
                key={activity.id}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                className={`p-4 cursor-pointer transition ${!activity.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(activity.id)}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${activity.type === 'solution' ? 'bg-green-100 text-green-600' :
                      activity.type === 'problem' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {activity.type === 'solution' ? <FiCheckCircle /> :
                      activity.type === 'problem' ? <FiAlertCircle /> : <FiTool />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <FiClock className="mr-1" /> {activity.time}
                    </p>
                  </div>
                  {!activity.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <FiActivity className="mx-auto text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">No recent activities found</p>
            <button
              onClick={() => navigate('/problems/new')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 transition"
            >
              Post your first problem to get started
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          onClick={() => navigate('/problems/new')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-semibold mb-1">Post a Problem</h3>
          <p className="text-sm opacity-90">Need help with something?</p>
        </div>
        <div
          onClick={() => navigate('/allTools')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-semibold mb-1">Browse Marketplace</h3>
          <p className="text-sm opacity-90">Find tools and solutions</p>
        </div>
        <div
          onClick={() => navigate('/problems')}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-semibold mb-1">Solve Problems</h3>
          <p className="text-sm opacity-90">Earn rewards by helping others</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;