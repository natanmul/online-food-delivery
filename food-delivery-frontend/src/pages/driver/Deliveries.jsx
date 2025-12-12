import React, { useState, useEffect } from 'react';
import { deliveryService } from '../../services/api/delivery.js';
import DeliveryCard from '../../components/driver/DeliveryCard.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

const DriverDeliveries = () => {
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [requestsRes, historyRes] = await Promise.all([
        deliveryService.getDeliveryRequests(),
        deliveryService.getDeliveryHistory()
      ]);
      
      if (requestsRes.success) {
        setDeliveryRequests(requestsRes.data);
      }
      
      if (historyRes.success) {
        setDeliveryHistory(historyRes.data);
      }
    } catch (err) {
      setError('An error occurred while loading deliveries');
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await deliveryService.acceptDeliveryRequest(requestId);
      
      if (response.success) {
        fetchDeliveries(); // Refresh data
      }
    } catch (err) {
      console.error('Error accepting delivery request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await deliveryService.rejectDeliveryRequest(requestId);
      
      if (response.success) {
        fetchDeliveries(); // Refresh data
      }
    } catch (err) {
      console.error('Error rejecting delivery request:', err);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      const response = await deliveryService.completeDelivery(orderId);
      
      if (response.success) {
        fetchDeliveries(); // Refresh data
      }
    } catch (err) {
      console.error('Error completing delivery:', err);
    }
  };

  const filteredHistory = deliveryHistory.filter(delivery => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    return (
      delivery.restaurant_name.toLowerCase().includes(searchTerm) ||
      delivery.customer_name.toLowerCase().includes(searchTerm) ||
      delivery.order_id.toString().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loader text="Loading deliveries..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
              <p className="text-gray-600">
                Manage delivery requests and track your delivery history
              </p>
            </div>
            <Button
              onClick={fetchDeliveries}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <Alert type="error" className="mb-6">
              {error}
              <Button
                onClick={fetchDeliveries}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Try Again
              </Button>
            </Alert>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivery Requests
                {deliveryRequests.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {deliveryRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivery History
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'requests' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Available Delivery Requests
                  </h2>
                  <p className="text-gray-600">
                    Accept delivery requests to earn money. You'll receive 20% of the order total as commission.
                  </p>
                </div>

                {deliveryRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM12 8h.01M12 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery requests</h3>
                    <p className="mt-1 text-gray-500">
                      No pending delivery requests at the moment. Check back later!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {deliveryRequests.map(request => (
                      <DeliveryCard
                        key={request.id}
                        delivery={request}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                        onComplete={handleCompleteDelivery}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Delivery History</h2>
                    <p className="text-gray-600">
                      Track all your completed deliveries and earnings
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <Input
                      placeholder="Search by restaurant, customer, or order ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      leftIcon={
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      }
                    />
                  </div>
                </div>

                {deliveryHistory.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery history</h3>
                    <p className="mt-1 text-gray-500">
                      Your delivery history will appear here after you complete deliveries.
                    </p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No matching deliveries</h3>
                    <p className="mt-1 text-gray-500">
                      No deliveries match your search.
                    </p>
                    <Button
                      onClick={() => setSearch('')}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredHistory.map(delivery => (
                      <DeliveryCard
                        key={delivery.id}
                        delivery={delivery}
                        isHistory={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDeliveries;