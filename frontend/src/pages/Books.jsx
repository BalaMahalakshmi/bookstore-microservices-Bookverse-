import { useEffect, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import axios from 'axios'
import BookCard from '../components/BookCard'
import { useBookStore } from '../store/bookStore'

export default function Books() {
  const { books, categories, searchQuery, selectedCategory, setBooks, setCategories, setSearchQuery, setSelectedCategory } = useBookStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/books')
      setBooks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/books/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No books found matching your criteria.
        </div>
      )}
    </div>
  )
}