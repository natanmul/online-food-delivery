import React from 'react';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/helpers.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        {item.description && (
          <p className="text-gray-600 text-sm mt-1 truncate">{item.description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="text-right min-w-20">
          <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
          <div className="text-sm text-gray-500">{formatCurrency(item.price)} each</div>
        </div>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;