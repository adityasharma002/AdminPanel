import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCategoriesStore = create(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: (newCategory) => {
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },
    }),
    {
      name: 'categories_data', // Key for localStorage
    }
  )
);

export default useCategoriesStore;
