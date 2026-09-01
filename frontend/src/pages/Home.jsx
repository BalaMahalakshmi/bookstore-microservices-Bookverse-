import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Next <span className="text-indigo-600">Great Read</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore thousands of books across multiple categories. Find your perfect match today.
        </p>
        <Link
          to="/books"
          className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Books
          <ArrowRight size={20} className="ml-2" />
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <BookOpen className="mx-auto text-indigo-600 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Large Book Collection</h3>
          <p className="text-gray-600">Extensive collection across all genres</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <Search className="mx-auto text-indigo-600 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Smart Search</h3>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <Users className="mx-auto text-indigo-600 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Community</h3>
          <p className="text-gray-600">Join thousands of book lovers</p>
        </div>
      </section>
    </div>
  )
}