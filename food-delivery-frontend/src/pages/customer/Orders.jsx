import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api/orders.js';
import OrderCard from '../../components/customer/OrderCard.jsx';
import Loader, { PageLoader } from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await orderService.getMyOrders();
      
      if (response.success) {
        setOrders(response.data);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('An error occurred while loading orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (search && !order.restaurant_name?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading && !orders.length) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage your food orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">{getStatusCount('delivered')}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">{getStatusCount('preparing') + getStatusCount('ready') + getStatusCount('on_the_way')}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-red-600">{getStatusCount('cancelled')}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search by restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="on_the_way">On the way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={fetchOrders}
              loading={loading}
              className="flex-1"
            >
              Refresh
            </Button>
            <Button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
              }}
              variant="outline"
              className="flex-1"
              disabled={!search && !statusFilter}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert type="error" className="mb-6">
          {error}
          <Button
            onClick={fetchOrders}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            Try Again
          </Button>
        </Alert>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader text="Loading orders..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">
            {orders.length === 0 
              ? "You haven't placed any orders yet." 
              : "No orders match your filters."}
          </p>
          {orders.length === 0 && (
            <Button
              onClick={() => window.location.href = '/restaurants'}
              className="mt-4"
            >
              Order Now
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Orders;