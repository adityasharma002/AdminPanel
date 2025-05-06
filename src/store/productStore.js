import { create } from 'zustand';

const useProductStore = create((set) => ({
  allProducts: {},
  setAllProducts: (newMap) => set({ allProducts: newMap }),
  updateCategoryProducts: (categoryId, updatedProducts) =>
    set((state) => ({
      allProducts: {
        ...state.allProducts,
        [categoryId]: updatedProducts,
      },
    })),
}));

export default useProductStore;
