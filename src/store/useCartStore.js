import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          cart: [...state.cart, { ...product, quantity: 1 }],
        };
      }
    }),
  updateQuantity: (id, change) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            if (newQty > 0) {
              return { ...item, quantity: newQty };
            }
            return null;
          }
          return item;
        })
        .filter(Boolean); // Remove items with null (quantity 0 or less)

      return { cart: updatedCart };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));

export default useCartStore;
