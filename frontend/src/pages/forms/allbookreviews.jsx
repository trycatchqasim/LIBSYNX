"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const AllBookReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:4000/api/reviews")
        console.log("Fetched reviews:", response.data) // Debugging line
        setReviews(Array.isArray(response.data) ? response.data : [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Failed to fetch book reviews")
        setLoading(false)
      }
    }
    
    fetchAllReviews()
  }, [])
  
  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>All Book Reviews</h1>
        </div>
        <div className="form-card">
          <p className="text-center">Loading book reviews...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>All Book Reviews</h1>
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
        <h1>All Book Reviews</h1>
      </div>
      <div className="form-card">
        {reviews.length === 0 ? (
          <p className="text-center">No book reviews found.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.ReviewID} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {/* 📘 Book Title */}
                <h3 className="font-semibold text-xl text-blue-800 mb-1">{review.Title}</h3>
                
                {/* 📚 Book Title (if different from review title) */}
                {review.BookTitle && review.BookTitle !== review.Title && (
                  <h4 className="font-medium text-lg text-gray-700 mb-2">Book: {review.BookTitle}</h4>
                )}
                
                {/* ⭐ Rating */}
                <div className="flex items-center mb-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                    Rating: {review.Rating}/5
                  </span>
                </div>
                
                {/* 📝 Review Text */}
                <p className="text-sm text-gray-700 mb-3">{review.ReviewText}</p>
                
                {/* 👤 Username + Date */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>By: {review.Username || "Anonymous"}</span>
                  <span>{review.ReviewDate ? new Date(review.ReviewDate).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBookReviews