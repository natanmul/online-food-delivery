import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/api/restaurants.js';
import { orderService } from '../../services/api/orders.js';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [restaurantRes, ordersRes] = await Promise.all([
        restaurantService.getMyRestaurant(),
        orderService.getMyOrders()
      ]);
      
      if (restaurantRes.success) {
        setRestaurant(restaurantRes.data);
      } else {
        setError('Failed to load restaurant data');
      }
      
      if (ordersRes.success) {
        setOrders(ordersRes.data);
        
        // Calculate stats
        const totalOrders = ordersRes.data.length;
        const pendingOrders = ordersRes.data.filter(o => 
          ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)
        ).length;
        const revenue = ordersRes.data
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.total_price, 0);
        
        setStats({
          totalOrders,
          pendingOrders,
          revenue,
          avgRating: restaurantRes.data?.avg_rating || 0
        });
      }
    } catch (err) {
      setError('An error occurred while loading dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, { status: newStatus });
      
      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert type="error">
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
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurant found</h3>
              <p className="mt-1 text-gray-500">
                You haven't registered a restaurant yet.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => window.location.href = '/restaurant/register'}
                >
                  Register Restaurant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {restaurant.name}!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
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
                    <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                    <div className="text-sm text-gray-600">Pending Orders</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              <Button
                onClick={() => window.location.href = '/restaurant/orders'}
                variant="outline"
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            
            <Card.Body>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No recent orders</h3>
                  <p className="mt-1 text-gray-500">
                    You haven't received any orders yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customer_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.total_price)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Restaurant Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Restaurant Information</h2>
              </Card.Header>
              
              <Card.Body>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Restaurant Name</h3>
                    <p className="mt-1 text-lg font-medium">{restaurant.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{restaurant.location}</p>
                  </div>
                  
                  {restaurant.phone && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="mt-1">{restaurant.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Menu Items</h3>
                    <p className="mt-1">{restaurant.menu_items?.length || 0} items</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={() => window.location.href = '/restaurant/settings'}
                    variant="outline"
                    className="w-full"
                  >
                    Edit Restaurant Info
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </Card.Header>
              
              <Card.Body>
                <div className="space-y-3">
                  <Button
                    onClick={() => window.location.href = '/restaurant/menu'}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Menu Item
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/restaurant/orders'}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View All Orders
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/restaurant/menu'}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Manage Menu
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;