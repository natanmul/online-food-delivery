import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../services/storage.js';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const savedCart = storage.getItem('cart');
    const savedRestaurant = storage.getItem('cartRestaurant');
    
    if (savedCart) {
      setCart(savedCart);
    }
    if (savedRestaurant) {
      setRestaurant(savedRestaurant);
    }
  }, []);

  const saveToStorage = (cartItems, restaurantData) => {
    storage.setItem('cart', cartItems);
    if (restaurantData) {
      storage.setItem('cartRestaurant', restaurantData);
    }
  };

  const addToCart = (item, restaurantData) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id
      );

      let newCart;
      if (existingItemIndex >= 0) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
      } else {
        newCart = [...prevCart, item];
      }

      saveToStorage(newCart, restaurantData);
      setRestaurant(restaurantData);
      return newCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveToStorage(newCart, restaurant);
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== itemId);
      saveToStorage(newCart, restaurant);
      
      if (newCart.length === 0) {
        setRestaurant(null);
        storage.removeItem('cartRestaurant');
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    storage.removeItem('cart');
    storage.removeItem('cartRestaurant');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isSameRestaurant = (restaurantId) => {
    return restaurant && restaurant.id === restaurantId;
  };

  const value = {
    cart,
    restaurant,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount,
    isSameRestaurant
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };