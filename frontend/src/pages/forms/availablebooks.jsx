"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "../../index.css"

const AvailableBooksForm = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/books/available")
        // Filter books to only show those with available copies > 0
        const availableBooks = Array.isArray(res.data) ? res.data.filter((book) => book.AvailableCopies > 0) : []
        setBooks(availableBooks)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching available books:", err)
        setError("Failed to fetch available books")
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Library Management System</h1>
        </div>
        <div className="form-card">
          <h2>Available Books</h2>
          <p className="text-center">Loading available books...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>Library Management System</h1>
        </div>
        <div className="form-card">
          <h2>Available Books</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Library Management System</h1>
      </div>
      <div className="form-card">
        <h2>Available Books</h2>
        {books.length === 0 ? (
          <p className="text-center">No available books.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#E0D7C7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Available
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.BookID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.Title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.AuthorName || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.CategoryName || "Uncategorized"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.PublishYear || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.AvailableCopies}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AvailableBooksForm
