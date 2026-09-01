import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'


export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  const addToCart = useCartStore(
    (state) => state.addToCart
  )

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${id}`)
      setBook(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!book) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/books" className="flex items-center text-gray-600 mb-6 hover:text-indigo-600">
        <ArrowLeft size={20} className="mr-2" />
        Back to Books
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-8xl">📚</span>
          </div>
          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {book.category}
              </span>
              <div className="flex items-center text-yellow-500">
                <Star size={20} fill="currentColor" />
                <span className="ml-1 font-bold">{book.rating || 4.5}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-indigo-600">${book.price}</span>
              <button
                onClick={() => {
                  addToCart(book)
                  toast.success('Book added to cart')
                }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}