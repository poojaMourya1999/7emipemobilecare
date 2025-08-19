import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { EXCHANGE } from '../../services/apiUrl';

const Exchange = () => {
  const [loading, setLoading] = useState(false);
  const [exchangeData, setExchangeData] = useState({
    count: 0,
    exchanges: []
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const handleExchanges = async () => {
    setLoading(true);
    try {
      const res = await apiService({
        endpoint: EXCHANGE,
        method: 'GET',
      });
      setExchangeData({
        count: res.count || 0,
        exchanges: res.exchanges || []
      });
    } catch (error) {
      console.log('Exchange error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleExchanges();
  }, []);

  const updateExchangeStatus = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      // Uncomment and implement your actual API call
      const res = await apiService({
        endpoint: `${EXCHANGE}/status/${id}`,
        method: 'PUT',
        data: { status: newStatus }
      });

      console.log("exchange tools status : ", res)
      // Update local state
      setExchangeData(prev => ({
        ...prev,
        exchanges: prev.exchanges.map(exchange =>
          exchange._id === id
            ? { ...exchange, status: newStatus }
            : exchange
        )
      }));
    } catch (error) {
      console.log("Update status error:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const confirmStatusChange = (exchangeId, currentStatus) => {
    const nextStatus =
      currentStatus === 'pending' ? 'approved' :
        currentStatus === 'approved' ? 'rejected' :
          'pending';

    if (window.confirm(`Change status from ${currentStatus} to ${nextStatus}?`)) {
      updateExchangeStatus(exchangeId, nextStatus);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'approved':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getExchangeType = (exchange) => {
    if (exchange.type === 'incoming') {
      return `${exchange.otherParty?.name || 'Someone'} wants to exchange with you`;
    } else if (exchange.type === 'outgoing') {
      return `You requested exchange with ${exchange.receiver?.name || 'someone'}`;
    }
    return 'Exchange request';
  };

  if (loading) return <p className="p-4 text-center">Loading exchanges...</p>;
  if (exchangeData.count === 0) return <p className="p-4 text-center">No exchange requests found.</p>;

  return (
    <div className='px-4  py-10'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Exchange Requests</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Total: {exchangeData.count}
        </span>
      </div>

      {exchangeData.exchanges.map((exchange) => {
        const statusColors = getStatusColor(exchange.status);

        return (
          <div key={exchange._id} className={`border rounded-lg shadow-sm p-4 ${statusColors.bg} ${statusColors.border}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {getExchangeType(exchange)}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(exchange.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}>
                {exchange.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Requested Tool */}
              <div className="border rounded p-3 bg-white">
                <h4 className="font-bold text-indigo-600 mb-2">Requested Tool</h4>
                {exchange.toolsRequested.photo && (
                  <img
                    src={exchange.toolsRequested.photo}
                    alt={exchange.toolsRequested.name}
                    className="h-16 w-16 object-cover rounded mb-2"
                  />
                )}
                <p><span className="font-medium">Name:</span> {exchange.toolsRequested.name}</p>
                <p><span className="font-medium">Status:</span> {exchange.toolsRequested.status}</p>
              </div>

              {/* Offered Tool */}
              <div className="border rounded p-3 bg-white">
                <h4 className="font-bold text-green-600 mb-2">Offered Tool</h4>
                {exchange.toolsOffered.photo && (
                  <img
                    src={exchange.toolsOffered.photo}
                    alt={exchange.toolsOffered.name}
                    className="h-16 w-16 object-cover rounded mb-2"
                  />
                )}
                <p><span className="font-medium">Name:</span> {exchange.toolsOffered.name}</p>
                <p><span className="font-medium">Status:</span> {exchange.toolsOffered.status}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div>
                {exchange.type === 'incoming' && (
                  <p>
                    <span className="font-medium">From:</span> {exchange.otherParty?.name} ({exchange.otherParty?.email})
                  </p>
                )}
                {exchange.type === 'outgoing' && (
                  <p>
                    <span className="font-medium">To:</span> {exchange.receiver?.name || 'Pending approval'}
                  </p>
                )}
              </div>

              {exchange.type === 'incoming' && (
                <button
                  onClick={() => confirmStatusChange(exchange._id, exchange.status)}
                  disabled={updatingStatus === exchange._id}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${updatingStatus === exchange._id
                      ? 'bg-gray-300 cursor-not-allowed'
                      : statusColors.bg.replace('100', '200') + ' hover:' + statusColors.bg.replace('100', '300')
                    } ${statusColors.text}`}
                >
                  {updatingStatus === exchange._id ? (
                    'Processing...'
                  ) : (
                    exchange.status === 'pending' ? 'Respond to Request' : 'Change Status'
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Exchange;