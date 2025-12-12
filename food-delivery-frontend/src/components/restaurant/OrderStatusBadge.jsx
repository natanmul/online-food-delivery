import React from 'react';
import { getStatusColor, getStatusText } from '../../utils/helpers.js';

const OrderStatusBadge = ({ status, onStatusChange, disabled = false }) => {
  const handleChange = (e) => {
    if (onStatusChange) {
      onStatusChange(e.target.value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
      
      {onStatusChange && (
        <select
          value={status}
          onChange={handleChange}
          disabled={disabled}
          className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )}
    </div>
  );
};

export default OrderStatusBadge;