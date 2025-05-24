import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_URL = 'https://logistic-project-backend.onrender.com/api/customer';

const useCustomerStore = create((set) => ({
  customers: [],

  fetchCustomers: async () => {
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ customers: res.data });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  },

  addCustomer: async (customerData) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.post(API_URL, {
        customerName: customerData.name,
        email: customerData.email,
        contactNumber: customerData.phone,
        address: customerData.address,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optionally re-fetch or just add
      set((state) => ({
        customers: [...state.customers, res.data],
      }));
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  },

  updateCustomer: async (id, updatedData) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.put(`${API_URL}/${id}`, {
        customerName: updatedData.name,
        email: updatedData.email,
        contactNumber: updatedData.phone,
        address: updatedData.address,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? res.data : c
        ),
      }));
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  },

  deleteCustomer: async (id) => {
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  },
}));

export default useCustomerStore;
