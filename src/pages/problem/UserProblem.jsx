import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiClock, FiAward, FiTag, FiSearch, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProblemForm from './ProblemForm';
import ConfirmationModal from '../../components/ConformaitionModal';
import MyModal from '../../components/MyModal';
import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../services/apiService';

const UserProblem = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingProblem, setEditingProblem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [problemToDelete, setProblemToDelete] = useState(null);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}problem/my-problems`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProblems(response.data.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleDeleteProblem = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${baseUrl}problem/${problemToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchProblems();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };


    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const daysRemaining = (deadline) => {
        const diff = new Date(deadline) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days remaining` : 'Deadline passed';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Problems</h1>
                        <p className="text-gray-600">Manage and track your posted problems</p>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search problems..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setEditingProblem(null);
                                setShowFormModal(true);
                            }}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                        >
                            <FiPlus />
                            <span>Add Problem</span>
                        </motion.button>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {!loading && filteredProblems.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {searchTerm ? 'No matching problems found' : 'No problems yet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm ? 'Try a different search term' : 'Get started by adding your first problem'}
                        </p>
                        <button
                            onClick={() => setShowFormModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            Add Problem
                        </button>
                    </div>
                )}

                {!loading && filteredProblems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredProblems.map((problem) => (
                            <motion.div
                                key={problem._id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${problem.status === 'open' ? 'bg-green-100 text-green-800' :
                                                problem.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'}`}
                                            >
                                                {problem.status.toUpperCase()}
                                            </span>
                                            <span className="block text-xs text-gray-500 mt-1">
                                                Posted: {formatDate(problem.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/problem/${problem._id}/solutions`, {
                                                    state: { problemId: problem._id }
                                                })}
                                                className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                                                title="View Solutions"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingProblem(problem);
                                                    setShowFormModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                                title="Edit problem"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProblemToDelete(problem._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                                title="Delete problem"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{problem.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{problem.description}</p>
                                    {problem.tags && problem.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {problem.tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <FiTag className="mr-1" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FiClock className="mr-1" />
                                            <span>{daysRemaining(problem.deadline)}</span>
                                        </div>
                                        <div className="flex items-center text-sm font-medium">
                                            <FiAward className="mr-1 text-yellow-500" />
                                            <span>{problem.rewardAmount} {problem.rewardType}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {showFormModal && (
                <MyModal
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    title={editingProblem ? "Edit Problem" : "Create New Problem"}
                >
                    <ProblemForm
                        problem={editingProblem}
                        onSuccess={() => {
                            setShowFormModal(false);
                            fetchProblems();
                        }}
                        onCancel={() => setShowFormModal(false)}
                    />
                </MyModal>
            )}

            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteProblem}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this problem? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}


        </div>
    );
};

export default UserProblem;