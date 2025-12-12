import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { orderService } from '../../services/api/orders.js';
import { formatCurrency } from '../../utils/helpers.js';
import { ORDER_TYPE, PAYMENT_METHODS } from '../../utils/constants.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Card from '../../components/ui/Card.jsx';

const Checkout = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: ORDER_TYPE.DELIVERY,
    payment_method: PAYMENT_METHODS.CASH,
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const deliveryFee = formData.type === ORDER_TYPE.DELIVERY ? 2.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = 'Order type is required';
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setErrors({ general: 'Your cart is empty' });
      return;
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const orderData = {
        restaurant_id: restaurant.id,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        })),
        type: formData.type,
        payment_method: formData.payment_method,
        notes: formData.notes || null
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        setCreatedOrder(response.data);
        setOrderSuccess(true);
        clearCart();
      } else {
        setErrors({ general: response.message || 'Failed to create order' });
      }
    } catch (err) {
      setErrors({ 
        general: err.response?.data?.message || 'An error occurred while creating order' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">
            Add items to your cart before checking out.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/restaurants')}
            >
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess && createdOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your order #{createdOrder.id} has been placed successfully.
          </p>
          
          <Card className="max-w-lg mx-auto">
            <Card.Body>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-bold">#{createdOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant:</span>
                  <span className="font-medium">{createdOrder.restaurant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-medium capitalize">{createdOrder.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(createdOrder.total_price)}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-gray-600 mb-4">
                  You can track your order status from the orders page.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate(`/orders/${createdOrder.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    View Order Details
                  </Button>
                  <Button
                    onClick={() => navigate('/orders')}
                    className="flex-1"
                  >
                    Go to My Orders
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <Button
          onClick={() => navigate('/cart')}
          variant="outline"
          size="sm"
        >
          Back to Cart
        </Button>
      </div>

      {errors.general && (
        <Alert type="error" className="mb-6">
          {errors.general}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details Form */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            </Card.Header>
            
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(ORDER_TYPE).map(([key, value]) => (
                      <div key={value} className="relative">
                        <input
                          id={`type-${value}`}
                          name="type"
                          type="radio"
                          value={value}
                          checked={formData.type === value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`type-${value}`}
                          className={`
                            flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                            ${formData.type === value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <svg className={`h-6 w-6 mb-2 ${formData.type === value ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {value === ORDER_TYPE.DELIVERY ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM12 8h.01M12 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            )}
                          </svg>
                          <span className="text-sm font-medium capitalize">
                            {value}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                      <div key={value} className="relative">
                        <input
                          id={`payment-${value}`}
                          name="payment_method"
                          type="radio"
                          value={value}
                          checked={formData.payment_method === value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`payment-${value}`}
                          className={`
                            flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer
                            ${formData.payment_method === value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="text-sm font-medium capitalize">
                            {value}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                </div>

                {/* Delivery Address */}
                {formData.type === ORDER_TYPE.DELIVERY && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{user?.address || 'No address provided'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {!user?.address && 'Please update your address in your profile'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any special requests or instructions for your order..."
                  />
                </div>
              </form>
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
                {/* Restaurant Info */}
                <div className="pb-4 border-b">
                  <h3 className="font-medium text-gray-900 mb-2">{restaurant?.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant?.location}</p>
                </div>
                
                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div>
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <div>{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {formData.type === ORDER_TYPE.DELIVERY && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
            
            <Card.Footer>
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={cart.length === 0}
                fullWidth
                size="lg"
              >
                Place Order
              </Button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                By placing this order, you agree to our terms and conditions.
              </p>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;