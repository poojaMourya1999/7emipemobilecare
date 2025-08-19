import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { ALL_TOOLS, ADD_TO_CART, BUY_TOOLS, EXCHANGE, ALL_TOOLS_OTHERS } from '../../services/apiUrl';
import { useNavigate } from 'react-router-dom';
import MyModal from '../../components/MyModal';
import MyTool from '../exchange/MyTool';

function OthersTools({ context = "protected" }) {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const [loading, setLoading] = useState(false);
    const [tools, setTools] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTool, setSelectedTool] = useState(null);
    const [exchangeModalOpen, setExchangeModalOpen] = useState(false);

    const handleBuy = async (toolId) => {
        if (context === 'home' || !isAuthenticated) {
            navigate('/signin', { state: { from: location.pathname } })
            return
        } else {
            navigate(`/tool_details/${toolId}`)
            return
        }

    };

    const handleAddToCart = async (toolId) => {
        if (context === 'home' || !isAuthenticated) {
            navigate('/signin', { state: { from: location.pathname } })
            return
        }
        alert('add to cart')
        try {
            setLoading(true);
            const res = await apiService({
                endpoint: ADD_TO_CART,
                method: 'POST',
                token: localStorage.getItem('token'),
                data: { toolId }
            });
            console.log("res cart : ", res)
            alert(res.message || 'Tool added to cart successfully');
        } catch (error) {
            console.log("cart error ", error)
            setError(error?.details?.error || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const handleTools = async () => {
        setLoading(true);
        try {
            const res = await apiService({
                endpoint: ALL_TOOLS_OTHERS,
                method: 'GET',
                token: localStorage.getItem('token') || ''
            });
            setTools(res?.data || res || []);
        } catch (error) {
            console.log('tools error:', error);
            setError('Failed to load tools');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleTools();
    }, []);

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                All Tools Which are Listed
            </h3>

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-gray-500">Loading tools...</p>
            ) : tools.length === 0 ? (
                <p className="text-gray-500">No tools found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border-b">Image</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tools.map((tool) => (
                                <tr key={tool._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        {tool.photo && (
                                            <img
                                                src={tool.photo}
                                                alt={tool.name}
                                                className="h-12 w-12 object-cover rounded"
                                            />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">{tool.name}</td>
                                    <td className="py-2 px-4 border-b">{tool.description}</td>
                                    <td className="py-2 px-4 border-b">₹ {tool.price}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${tool.status === 'available'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {tool.status}
                                        </span>
                                    </td>
                                    <td className="p-2 border-b space-x-2">
                                        <button
                                            onClick={() => {

                                                handleAddToCart(tool._id)
                                            }}
                                            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            disabled={tool.inCart}
                                        >
                                            {tool.inCart ? '✔ In Cart' : 'to Cart'}
                                        </button>
                                        <button
                                            onClick={() => handleExchangeInit(tool)}
                                            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            disabled={tool.status !== 'available'}
                                        >
                                            Exchange
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleBuy(tool?._id) // Using URL parameter instead of state
                                            }}
                                            className={`text-sm px-3 py-1 rounded ${tool.status !== 'available'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                }`}
                                            disabled={tool.status !== 'available'}
                                        >
                                            {tool.status === 'available' ? 'Buy' : 'N/A'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {exchangeModalOpen && (
                <MyModal
                    isOpen={exchangeModalOpen}
                    onClose={() => setExchangeModalOpen(false)}
                    title="Exchange Tool"
                >
                    <h3>Select a tool to exchange with {selectedTool?.name}</h3>
                    <MyTool
                        onSuccess={() => setExchangeModalOpen(false)}
                        handleExchange={handleExchangeConfirm}
                    />

                </MyModal>
            )}
        </div>
    );
}

export default OthersTools;