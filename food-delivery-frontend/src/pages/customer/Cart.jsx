import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatCurrency } from '../../utils/helpers.js';
import CartItem from '../../components/customer/CartItem.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Card from '../../components/ui/Card.jsx';

const Cart = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (cart.length === 0) {
      return;
    }
    
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">
            Start adding items from your favorite restaurants!
          </p>
          <div className="mt-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <Button
          onClick={handleClearCart}
          variant="outline"
          size="sm"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {restaurant?.name || 'Restaurant'}
                </h2>
                <Link
                  to={`/restaurants/${restaurant?.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Restaurant →
                </Link>
              </div>
            </Card.Header>
            
            <Card.Body>
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </Card.Header>
            
            <Card.Body>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
            
            <Card.Footer>
              {!isAuthenticated && (
                <Alert type="warning" className="mb-4">
                  Please <Link to="/login" className="font-medium underline">sign in</Link> to proceed with checkout
                </Alert>
              )}
              
              <Button
                onClick={handleCheckout}
                loading={loading}
                disabled={!isAuthenticated}
                fullWidth
                size="lg"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </Button>
              
              <div className="mt-4 text-center">
                <Link
                  to="/restaurants"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Continue Shopping
                </Link>
              </div>
            </Card.Footer>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Delivery Information</h3>
            <p className="text-sm text-blue-700">
              {user?.address 
                ? `Delivery to: ${user.address}`
                : 'Please add your delivery address in your profile'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;