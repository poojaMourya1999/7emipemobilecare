import React, { useEffect, useState } from 'react';
import apiService, { baseUrl } from '../services/apiService';
import { TOOLS_CART } from '../services/apiUrl';
import axios from 'axios';

function Cart() {
    const [cart, setCart] = useState({ cartItems: [] });
    const [loading, setLoading] = useState(true);

    // Safely calculate total price
    const totalPrice = cart.cartItems.reduce((sum, item) => {
        return sum + (item?.tool?.price || 0);
    }, 0);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await apiService({
                endpoint: TOOLS_CART,
                method: 'GET',
            });
            // Map API response to frontend structure
            setCart({ cartItems: res?.data || [] });
        } catch (error) {
            console.error('Error fetching Cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        const token = await localStorage.getItem('token')
        if (window.confirm('Are you sure you want to remove this item?')) {
            try {
                const res = await axios.delete(`${baseUrl}cart/${itemId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Tool deleted from Cart successfully');
                fetchCart();
            } catch (error) {
                console.error('Error removing from cart item:', error);
            }
        }
    };


    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Cart Items */}
                        <div className="divide-y divide-gray-200">
                            {cart.cartItems.length > 0 ? (
                                cart.cartItems.map((item) => (
                                    <div key={item._id} className="p-6 sm:flex sm:items-center sm:justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-20 w-20 rounded-md object-cover"
                                                    src={item.tool?.photo || 'https://via.placeholder.com/150'}
                                                    alt={item.tool?.name}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {item.tool?.name || 'Unknown Tool'}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {item.tool?.description || 'No description'}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Added on {new Date(item.addedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-xl font-semibold text-gray-900">
                                                ₹{(item.tool?.price || 0).toLocaleString()}
                                            </p>
                                            <div className="mt-3 flex space-x-2">
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    Your cart is empty
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {cart.cartItems.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 sm:px-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            Total: ₹{totalPrice.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {cart.cartItems.length} {cart.cartItems.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;