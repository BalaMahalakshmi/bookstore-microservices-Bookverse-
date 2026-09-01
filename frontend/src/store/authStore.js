import { create } from 'zustand'

const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')

export const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)

    set({
      user,
      token,
    })
  },

  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    set({
      user: null,
      token: null,
    })
  },
}))