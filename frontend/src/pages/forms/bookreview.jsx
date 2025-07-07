"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const BookReviewsForm = ({ userId }) => {
  const [bookId, setBookId] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [books, setBooks] = useState([])

  useEffect(() => {
    // Fetch all books
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/books")
        setBooks(response.data)
      } catch (error) {
        console.error("Error fetching books:", error)
        setMessage("Failed to fetch books")
        setMessageType("error")
      }
    }

    fetchBooks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:4000/api/books/reviews", {
        UserID: userId,
        BookID: bookId,
        Rating: rating,
        ReviewText: reviewText,
      })
      setMessage("Review submitted successfully")
      setMessageType("success")

      // Reset form
      setBookId("")
      setReviewText("")
      setRating(5)
    } catch (error) {
      setMessage("Review submission failed")
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Book Review</h1>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          {/* User ID is now hidden since we're using the logged-in user's ID */}
          <input type="hidden" value={userId} />

          <div className="form-group">
            <label>Select Book</label>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)} required className="w-full">
              <option value="">-- Select a book --</option>
              {books.map((book) => (
                <option key={book.BookID} value={book.BookID}>
                  {book.Title} by {book.AuthorName || "Unknown Author"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full">
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
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <button type="submit">Submit Review</button>
        </form>
        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
    </div>
  )
}

export default BookReviewsForm
