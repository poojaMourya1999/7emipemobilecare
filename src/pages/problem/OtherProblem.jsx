import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiLock, FiGlobe, FiDollarSign, FiStar, FiClock, FiUser, FiFilter, FiSearch } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';

const OthersProblem = () => {
    const user = "pooja"
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        rewardType: '',
        search: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/problem/others-problems', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        status: filters.status || undefined,
                        rewardType: filters.rewardType || undefined,
                    }
                });
                setProblems(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch problems');
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [filters.status, filters.rewardType]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const filteredProblems = problems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            problem.description.toLowerCase().includes(filters.search.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'paid': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleViewProblem = (id) => {
        navigate(`/problem/${id}/public`, {state: { problemId: id } });
    };

    const handleSubmitSolution = (id) => {
        navigate(`/problem/${id}/submit-solution`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Challenges</h1>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search problems..."
                                value={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                    <div>
                        <select
                            name="rewardType"
                            value={filters.rewardType}
                            onChange={handleFilterChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Types</option>
                            <option value="money">Money</option>
                            <option value="coins">Coins</option>
                        </select>
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={() => setFilters({ status: '', rewardType: '', search: '' })}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-gray-600">
                Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
            </div>

            {/* Problems List */}
            {filteredProblems.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No problems found matching your criteria</h3>
                    <button
                        onClick={() => setFilters({ status: '', rewardType: '', search: '' })}
                        className="mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredProblems.map((problem) => (
                        <div key={problem._id} className="bg-white rounded-lg shadow overflow-hidden transition-all duration-200 hover:shadow-lg">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left Column */}
                                    <div className="flex-1 md:pr-6">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(problem.status)} border`}>
                                                {problem.status}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                {problem.rewardType === 'money' ? (
                                                    <FiDollarSign className="mr-1" />
                                                ) : (
                                                    <FaCoins className="mr-1 text-yellow-500" />
                                                )}
                                                {problem.rewardAmount} {problem.rewardType}
                                            </span>
                                            {problem.deadline && (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${new Date(problem.deadline) < new Date() ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                    <FiClock className="mr-1" />
                                                    Due {formatDistanceToNow(new Date(problem.deadline))}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{problem.title}</h2>
                                        <p className="text-gray-600 mb-4">
                                            {problem.description.length > 200
                                                ? `${problem.description.substring(0, 200)}...`
                                                : problem.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {problem.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="w-full md:w-64 mt-4 md:mt-0">
                                        <div className="space-y-4">
                                            <div className="border rounded-lg p-3">
                                                <div className="flex items-center text-gray-500 mb-2">
                                                    <FiUser className="mr-1" />
                                                    <span className="text-sm">Posted by</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={problem.createdBy.profilePicture || 'https://via.placeholder.com/40'}
                                                            alt={problem.createdBy.name}
                                                        />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{problem.createdBy.name}</p>
                                                        <p className="text-xs text-gray-500">{problem.createdBy.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border rounded-lg p-3">
                                                <div className="flex items-center text-gray-500 mb-2">
                                                    <FiGlobe className="mr-1" />
                                                    <span className="text-sm">Solutions</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {problem.solutions.length} submitted
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleViewProblem(problem._id)}
                                                    className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleSubmitSolution(problem._id)}
                                                    disabled={problem.status !== 'open'}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${problem.status === 'open' ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500' : 'border border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                                                >
                                                    Submit Solution
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OthersProblem;