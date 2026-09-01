import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { Plus, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Admin() {
  const { token, user } = useAuthStore()
  const [books, setBooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {

      const res = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBooks(res.data)
    } catch (err) {
      toast.error('Failed to load books')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('No token found! Please login again.')
      return
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      if (editingBook) {
        await axios.put(`/api/books/${editingBook._id}`, formData, config)
        toast.success('Book updated!')
      } else {
        await axios.post('/api/books', formData, config)
        toast.success('Book added!')
      }

      setShowForm(false)
      setEditingBook(null)
      setFormData({ title: '', author: '', description: '', price: '', category: '', stock: '' })
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await axios.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Book deleted!')
      fetchBooks()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = (book) => {
    setEditingBook(book)

    setFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price ?? '',
      category: book.category || '',
      stock: book.stock ?? '',
    })

    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingBook(null)
            setFormData({ title: '', author: '', description: '', price: '', category: '', stock: '' })
          }}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {/* Show token status for debugging
      <div className="bg-yellow-100 p-2 rounded text-sm">
        Token: {token ? '✅ Present' : '❌ Missing'} | 
        User: {user?.username || 'None'} | 
        Role: {user?.role || 'None'}
      </div> */}

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 border rounded-xl"
            />
            <input
              placeholder="Author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="px-4 py-3 border rounded-xl"
            />
            <input
              placeholder="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-3 border rounded-xl"
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-3 border rounded-xl"
            />
            <input
              placeholder="Stock"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="px-4 py-3 border rounded-xl"
            />
            <textarea
              placeholder="Description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-3 border rounded-xl md:col-span-2"
              rows={3}
            />
            <button
              type="submit"
              className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
            >
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Author</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book._id}>
                <td className="px-6 py-4">{book.title}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-sm">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4">${book.price}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}