import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/api/restaurants.js';
import RestaurantCard from '../../components/customer/RestaurantCard.jsx';
import Loader, { PageLoader } from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (search) params.search = search;
      if (ratingFilter) params.rating = ratingFilter;
      
      const response = await restaurantService.getAllRestaurants(params);
      
      if (response.success) {
        const sorted = sortRestaurants(response.data, sortBy);
        setRestaurants(sorted);
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

  const sortRestaurants = (data, sortType) => {
    const sorted = [...data];
    switch (sortType) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return sorted.sort((a, b) => b.avg_rating - a.avg_rating);
      case 'reviews':
        return sorted.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
      default:
        return sorted;
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const sorted = sortRestaurants(restaurants, value);
    setRestaurants(sorted);
  };

  const handleFilter = () => {
    fetchRestaurants();
  };

  const clearFilters = () => {
    setSearch('');
    setRatingFilter('');
    setSortBy('name');
    fetchRestaurants();
  };

  if (loading && !restaurants.length) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Restaurants
        </h1>
        <p className="text-gray-600">
          Find your favorite restaurants and discover new ones
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleFilter}
              loading={loading}
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert type="error" className="mb-6">
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
      )}

      {/* Restaurants Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader text="Loading restaurants..." />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={clearFilters}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {restaurants.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={fetchRestaurants}
            variant="outline"
            loading={loading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;