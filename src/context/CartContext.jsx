import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartItemCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const cartData = await cartAPI.getCart();
      setCart(cartData);
      // Calculate total quantity of all items
      const totalQuantity = cartData.items ? cartData.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartItemCount(totalQuantity);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Initialize with empty cart if fetch fails
      setCart({ items: [] });
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('برای افزودن به سبد خرید ابتدا وارد شوید');
    }

    try {
      const response = await cartAPI.addToCart(productId, quantity);
      // Extract cart data from response (backend returns { message, cart })
      const updatedCart = response.cart || response;
      setCart(updatedCart);
      // Calculate total quantity of all items
      const totalQuantity = updatedCart.items ? updatedCart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartItemCount(totalQuantity);
      return updatedCart;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      // Extract cart data from response (backend returns { message, cart })
      const updatedCart = response.cart || response;
      setCart(updatedCart);
      // Calculate total quantity of all items
      const totalQuantity = updatedCart.items ? updatedCart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartItemCount(totalQuantity);
      return updatedCart;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.removeFromCart(itemId);
      // Extract cart data from response (backend returns { message, cart })
      const updatedCart = response.cart || response;
      setCart(updatedCart);
      // Calculate total quantity of all items
      const totalQuantity = updatedCart.items ? updatedCart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      setCartItemCount(totalQuantity);
      return updatedCart;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await cartAPI.clearCart();
      // Extract cart data from response (backend returns { message, cart })
      const updatedCart = response.cart || response;
      setCart(updatedCart);
      setCartItemCount(0);
      return updatedCart;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const value = {
    cart,
    cartItemCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 