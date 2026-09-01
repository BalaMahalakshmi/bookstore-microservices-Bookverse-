import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  LogIn,
  LogOut,
  User,
  Shield,
  ShoppingCart,
  Package,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const itemCount = useCartStore(
    (state) => state.getItemCount()
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600">
            <BookOpen size={28} />
            <span className="text-xl font-bold">BookStore</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/books" className="text-gray-700 hover:text-indigo-600">
              Books
            </Link>

            <Link
              to="/cart"
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <ShoppingCart size={18} className="mr-1" />
              Cart
              {itemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>

            {user && (
              <Link
                to="/orders"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Package size={18} className="mr-1" />
                Orders
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center text-gray-700 hover:text-indigo-600">
                <Shield size={18} className="mr-1" />
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-gray-700">
                  <User size={18} className="mr-1" />
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <LogIn size={18} className="mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}