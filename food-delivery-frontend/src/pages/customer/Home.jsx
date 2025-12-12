import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/api/restaurants.js';
import RestaurantCard from '../../components/customer/RestaurantCard.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [search, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await restaurantService.getAllRestaurants();
      
      if (response.success) {
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } else {
        setError('Failed to load restaurants');
      }
    } catch (err) {
      setError('An error occurred while loading restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Delicious food delivered to your doorstep
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Order from your favorite local restaurants and get it delivered fresh and hot.
            Join thousands of satisfied customers today!
          </p>
          <div className="mt-10">
            <Link
              to="/restaurants"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search restaurants by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSearch('')}
                disabled={!search}
              >
                Clear
              </Button>
              <Button
                onClick={fetchRestaurants}
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular Restaurants
          </h2>
          <Link
            to="/restaurants"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Loading restaurants..." />
          </div>
        ) : error ? (
          <Alert type="error">
            {error}
            <Button
              onClick={fetchRestaurants}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Try Again
            </Button>
          </Alert>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
            <p className="mt-1 text-gray-500">
              {search ? 'Try adjusting your search terms' : 'No restaurants available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.slice(0, 6).map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-600">
              We make food delivery simple, fast, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fast Delivery</h3>
              <p className="mt-2 text-gray-600">
                Get your food delivered in 30 minutes or less
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fresh Food</h3>
              <p className="mt-2 text-gray-600">
                Quality ingredients from trusted local restaurants
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Easy Payment</h3>
              <p className="mt-2 text-gray-600">
                Multiple payment options for your convenience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;