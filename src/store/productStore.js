import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = 'https://logistic-project-backend.onrender.com';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (categoryId = null) => {
    set({ loading: true });
    try {
      const url = categoryId ? `${BASE_URL}/api/products/category/${categoryId}` : `${BASE_URL}/api/products`;
      const response = await axios.get(url);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/products`, product);
      set((state) => ({
        products: [...state.products, response.data],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useProductStore;