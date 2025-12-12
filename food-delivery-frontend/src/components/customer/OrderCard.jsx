import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../utils/helpers.js';
import { ORDER_STATUS } from '../../utils/constants.js';

const OrderCard = ({ order }) => {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
          <p className="text-gray-600 text-sm">
            {order.restaurant_name || 'Restaurant'}
          </p>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Order Date</p>
          <p className="font-medium">{formatDate(order.created_at)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold text-lg">{formatCurrency(order.total_price)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Items</p>
          <p className="font-medium">
            {order.items?.length || 0} items
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">
              {order.status === ORDER_STATUS.DELIVERED
                ? `Delivered on ${formatDate(order.updated_at)}`
                : `Placed on ${formatDate(order.created_at)}`
              }
            </span>
          </div>

          <span className="text-blue-600 font-medium hover:text-blue-800">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;