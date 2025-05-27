import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_BASE = 'https://logistic-project-backend.onrender.com/api/cart';

const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  // Helper function to normalize cart items
  normalizeCartItem: (item) => ({
  id: item.productId || item.id,
  cartItemId: item.cartItemId,
  productId: item.productId || item.id,
  name: item.Product?.productName || item.productName || item.name || 'Unknown Product',
  productName: item.Product?.productName || item.productName || item.name || 'Unknown Product',
  price: Number(item.Product?.price) || Number(item.price) || 0,
  quantity: Number(item.quantity) || 1,
  image: item.image || null,
  description: item.description || ''
}),



  // 1. GET all cart items
  getCartItems: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn('No token found for getCartItems');
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(`${API_BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      // Normalize and deduplicate cart items
      const rawCart = response.data || [];
      const normalizedCart = rawCart.map(item => get().normalizeCartItem(item));
      
      // Remove duplicates based on productId
      const uniqueCart = normalizedCart.reduce((acc, item) => {
        const existingIndex = acc.findIndex(existing => existing.productId === item.productId);
        if (existingIndex >= 0) {
          // If duplicate found, keep the one with higher quantity
          if (item.quantity > acc[existingIndex].quantity) {
            acc[existingIndex] = item;
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
     
      set({ cart: uniqueCart, isLoading: false });
    } catch (error) {
      console.error('Get cart items failed:', error.response?.data || error.message);
      set({ cart: [], isLoading: false, error: error.message });
    }
  },

  // 2. POST add to cart
    addToCart: async (product) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    console.error('No token found for addToCart');
    return;
  }

  set({ error: null });

  try {
    const response = await axios.post(
      `${API_BASE}/add`,
      {
        productId: product.productId,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newCartItemFromServer = response.data;

    const currentCart = get().cart;
    const existingItemIndex = currentCart.findIndex(
      item => item.productId === product.productId
    );

    const normalizedItem = get().normalizeCartItem(newCartItemFromServer);

    if (existingItemIndex >= 0) {
      // Update existing item with correct cartItemId
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        cartItemId: normalizedItem.cartItemId, // ✅ add this
      };
      set({ cart: updatedCart });
    } else {
      // Add new item from server response
      set({ cart: [...currentCart, normalizedItem] });
    }

    console.log('Added to cart successfully:', product.productName);
  } catch (error) {
    console.error('Add to cart failed:', error.response?.data || error.message);
    set({ error: error.message });
  }

  await get().getCartItems(); // ⬅️ force a sync from backend

},


  // 3. PUT/POST update cart item quantity
  updateQuantity: async (productId, change) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.error('No token found for updateQuantity');
      return;
    }

    const currentCart = get().cart;
    const currentItem = currentCart.find(item => item.productId === productId);
    
    if (!currentItem) {
      console.warn('Item not found in cart:', productId);
      return;
    }

    const newQty = currentItem.quantity + change;

    if (newQty < 1) {
      // Remove item if quantity becomes less than 1
      await get().removeFromCart(productId);
      return;
    }

    // Optimistically update local state first
    const updatedCart = currentCart.map(item =>
      item.productId === productId 
        ? { ...item, quantity: newQty }
        : item
    );
    set({ cart: updatedCart, error: null });

    try {
      // Try different possible endpoints
      let response;
      try {
        // First try PUT method
        response = await axios.put(
          `${API_BASE}/update`,
          {
            productId: productId,
            quantity: newQty,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (putError) {
        console.warn('PUT update failed, trying POST:', putError.message);
        // If PUT fails, try POST
        response = await axios.post(
          `${API_BASE}/update`,
          {
            productId: productId,
            quantity: newQty,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log('Updated quantity successfully:', productId, newQty);
    } catch (error) {
      console.error('Update quantity failed:', error.response?.data || error.message);
      
      // Revert the optimistic update on failure
      set({ 
        cart: currentCart,
        error: 'Failed to update quantity. Please try again.'
      });
    }
  },

  // 4. DELETE remove cart item
removeFromCart: async (productId) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    console.error('No token found for removeFromCart');
    return;
  }

  const currentCart = get().cart;

  // ✅ Find the cart item to remove using productId
  const itemToRemove = currentCart.find(item => item.productId === productId);

  if (!itemToRemove || !itemToRemove.cartItemId) {
    console.error('cartItemId not found for productId:', productId);
    set({ error: 'Unable to remove item. Missing cartItemId.' });
    return;
  }

  const cartItemId = itemToRemove.cartItemId;

  // ✅ Optimistically update local state
  const updatedCart = currentCart.filter(item => item.productId !== productId);
  set({ cart: updatedCart, error: null });

  try {
    await axios.delete(`${API_BASE}/remove/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Removed from cart successfully:', cartItemId);
  } catch (error) {
    console.error('Remove from cart failed:', error.response?.data || error.message);

    // ❌ Revert on failure
    set({ 
      cart: currentCart,
      error: 'Failed to remove item. Please try again.'
    });
  }
},


  // 5. POST clear cart
  clearCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.error('No token found for clearCart');
      return;
    }

    set({ error: null });

    try {
      await axios.post(
        `${API_BASE}/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ cart: [] });
      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Clear cart failed:', error.response?.data || error.message);
      // Still clear local cart even if API fails
      set({ cart: [], error: 'Cart cleared locally, but server sync failed' });
    }
  },

  // Helper function to get quantity for a specific product
  getItemQuantity: (productId) => {
    const item = get().cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  },

  // Helper function to check if item is in cart
  isInCart: (productId) => {
    return get().cart.some(item => item.productId === productId);
  },

  // Helper function to set cart directly (for local updates)
  setCart: (cart) => set({ cart: cart.map(item => get().normalizeCartItem(item)) }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useCartStore;