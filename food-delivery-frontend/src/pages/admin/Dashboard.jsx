import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api/admin.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminService.getStatistics();
      
      if (response.success) {
        setStats(response.data);
        setRecentOrders(response.data.recent_orders || []);
        setTopRestaurants(response.data.top_restaurants || []);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('An error occurred while loading dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Overview of platform statistics and performance
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.order_stats?.total_orders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(stats?.order_stats?.total_revenue || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats?.restaurant_stats?.total_restaurants || 0}
                  </div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats?.user_counts?.reduce((sum, user) => sum + user.count, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <Button
                  onClick={() => window.location.href = '/admin/orders'}
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
                      No orders have been placed yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map(order => (
                          <tr key={order.id}>
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {order.customer_name}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(order.total_price)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Top Restaurants */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Top Restaurants</h2>
                <Button
                  onClick={() => window.location.href = '/admin/restaurants'}
                  variant="outline"
                  size="sm"
                >
                  View All
                </Button>
              </Card.Header>
              
              <Card.Body>
                {topRestaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants</h3>
                    <p className="mt-1 text-gray-500">
                      No restaurants registered yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topRestaurants.map((restaurant, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">
                              {restaurant.order_count} orders
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(restaurant.revenue || 0)}</div>
                          <div className="text-sm text-gray-500">
                            {restaurant.avg_rating ? `${restaurant.avg_rating.toFixed(1)} ★` : 'No rating'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* User Statistics */}
          <Card className="mt-8">
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">User Statistics</h2>
            </Card.Header>
            
            <Card.Body>
              {stats?.user_counts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.user_counts.map(userCount => (
                    <div key={userCount.role} className="text-center">
                      <div className="text-2xl font-bold">{userCount.count}</div>
                      <div className="text-sm text-gray-600 capitalize">{userCount.role}s</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No user statistics available</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Order Status Statistics */}
          <Card className="mt-8">
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">Order Status Distribution</h2>
            </Card.Header>
            
            <Card.Body>
              {stats?.order_status_counts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.order_status_counts.map(statusCount => (
                    <div key={statusCount.status} className="text-center">
                      <div className="text-2xl font-bold">{statusCount.count}</div>
                      <div className="text-sm text-gray-600 capitalize">{statusCount.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No order status statistics available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;