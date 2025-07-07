const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

// GET /api/reviews - Get all book reviews
router.get("/", reviewController.getAllReviews)

// GET /api/reviews/book/:bookId - Get reviews for a specific book
router.get("/book/:bookId", reviewController.getBookReviews)

// GET /api/reviews/user/:userId - Get reviews by a specific user
router.get("/user/:userId", reviewController.getUserReviews)

// POST /api/reviews - Add a new review
router.post("/", reviewController.addReview)

// PATCH /api/reviews/:reviewId - Update a review
router.patch("/:reviewId", reviewController.updateReview)

// PATCH /api/reviews/:reviewId/rating - Update a review rating
router.patch("/:reviewId/rating", reviewController.updateReviewRating)

// DELETE /api/reviews/:reviewId - Delete a review
router.delete("/:reviewId", reviewController.deleteReview)

module.exports = router
