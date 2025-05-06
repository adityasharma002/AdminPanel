import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  recentOrders: [
    {
      id: '#ORD001',
      product: 'Milk 2L',
      deliveryBoy: 'Rahul',
      status: 'Delivered',
      date: '2025-04-25',
    },
    {
      id: '#ORD002',
      product: 'Tomatoes 5kg',
      deliveryBoy: 'Amit',
      status: 'Pending',
      date: '2025-04-26',
    },
    {
      id: '#ORD003',
      product: 'Paneer 1kg',
      deliveryBoy: 'Karan',
      status: 'Delivered',
      date: '2025-04-27',
    },
  ],

  // Optional: If you want to add new orders dynamically in future
  addOrder: (order) =>
    set((state) => ({
      recentOrders: [order, ...state.recentOrders],
    })),
}));

export default useDashboardStore;
