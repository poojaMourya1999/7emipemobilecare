import React, { useEffect } from 'react'
import MyModal from '../../components/MyModal'
import AddTools from './AddTools'
import apiService, { baseUrl } from '../../services/apiService';
import { TOOLS } from '../../services/apiUrl';
import axios from 'axios';

function UsersTools() {
    const [addModal, setAddModal] = React.useState({ modal: false, item: {} });
    const [loading, setLoading] = React.useState(false);
    const [tools, setTools] = React.useState([]);
    const [deletingId, setDeletingId] = React.useState(null);
    const targetRef = React.useRef(null);

    const handleDelete = async (id) => {
        setDeletingId(id);
        const token = localStorage.getItem('token');

        const confirmDelete = window.confirm("Are you sure you want to delete this tool?");
        if (!confirmDelete) return;
        try {
            const res = await axios.delete(`${baseUrl}tools/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Tool deleted successfully');
            setTools((prev) => prev.filter((tool) => tool._id !== id));
            return res.message;
        } catch (err) {
            console.error('Error deleting tool:', err.message);
            throw err;
        } finally {
            setDeletingId(null)
        }
    };

    const handleTools = async () => {
        setLoading(true);
        try {
            const res = await apiService({
                endpoint: TOOLS,
                method: 'GET',
            });
            console.log("tools res : ", res)
            setTools(res || []);
        } catch (error) {
            console.log('tools error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tool) => {
        setAddModal({ modal: true, item: tool })
    };

    useEffect(() => {
        handleTools();
    }, []);
    
    return (
        <div>
            <div className="p-6">
                <h3 className="pt-10 text-xl font-semibold text-gray-800 mb-4">
                    Tools Listed by You
                </h3>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setAddModal({ modal: true })}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-full shadow-md transition duration-200"
                    >
                        <span>➕</span>
                        <span>Add Tool</span>
                    </button>
                </div>
            </div>
            {loading ? (
                <p className="text-gray-500">Loading tools...</p>
            ) : tools.length === 0 ? (
                <p className="text-gray-500">No tools found.</p>
            ) : (
                <div ref={targetRef} className="overflow-x-auto">
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
                                        <span className={`px-2 py-1 text-xs rounded-full ${tool.status === 'available'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {tool.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b space-x-2">
                                        <button
                                            onClick={() => handleEdit(tool)}
                                            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tool._id)}
                                            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                            disabled={deletingId === tool._id}
                                        >
                                            {deletingId === tool._id ? 'Deleting...' : 'Delete'}
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {addModal.modal && (
                <MyModal
                    isOpen={addModal.modal}
                    onClose={() => setAddModal({ modal: false })}
                    title="Add Tool"
                >
                    <AddTools onSuccess={() => setAddModal({ modal: false })} tool={addModal?.item}  handleTools={handleTools}/>
                </MyModal>
            )}
        </div>
    )
}

export default UsersTools