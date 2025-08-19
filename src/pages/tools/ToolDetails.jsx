import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/apiService';
import { BUY_TOOLS, CREATE_ORDER } from '../../services/apiUrl';

const ToolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await apiService({
          endpoint: `tools/${id}`,
          method: 'GET'
        });
        setTool(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load tool');
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id, location]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (toolId) => {

    try {
      setPaymentLoading(true);

      // 1. Create order on your backend
      const orderRes = await apiService({
        endpoint: CREATE_ORDER,
        method: 'POST',
        data: {
          toolId,
          quantity,
          amount: tool.price * quantity * 100 // Convert to paise
        }
      });

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment processor');
      }

      // 3. Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: 'INR',
        name: 'Your App Name',
        description: `Purchase of ${tool.name}`,
        image: '/logo.png',
        order_id: orderRes.data.orderId,
        handler: async (response) => {
          // 4. Verify payment on your backend
          try {
            const verifyRes = await apiService({
              endpoint: `${BUY_TOOLS}/${toolId}`,
              method: 'PUT',
              token: localStorage.getItem('token'),
              data: {
                quantity,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              }
            });

            alert(verifyRes.message || 'Payment successful!');
            // Refresh tool data
            const updatedTool = await apiService({
              endpoint: `tools/${id}`,
              method: 'GET'
            });
            setTool(updatedTool.data);
            setQuantity(1);
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < tool.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return <div className="text-center py-8">Loading tool details...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!tool) return <div className="text-center py-8">Tool not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Tool Image */}
        <div>
          <img
            src={tool.photo || '/default-tool.jpg'}
            alt={tool.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Tool Details */}
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-gray-600 mt-2">{tool.description}</p>

          <div className="mt-4 space-y-2">
            <p><span className="font-semibold">Price:</span> ₹{tool.price}</p>
            <p><span className="font-semibold">Available:</span> {tool.quantity}</p>
            <p>
              <span className="font-semibold">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${tool.status === 'available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {tool.status}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Added on {new Date(tool.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Updated on {new Date(tool.updatedAt).toLocaleDateString()}
            </p>
            <p><span className="font-semibold">Owner:</span> {tool.owner?.name}</p>

          </div>

          {/* Quantity Selector */}
          {tool.status === 'available' && (
            <div className="mt-4 flex items-center">
              <span className="font-semibold mr-3">Quantity:</span>
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-4 py-1 bg-gray-100">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= tool.quantity}
                className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
              >
                +
              </button>
              <span className="ml-2 text-sm text-gray-500">
                (Max: {tool.quantity})
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-x-4">

            {tool?.status === 'available' && (
              <button
                onClick={() => handleBuy(tool._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing Payment...' : `Pay Now (₹${tool.price * quantity})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetails;
