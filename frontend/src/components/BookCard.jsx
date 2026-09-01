import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
        <span className="text-white text-6xl">📚</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            {book.category}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-sm">{book.rating || 4.5}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">${book.price}</span>
          <Link
            to={`/books/${book._id}`}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}