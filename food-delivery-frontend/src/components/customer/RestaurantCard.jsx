import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getRatingStars } from '../../utils/helpers.js';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={restaurant.image_url || '/restaurant-placeholder.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.avg_rating > 0 && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="font-semibold">
              {typeof restaurant.avg_rating === 'number' 
                ? restaurant.avg_rating.toFixed(1) 
                : Number(restaurant.avg_rating || 0).toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{restaurant.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-2 truncate">{restaurant.location}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{restaurant.distance || 'N/A'} miles</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {restaurant.avg_rating > 0 ? (
                  <div className="flex items-center">
                    {getRatingStars(restaurant.avg_rating).map(star => (
                      <svg
                        key={star.id}
                        className={`w-4 h-4 ${star.className}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))} 
                   <span className="ml-1 text-sm text-gray-600">
                  ({restaurant.review_count || 0})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No reviews yet</span>
            )}
          </div>
          
          <div className="text-sm font-medium">
            <span className="text-gray-500">•</span>
            <span className="ml-1">{restaurant.cuisine_type || 'Various'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;