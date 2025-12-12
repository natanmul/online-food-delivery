import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantService } from '../../services/api/restaurants.js';
import { menuService } from '../../services/api/menu.js';
import { getRatingStars, formatCurrency } from '../../utils/helpers.js';
import MenuItemCard from '../../components/customer/MenuItemCard.jsx';
import Loader, { PageLoader } from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantService.getRestaurant(id),
        menuService.getMenuItems(id)
      ]);
      
      if (restaurantRes.success) {
        setRestaurant(restaurantRes.data);
      } else {
        setError('Failed to load restaurant details');
      }
      
      if (menuRes.success) {
        setMenuItems(menuRes.data);
      }
    } catch (err) {
      setError('An error occurred while loading restaurant details');
      console.error('Error fetching restaurant details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !restaurant) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert type="error">
          {error}
          <Button
            onClick={fetchRestaurantDetails}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Restaurant not found</h3>
          <p className="mt-1 text-gray-500">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <img
              src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}
              alt={restaurant.name}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                <div className="flex items-center mb-4">
                  {restaurant.avg_rating > 0 ? (
                    <>
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
                        <span className="ml-2 font-medium">
                          {Number(restaurant.avg_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">
                        {restaurant.review_count || 0} reviews
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No reviews yet</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{restaurant.location}</span>
              </div>
              
              {restaurant.phone && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{restaurant.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Open • Closes at 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menu'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({restaurant.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Info
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <span className="text-gray-600">
                {menuItems.length} items available
              </span>
            </div>
            
            {menuItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No menu items available</h3>
                <p className="mt-1 text-gray-500">
                  This restaurant hasn't added any menu items yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {menuItems.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <Button variant="outline" size="sm">
                Write a Review
              </Button>
            </div>
            
            {restaurant.reviews?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-gray-500">
                  Be the first to review this restaurant!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {restaurant.reviews?.map(review => (
                  <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{review.user_name}</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {getRatingStars(review.rating).map(star => (
                              <svg
                                key={star.id}
                                className={`w-4 h-4 ${star.className}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{restaurant.location}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Hours of Operation</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>9:00 AM - 11:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">
                {restaurant.description || 'No description available.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;