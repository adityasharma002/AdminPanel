import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_BASE = 'https://logistic-project-backend.onrender.com/api/cart';

const useCartStore = create((set, get) => ({
  cart: [],

  // 1. GET all cart items
  getCartItems: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ cart: response.data || [] }); // adjust if response structure differs
    } catch (error) {
      console.error('Get cart items failed:', error.response?.data || error.message);
    }
  },

  // 2. POST add to cart
  addToCart: async (product) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      await axios.post(
        `${API_BASE}/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const existingItem = get().cart.find((item) => item.id === product.id);
      if (existingItem) {
        set({
          cart: get().cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      } else {
        set({ cart: [...get().cart, { ...product, quantity: 1 }] });
      }
    } catch (error) {
      console.error('Add to cart failed:', error.response?.data || error.message);
    }
  },

  // 3. PUT update cart item quantity
  updateQuantity: async (id, change) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const currentItem = get().cart.find((item) => item.id === id);
    if (!currentItem) return;

    const newQty = currentItem.quantity + change;
    if (newQty < 1) return;

    try {
      await axios.post(
        `${API_BASE}/update`,
        {
          productId: id,
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        cart: get().cart.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        ),
      });
    } catch (error) {
      console.error('Update quantity failed:', error.response?.data || error.message);
    }
  },

  // 4. DELETE remove cart item
  removeFromCart: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      await axios.delete(`${API_BASE}/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        cart: get().cart.filter((item) => item.id !== id),
      });
    } catch (error) {
      console.error('Remove from cart failed:', error.response?.data || error.message);
    }
  },

  // 5. POST clear cart
  clearCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

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
    } catch (error) {
      console.error('Clear cart failed:', error.response?.data || error.message);
    }
  },
}));

export default useCartStore;
