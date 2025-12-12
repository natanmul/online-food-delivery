import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import Button from '../ui/Button.jsx';

const DeliveryCard = ({ delivery, onAccept, onReject, onComplete, isHistory = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{delivery.order_id}</h3>
          <p className="text-gray-600">
            From: {delivery.restaurant_name}
          </p>
          <p className="text-gray-600">
            To: {delivery.customer_name}
          </p>
        </div>
        
        <div className="mt-2 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {delivery.status === 'pending' ? 'Waiting' : 
             delivery.status === 'accepted' ? 'Accepted' :
             delivery.status === 'completed' ? 'Completed' : 'Rejected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Restaurant Location</p>
          <p className="font-medium">{delivery.restaurant_location}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Customer Address</p>
          <p className="font-medium">{delivery.customer_address}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Customer Phone</p>
          <p className="font-medium">{delivery.customer_phone}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="font-bold text-lg">{formatCurrency(delivery.total_price)}</p>
        </div>
      </div>
      
      {!isHistory && (
        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            {delivery.status === 'pending' && (
              <>
                <Button
                  onClick={() => onAccept(delivery.id)}
                  variant="success"
                  className="flex-1"
                >
                  Accept Delivery
                </Button>
                
                <Button
                  onClick={() => onReject(delivery.id)}
                  variant="danger"
                  className="flex-1"
                >
                  Reject
                </Button>
              </>
            )}
            
            {delivery.status === 'accepted' && delivery.order_status === 'on_the_way' && (
              <Button
                onClick={() => onComplete(delivery.order_id)}
                variant="success"
                className="flex-1"
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isHistory 
            ? `Completed on ${formatDate(delivery.completed_at || delivery.assigned_at)}`
            : `Requested on ${formatDate(delivery.assigned_at)}`
          }
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;