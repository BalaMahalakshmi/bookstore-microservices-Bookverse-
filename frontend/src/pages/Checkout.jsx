import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const total = getTotal()

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login before checkout')
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      // TEMPORARY
      // Real order API will be connected after order-service is implemented.

      console.log({
        items,
        total,
        address,
      })

      toast.success(
        'Checkout UI is working. Order API is the next backend step.'
      )

      // DO NOT clear cart yet.
      // We only clear after backend confirms order creation.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handleCheckout}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >
        <div>
          <label className="block font-medium mb-2">
            Delivery Address
          </label>

          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-xl p-3"
            rows={4}
            placeholder="Enter your delivery address"
          />
        </div>

        <div className="border-t pt-5">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}