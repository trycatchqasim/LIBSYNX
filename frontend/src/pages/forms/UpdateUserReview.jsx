"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const UpdateUserReview = ({ userId }) => {
  const [reviews, setReviews] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user's reviews
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:4000/api/users/${userId}/reviews`)
        setReviews(Array.isArray(response.data) ? response.data : [])
        setLoading(false)

        if (response.data.length === 0) {
          setMessage("No reviews found for this user")
          setMessageType("info")
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setMessage("Failed to fetch reviews")
        setMessageType("error")
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  const handleReviewSelect = (e) => {
    const reviewId = Number.parseInt(e.target.value)
    if (reviewId) {
      const review = reviews.find((r) => r.ReviewID === reviewId)
      setSelectedReview(review)
      setReviewText(review.ReviewText)
      setRating(review.Rating)
    } else {
      setSelectedReview(null)
      setReviewText("")
      setRating(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedReview) {
      setMessage("Please select a review")
      setMessageType("error")
      return
    }

    try {
      // Update review text
      await axios.patch(`http://localhost:4000/api/users/reviews/${selectedReview.ReviewID}`, {
        ReviewText: reviewText,
      })

      // Update rating if changed
      if (rating !== selectedReview.Rating) {
        await axios.patch(`http://localhost:4000/api/users/reviews/${selectedReview.ReviewID}/rating`, {
          Rating: rating,
        })
      }

      // Update the reviews list to reflect changes
      setReviews(
        reviews.map((review) =>
          review.ReviewID === selectedReview.ReviewID ? { ...review, ReviewText: reviewText, Rating: rating } : review,
        ),
      )

      setMessage("Review updated successfully")
      setMessageType("success")
    } catch (error) {
      console.error("Error updating review:", error)
      setMessage(error.response?.data?.error || "Failed to update review")
      setMessageType("error")
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Update User Review</h1>
        </div>
        <div className="form-card">
          <p className="text-center">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Update User Review</h1>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Select Review to Update</label>
            <select
              value={selectedReview ? selectedReview.ReviewID : ""}
              onChange={handleReviewSelect}
              required
              className="w-full"
            >
              <option value="">-- Select a review --</option>
              {reviews.map((review) => (
                <option key={review.ReviewID} value={review.ReviewID}>
                  {review.Title} (Rating: {review.Rating}/5)
                </option>
              ))}
            </select>
          </div>

          {selectedReview && (
            <>
              <div className="form-group">
                <label htmlFor="bookInfo">Book Title</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    id="bookInfo" 
                    value={selectedReview.Title} 
                    disabled 
                    className="info-input flex-grow" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="currentRating">Current Rating</label>
                <div className="flex items-center">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm font-medium">
                    {selectedReview.Title}: {selectedReview.Rating}/5
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="rating">New Rating (1-5)</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number.parseInt(e.target.value))}
                  required
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reviewText">Review Text</label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows="5"
                ></textarea>
              </div>

              <button type="submit">Update Review</button>
            </>
          )}
        </form>

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default UpdateUserReview