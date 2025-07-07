"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const BorrowingHistoryForm = ({ userId }) => {
  const [borrowingHistory, setBorrowingHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBorrowingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/${userId}/borrowing-history`)
        setBorrowingHistory(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching borrowing history:", err)
        setError("Failed to fetch borrowing history")
        setLoading(false)
      }
    }

    fetchBorrowingHistory()
  }, [userId])

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Borrowing History</h1>
        </div>
        <div className="form-card">
          <p className="text-center">Loading borrowing history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>Borrowing History</h1>
        </div>
        <div className="form-card">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Borrowing History</h1>
      </div>
      <div className="form-card">
        {borrowingHistory.length === 0 ? (
          <p className="text-center">You don't have any borrowing history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#E0D7C7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Book Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowingHistory.map((item) => (
                  <tr key={item.BorrowingID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.Title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.BorrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ReturnDate ? new Date(item.ReturnDate).toLocaleDateString() : "Not returned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.Status === "Returned" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.Status}
                      </span>
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

export default BorrowingHistoryForm
