import { create } from 'zustand'

const savedCart = localStorage.getItem('cart')

export const useCartStore = create((set, get) => ({
  items: savedCart ? JSON.parse(savedCart) : [],

  addToCart: (book) => {
    const items = get().items

    const existingItem = items.find(
      (item) => item._id === book._id
    )

    let updatedItems

    if (existingItem) {
      updatedItems = items.map((item) =>
        item._id === book._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    } else {
      updatedItems = [
        ...items,
        {
          ...book,
          quantity: 1,
        },
      ]
    }

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedItems)
    )

    set({
      items: updatedItems,
    })
  },

  removeFromCart: (bookId) => {
    const updatedItems = get().items.filter(
      (item) => item._id !== bookId
    )

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedItems)
    )

    set({
      items: updatedItems,
    })
  },

  increaseQuantity: (bookId) => {
    const updatedItems = get().items.map((item) =>
      item._id === bookId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    )

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedItems)
    )

    set({
      items: updatedItems,
    })
  },

  decreaseQuantity: (bookId) => {
    const updatedItems = get().items
      .map((item) =>
        item._id === bookId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0)

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedItems)
    )

    set({
      items: updatedItems,
    })
  },

  clearCart: () => {
    localStorage.removeItem('cart')

    set({
      items: [],
    })
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    )
  },

  getItemCount: () => {
    return get().items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  },
}))