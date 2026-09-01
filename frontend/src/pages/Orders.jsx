import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Orders() {
  const { token } = useAuthStore()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setOrders(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [token])

  if (!token) {
    return (
      <div className="text-center py-20">
        Please login to view your orders.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading orders...
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">
          No orders found.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between">
                <span className="font-bold">
                  Order #{order._id}
                </span>

                <span className="font-bold text-indigo-600">
                  ${order.total}
                </span>
              </div>

              <p className="text-gray-600 mt-2">
                Status: {order.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}