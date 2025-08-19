import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaCoins, 
  FaTag, 
  FaClock, 
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';
import { baseUrl } from '../../services/apiService';

const ProblemById = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Get ID from either URL params or navigation state
  const problemId = id || state?.problemId;
  
  console.log('Problem ID:', problemId); 
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${baseUrl}problem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setProblem(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch problem details');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'open': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const difficultyClasses = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyClasses[difficulty] || 'bg-gray-100'}`}>
        {difficulty}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <p>Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Problems
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>
            <div className="flex space-x-2">
              {getStatusBadge(problem.status)}
              {getDifficultyBadge(problem.difficulty)}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaUser className="mr-2" /> Created By
              </h3>
              <p>{problem.createdBy.name}</p>
              <p className="text-sm text-gray-500">{problem.createdBy.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" /> Timeline
              </h3>
              <p>Created: {formatDate(problem.createdAt)}</p>
              <p>Deadline: {formatDate(problem.deadline)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCoins className="mr-2" /> Reward
              </h3>
              <p>{problem.rewardAmount} {problem.rewardType}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaTag className="mr-2" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center">
              <FaExclamationTriangle className="mr-2" /> Solutions
            </h3>
            {problem.solutions.length === 0 ? (
              <p className="text-gray-500">No solutions submitted yet</p>
            ) : (
              <div className="space-y-3">
                {problem.solutions.map(solution => (
                  <div key={solution._id} className="border border-gray-200 rounded p-3">
                    <p>{solution.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemById;