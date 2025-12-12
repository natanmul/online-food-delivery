import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/helpers.js';
import Button from '../ui/Button.jsx';

const MenuItemCard = ({ item, restaurant }) => {
  const { addToCart, isSameRestaurant } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isSameRestaurant(restaurant.id) && restaurant.id) {
      if (!window.confirm('Adding this item will clear your current cart. Continue?')) {
        return;
      }
    }

    setAdding(true);
    try {
      await addToCart({
        ...item,
        quantity,
        restaurant_id: restaurant.id
      }, restaurant);
      
      // Show success feedback
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex">
        {item.image_url && (
          <div className="w-24 h-24 flex-shrink-0 mr-4">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              )}
            </div>
            <span className="font-bold text-lg">{formatCurrency(item.price)}</span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="w-12 text-center font-medium">{quantity}</span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              loading={adding}
              size="sm"
              disabled={!item.availability}
            >
              {item.availability ? 'Add to Cart' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;