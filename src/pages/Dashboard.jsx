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

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

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
      icon: <FiPackage className="text-xl" />,
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-l-4 border-blue-500',
      hover: 'hover:shadow-blue-100',
      clickFunction: () => navigate('/users-tools')
    },
    {
      title: 'Cart Items',
      value: data?.cartTools || 0,
      icon: <FiShoppingCart className="text-xl" />,
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-l-4 border-green-500',
      hover: 'hover:shadow-green-100',
      clickFunction: () => navigate('/cart')
    },
    {
      title: 'Problems',
      value: data?.problemCount || 0,
      icon: <FiAlertCircle className="text-xl" />,
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      border: 'border-l-4 border-gray-500',
      hover: 'hover:shadow-gray-100',
      clickFunction: () => navigate('/my-problems')
    },
    {
      title: 'Solutions',
      value: data?.solutionCount || 0,
      icon: <AiFillCheckCircle className="text-xl" />,
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      border: 'border-l-4 border-yellow-500',
      hover: 'hover:shadow-yellow-100',
      clickFunction: () => navigate('/solutions')
    },
    {
      title: 'Exchanges',
      value: data?.exchangeTools || 0,
      icon: <FiRepeat className="text-xl" />,
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-l-4 border-purple-500',
      hover: 'hover:shadow-purple-100',
      clickFunction: () => navigate('/exchange')
    },
    {
      title: 'Marketplace',
      value: data?.totalTools || 0,
      icon: <FiShoppingBag className="text-xl" />,
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
      border: 'border-l-4 border-pink-500',
      hover: 'hover:shadow-pink-100',
      clickFunction: () => navigate('/others-tools')
    }
  ];

  // Prepare data for the bar chart
  const barChartData = {
    labels: ['Products', 'Cart Items', 'Problems', 'Solutions', 'Exchanges', 'Marketplace'],
    datasets: [
      {
        label: 'Count',
        data: [
          data?.userTools || 0,
          data?.cartTools || 0,
          data?.problemCount || 0,
          data?.solutionCount || 0,
          data?.exchangeTools || 0,
          data?.totalTools || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(201, 203, 207, 0.7)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 206, 86)',
          'rgb(255, 99, 132)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dashboard Statistics Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
    },
  };

  // Data for the doughnut chart (if you want to show a different visualization)
  const doughnutChartData = {
    labels: ['Products', 'Problems', 'Solutions'],
    datasets: [
      {
        label: 'Distribution',
        data: [
          data?.userTools || 0,
          data?.problemCount || 0,
          data?.solutionCount || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 206, 86)',
        ],
        borderWidth: 1,
      },
    ],
  };

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

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Statistics Overview</h3>
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          )}
        </motion.div>

        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <div className="h-80">
              <Doughnut 
                data={doughnutChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }} 
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          onClick={() => navigate('/my-problems')}
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