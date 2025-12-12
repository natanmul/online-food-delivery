import React, { useState, useEffect } from 'react';
import { deliveryService } from '../../services/api/delivery.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const DriverDashboard = () => {
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingRequests: 0,
    earnings: 0,
    completedToday: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
        
        // Calculate stats
        const totalDeliveries = historyRes.data.length;
        const pendingRequests = requestsRes.success ? requestsRes.data.length : 0;
        const earnings = historyRes.data.reduce((sum, delivery) => sum + (delivery.total_price * 0.2), 0); // 20% commission
        const completedToday = historyRes.data.filter(delivery => {
          const deliveryDate = new Date(delivery.completed_at || delivery.assigned_at).toDateString();
          const today = new Date().toDateString();
          return deliveryDate === today;
        }).length;
        
        setStats({
          totalDeliveries,
          pendingRequests,
          earnings,
          completedToday
        });
      }
    } catch (err) {
      setError('An error occurred while loading dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await deliveryService.acceptDeliveryRequest(requestId);
      
      if (response.success) {
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      console.error('Error accepting delivery request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await deliveryService.rejectDeliveryRequest(requestId);
      
      if (response.success) {
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      console.error('Error rejecting delivery request:', err);
    }
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      const response = await deliveryService.completeDelivery(orderId);
      
      if (response.success) {
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      console.error('Error completing delivery:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loader text="Loading dashboard..." />
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600">
              Manage your delivery requests and track your earnings
            </p>
          </div>

          {error && (
            <Alert type="error" className="mb-6">
              {error}
              <Button
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Try Again
              </Button>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM12 8h.01M12 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                    <div className="text-sm text-gray-600">Pending Requests</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
                    <div className="text-sm text-gray-600">Total Deliveries</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stats.completedToday}</div>
                    <div className="text-sm text-gray-600">Today's Deliveries</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{formatCurrency(stats.earnings)}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Delivery Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Delivery Requests</h2>
                <Button
                  onClick={fetchDashboardData}
                  variant="outline"
                  size="sm"
                  loading={loading}
                >
                  Refresh
                </Button>
              </Card.Header>
              
              <Card.Body>
                {deliveryRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM12 8h.01M12 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery requests</h3>
                    <p className="mt-1 text-gray-500">
                      No pending delivery requests at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveryRequests.map(request => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Order #{request.order_id}</h4>
                            <p className="text-sm text-gray-600">{request.restaurant_name}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">From:</span>
                            <span>{request.restaurant_location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">To:</span>
                            <span>{request.customer_address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{formatCurrency(request.total_price)}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            variant="success"
                            size="sm"
                            className="flex-1"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Recent Deliveries */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Recent Deliveries</h2>
              </Card.Header>
              
              <Card.Body>
                {deliveryHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery history</h3>
                    <p className="mt-1 text-gray-500">
                      Your delivery history will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveryHistory.slice(0, 5).map(delivery => (
                      <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Order #{delivery.order_id}</h4>
                            <p className="text-sm text-gray-600">{delivery.restaurant_name}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer:</span>
                            <span>{delivery.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span>{formatDate(delivery.completed_at || delivery.assigned_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Earnings:</span>
                            <span className="font-medium">
                              {formatCurrency(delivery.total_price * 0.2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center">
                      <Button
                        onClick={() => window.location.href = '/driver/deliveries'}
                        variant="outline"
                        size="sm"
                      >
                        View All History
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;