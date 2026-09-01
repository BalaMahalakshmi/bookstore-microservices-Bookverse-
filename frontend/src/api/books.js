import axios from 'axios'

export const getBooks = async (params = {}) => {
  const response = await axios.get('/api/books', {
    params,
  })

  return response.data
}

export const getBook = async (id) => {
  const response = await axios.get(`/api/books/${id}`)
  return response.data
}

export const getCategories = async () => {
  const response = await axios.get('/api/books/categories')
  return response.data
}

export const createBook = async (book, token) => {
  const response = await axios.post('/api/books', book, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const updateBook = async (id, book, token) => {
  const response = await axios.put(`/api/books/${id}`, book, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const deleteBook = async (id, token) => {
  await axios.delete(`/api/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}