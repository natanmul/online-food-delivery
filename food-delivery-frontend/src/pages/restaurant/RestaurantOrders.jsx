import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api/orders.js';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../utils/helpers.js';
import Sidebar from '../../components/layout/Sidebar.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, { status: newStatus });
      
      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (search && !order.customer_name?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    if (dateFilter) {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      return orderDate === dateFilter;
    }
    return true;
  });

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loader text="Loading orders..." />
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
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Orders</h1>
            <p className="text-gray-600">
              Manage and track all orders from your restaurant
            </p>
          </div>

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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getStatusCount('accepted') + getStatusCount('preparing')}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-green-600">{getStatusCount('ready')}</div>
                <div className="text-sm text-gray-600">Ready</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-red-600">{getStatusCount('cancelled')}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </Card.Body>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search by customer..."
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
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
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
                      setDateFilter('');
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={!search && !statusFilter && !dateFilter}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Orders Table */}
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Orders</h2>
              <span className="text-sm text-gray-600">
                {filteredOrders.length} orders found
              </span>
            </Card.Header>
            
            <Card.Body>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-gray-500">
                    {orders.length === 0 
                      ? "You haven't received any orders yet." 
                      : "No orders match your filters."}
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
                          Items
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
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              #{order.id}
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              {order.customer_phone && (
                                <div className="text-sm text-gray-500">{order.customer_phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.items?.length || 0} items
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
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
                            <div className="flex items-center space-x-2">
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
                              
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Order Details Modal */}
          <Modal
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title={`Order #${selectedOrder?.id}`}
            size="lg"
          >
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                      <p className="mt-1 font-medium">{selectedOrder.customer_name}</p>
                      {selectedOrder.customer_phone && (
                        <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Order Type</h4>
                      <p className="mt-1 font-medium capitalize">{selectedOrder.type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-1">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                      <p className="mt-1 font-bold text-lg">{formatCurrency(selectedOrder.total_price)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                    <p className="mt-1">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <div>
                          <div className="font-medium">{item.quantity}x {item.item_name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-600">{item.description}</div>
                          )}
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // Mark as ready
                      handleStatusUpdate(selectedOrder.id, 'ready');
                    }}
                    disabled={selectedOrder.status === 'ready' || selectedOrder.status === 'cancelled'}
                  >
                    Mark as Ready
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrders;