import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useCartStore()

  const navigate = useNavigate()

  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">
          Your Cart is Empty
        </h1>

        <p className="text-gray-600 mb-8">
          You haven't added any books yet.
        </p>

        <Link
          to="/books"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Browse Books
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="space-y-4">

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >

            <div>
              <h2 className="text-xl font-bold">
                {item.title}
              </h2>

              <p className="text-gray-600">
                {item.author}
              </p>

              <p className="text-indigo-600 font-bold mt-2">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  decreaseQuantity(item._id)
                }
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>

              <span className="font-bold min-w-[30px] text-center">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(item._id)
                }
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() =>
                  removeFromCart(item._id)
                }
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>
        ))}

      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <div className="flex justify-between text-xl font-bold mb-6">
          <span>Total</span>

          <span>
            ${Number(total).toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>

      </div>

    </div>
  )
}