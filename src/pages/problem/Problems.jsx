import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiAward, FiUser, FiTag, FiFilter } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Problems = ({ context = "protected" }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'open',
    rewardType: 'coins'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:5000/api/problem/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProblems(data.data || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (problemId) => {
    console.log("first", problemId);
    if (context === 'home' || !isAuthenticated) {
      navigate('/signin', { 
        state: { 
          from: location.pathname,
          message: 'Please sign in to view problem details'
        } 
      });
    } else {
      navigate('/solution', { state: { problemId } });
    }
  };

  const resetFilters = () => {
    setFilters({
      status: 'open',
      rewardType: 'coins'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {context === 'home' ? 'Community Challenges' : 'My Challenges'}
          </h1>
          <p className="text-lg text-gray-600">
            {context === 'home' 
              ? 'Find problems to solve and earn rewards' 
              : 'Track your submitted problems'}
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-blue-600">
              <FiFilter className="mr-2 text-xl" />
              <h3 className="font-medium">Filter Problems</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full sm:w-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
                <select
                  name="rewardType"
                  value={filters.rewardType}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="coins">Coins</option>
                  <option value="money">Money</option>
                  <option value="none">None</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="self-end bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Problem Cards */}
        {!loading && !error && problems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {problems.map((problem) => (
              <motion.div
                key={problem._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Problem Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        problem.status === 'open' ? 'bg-green-100 text-green-800' :
                        problem.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {problem.status.toUpperCase()}
                      </span>
                      <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <FiClock className="inline mr-1" />
                      {new Date(problem.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Problem Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{problem.description}</p>

                  {/* Reward Info */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <FiAward className="text-yellow-500 mr-2" />
                      <span className="text-gray-700">
                        {problem.rewardAmount > 0 ? `${problem.rewardAmount} ${problem.rewardType}` : 'No reward'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="text-blue-500 mr-2" />
                      <span className="text-gray-700">{problem.createdBy?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags?.map(tag => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FiTag className="mr-1" /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleViewDetails(problem._id)} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Give Your Solution
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && problems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FiFilter className="text-gray-500 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {context === 'home'
                ? 'Try adjusting your filters or check back later for new challenges.'
                : 'You haven\'t created any problems yet.'}
            </p>
            {context !== 'home' && (
              <button
                onClick={() => navigate('/problem/new')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create New Problem
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

Problems.propTypes = {
  context: PropTypes.oneOf(['protected', 'home']),
  isAuthenticated: PropTypes.bool
};

Problems.defaultProps = {
  context: 'protected',
  isAuthenticated: false
};

export default Problems;