import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { baseUrl } from '../../services/apiService';

const ProblemSolutions = () => {
  const { id: problemId } = useParams();
  
  // Get ID from navigation state (if available)
  const { state } = useLocation();
  const problemIdFromState = state?.problemId;
  
  // Use state ID if available, otherwise fall back to URL param
  const problemIds = problemIdFromState || problemId;

  console.log('Problem ID problem solutions :', problemIds);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${baseUrl}problem/${problemIds}/solutions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('first response', response.data);
        setSolutions(response?.data?.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch solutions');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [problemId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submitted Solutions</h2>
      
      {solutions.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <p>No solutions have been submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {solutions.map((solution) => (
            <div key={solution._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <FaUser className="mr-2 text-gray-600" />
                      {solution.solver.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      Submitted on {formatDate(solution.submittedAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    solution.status === 'submitted' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {solution.status}
                  </span>
                </div>

                <p className="mb-4 text-gray-700">{solution.description}</p>

                {solution.attachments && solution.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium flex items-center mb-2">
                      <FaFileAlt className="mr-2 text-gray-600" />
                      Attachments:
                    </h4>
                    <div className="space-y-2">
                      {solution.attachments.map((attachment, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-0">
                          <a 
                            href={attachment} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline block py-2"
                          >
                            {attachment.length > 50 
                              ? `${attachment.substring(0, 50)}...` 
                              : attachment}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemSolutions;