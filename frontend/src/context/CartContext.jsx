import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.cart.items);
      setCartCount(response.cart.itemCount);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      // Optimistic update
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

      await cartService.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh to get updated totals
      return { success: true };
    } catch (error) {
      console.error('Failed to update quantity:', error);
      await fetchCart(); // Revert on error
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Optimistic update
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setCartCount((prev) => prev - 1);

      await cartService.removeFromCart(itemId);
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      await fetchCart(); // Revert on error
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartCount(0);
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * parseInt(item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
