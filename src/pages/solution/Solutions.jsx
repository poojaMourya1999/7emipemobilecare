import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../services/apiService';

const SolutionList = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${baseUrl}solution`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSolutions(res.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading solutions...</p>;

  if (solutions.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No solutions submitted yet.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Submitted Solutions</h1>

      <div className="space-y-6">
        {solutions.map((solution) => (
          <div
            key={solution._id}
            className="border p-5 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Problem Info */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Problem:{' '}
                <button
                  onClick={() => navigate(`/problem/${solution.problem?._id}` , { state: { problemId: solution.problem?._id } })}
                  className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none cursor-pointer p-0"
                >
                  {solution.problem?.title || 'Unknown Problem'}
                </button>
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded-full ${solution.status === 'submitted'
                    ? 'bg-blue-100 text-blue-800'
                    : solution.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
              >
                {solution.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{solution.description}</p>

            {/* Attachments */}
            {solution.attachments.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-sm text-gray-600 mb-1">Attachments:</p>
                <ul className="list-disc list-inside space-y-1">
                  {solution.attachments.map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        File {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Date */}
            <p className="text-xs text-gray-500">
              Submitted on: {new Date(solution.submittedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionList;
