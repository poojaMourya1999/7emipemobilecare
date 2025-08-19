import React, { useState, useEffect } from 'react';
import { TOOLS } from '../../services/apiUrl';
import apiService from '../../services/apiService';

function MyTool({ onSuccess, handleExchange, }) {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState()
    const handleTools = async () => {
        setLoading(true);
        try {
            const res = await apiService({
                endpoint: TOOLS,
                method: 'GET',
            });
            setTools(res || []);
        } catch (error) {
            console.error('Tools error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (toolId) => {
        setSelectedId(toolId);
    };

    const handleSavedExchange = () => {
        if (!selectedId) {
            alert('Please select a tool first');
            return;
        }
        handleExchange(selectedId);
        onSuccess();
    };

    useEffect(() => {
        handleTools();
    }, []);


    return (
        <>
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
                                <th className="py-2 px-4 border-b">Actions</th>
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
                                    <td className="py-2 px-4 border-b">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${tool.status === 'available'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {tool.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b space-x-2">
                                        <button
                                            onClick={() => handleSelect(tool?._id)}
                                            className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                           {selectedId !== tool?._id ? 'Select' : 'Selected'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button
                onClick={handleSavedExchange}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!selectedId}
            >
                Confirm Exchange
            </button>
        </>
    );
}

export default MyTool;