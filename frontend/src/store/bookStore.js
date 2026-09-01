import { create } from 'zustand'

export const useBookStore = create((set) => ({
  books: [],
  categories: [],
  searchQuery: '',
  selectedCategory: '',
  setBooks: (books) => set({ books }),
  setCategories: (categories) => set({ categories }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}))