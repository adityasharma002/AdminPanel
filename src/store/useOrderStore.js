import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [
        {
          id: "#ORD001",
          customerName: "Rahul Sharma",
          address: "123 Main St",
          deliveryDate: "2025-04-25",
          totalAmount: 450,
          paymentStatus: "Paid",
          orderDate: "2025-04-24",
          products: [{ name: "Milk 2L", quantity: 2 }],
          deliveryBoy: "Rahul",
          status: "Delivered",
        },
        {
          id: "#ORD002",
          customerName: "Priya Mehta",
          address: "45 Park Ave",
          deliveryDate: "2025-04-26",
          totalAmount: 300,
          paymentStatus: "COD",
          orderDate: "2025-04-25",
          products: [{ name: "Tomatoes 5kg", quantity: 1 }],
          deliveryBoy: "Amit",
          status: "Pending",
        },
        {
          id: "#ORD003",
          customerName: "Karan Verma",
          address: "22 Link Rd",
          deliveryDate: "2025-04-27",
          totalAmount: 750,
          paymentStatus: "Paid",
          orderDate: "2025-04-26",
          products: [
            { name: "Onion 3kg", quantity: 1 },
            { name: "Potato 2kg", quantity: 1 },
          ],
          deliveryBoy: "",
          status: "Pending",
        },
      ],

      filterStatus: "",
      searchQuery: "",
      sortKey: "",
      sortAsc: true,

      setFilterStatus: (status) => set({ filterStatus: status }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      setSort: (key) => {
        const { sortKey, sortAsc } = get();
        set({
          sortKey: key,
          sortAsc: sortKey === key ? !sortAsc : true,
        });
      },
      getRecentOrders: () => {
        const state = get();
        const sorted = [...state.orders].sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        return sorted.slice(0, 5);
      },
      
      updateStatus: (orderId, newStatus) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        })),

      assignDeliveryBoy: (orderId, agentName) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, deliveryBoy: agentName } : o
          ),
        })),

      getFilteredSortedOrders: (state) => {
        let orders = [...state.orders];

        if (state.filterStatus) {
          orders = orders.filter((o) => o.status === state.filterStatus);
        }

        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          orders = orders.filter(
            (o) =>
              o.customerName.toLowerCase().includes(q) ||
              o.deliveryBoy?.toLowerCase().includes(q) ||
              o.id.toLowerCase().includes(q)
          );
        }

        if (state.sortKey) {
          orders.sort((a, b) => {
            const aValue = a[state.sortKey];
            const bValue = b[state.sortKey];

            if (typeof aValue === "string" && typeof bValue === "string") {
              return state.sortAsc
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            } else if (
              typeof aValue === "number" &&
              typeof bValue === "number"
            ) {
              return state.sortAsc ? aValue - bValue : bValue - aValue;
            } else {
              return 0;
            }
          });
        }

        

        return orders;
      },
    }),
    {
      name: "order-store", // localStorage key
    }
  )
);

export default useOrderStore;
