"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "../../index.css"

function BookReviewForm({ userId }) {
  const [formData, setFormData] = useState({
    BookID: "",
    Rating: "",
    ReviewText: "",
  })

  const [books, setBooks] = useState([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  // Fetch books on load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/books/")
        console.log("Books fetched:", res.data)
        setBooks(res.data.books || res.data) // adjust according to backend structure
      } catch (err) {
        console.error("Error fetching books:", err)
        setMessage("Could not fetch books")
        setMessageType("error")
      }
    }

    fetchBooks()
  }, [])

  const validate = () => {
    const { BookID, Rating } = formData
    if (!BookID || !Rating) {
      setMessage("Book and Rating are required.")
      setMessageType("error")
      return false
    }
    const rating = Number.parseInt(Rating)
    if (rating < 1 || rating > 5) {
      setMessage("Rating must be between 1 and 5.")
      setMessageType("error")
      return false
    }
    return true
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.post("http://localhost:4000/api/books/insert/bookreview", {
        ...formData,
        UserID: userId,
      })
      setMessage(res.data.message || "Review submitted!")
      setMessageType("success")
      // Clear form
      setFormData({
        BookID: "",
        Rating: "",
        ReviewText: "",
      })
    } catch (err) {
      const backendMsg = err.response?.data?.error || "Error: Could not submit review."
      setMessage(backendMsg)
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Submit Book Review</h1>
      </div>
      <div className="form-card">
        <form className="form" onSubmit={handleSubmit}>
          {/* Book Selector Dropdown */}
          <div className="form-group">
            <label>Select Book</label>
            <select name="BookID" value={formData.BookID} onChange={handleChange} required>
              <option value="">Select a Book</option>
              {books.map((book) => (
                <option key={book.BookID} value={book.BookID}>
                  {book.Title} (ID: {book.BookID})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <select name="Rating" value={formData.Rating} onChange={handleChange} required>
              <option value="">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              name="ReviewText"
              placeholder="Write your review..."
              value={formData.ReviewText}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit">Post Review</button>
        </form>
        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default BookReviewForm
