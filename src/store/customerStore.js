import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';


const API_URL = 'https://logistic-project-backend.onrender.com/api/customer';


const useCustomerStore = create((set, get) => ({
  customers: [],

  fetchCustomers: async () => {
  try {
    const token = useAuthStore.getState().token;
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Customer API response:', res.data);

    // ✅ Use `res.data.data` instead of assuming res.data is array
    const data = Array.isArray(res.data.data)
      ? res.data.data
      : [];

    set({ customers: data });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    set({ customers: [] });
  }
},


  addCustomer: async ({ customerName, email, address, contactNumber }) => {
    try {
      const token = useAuthStore.getState().token;
      await axios.post(API_URL, {
        customerName,
        email,
        address,
        contactNumber,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      get().fetchCustomers();
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  },

  updateCustomer: async (id, { customerName, email, address, contactNumber }) => {
    try {
      const token = useAuthStore.getState().token;
      await axios.put(`${API_URL}/${id}`, {
        customerName,
        email,
        address,
        contactNumber,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      get().fetchCustomers();
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

      get().fetchCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  },
}));

export default useCustomerStore;
