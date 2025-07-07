const { sql, getConnection } = require("../config/db")

exports.getAllReviews = async (req, res) => {
  try {
    const pool = await getConnection()
    const result = await pool.request().query(`
      SELECT * FROM vw_BookReviews
      ORDER BY ReviewDate DESC
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting all book reviews:", error)
    res.status(500).json({ error: "Failed to retrieve book reviews" })
  }
}

exports.getBookReviews = async (req, res) => {
  const bookId = req.params.bookId

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .query(`
        SELECT r.ReviewID, r.UserID, r.Rating, r.ReviewText, r.ReviewDate,
               u.Username
        FROM BookReviews r
        JOIN Users u ON r.UserID = u.UserID
        WHERE r.BookID = @BookID
        ORDER BY r.ReviewDate DESC
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting book reviews:", error)
    res.status(500).json({ error: "Failed to retrieve book reviews" })
  }
}

exports.getUserReviews = async (req, res) => {
  const userId = req.params.userId

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT r.ReviewID, r.BookID, r.Rating, r.ReviewText, r.ReviewDate,
               b.Title
        FROM BookReviews r
        JOIN Books b ON r.BookID = b.BookID
        WHERE r.UserID = @UserID
        ORDER BY r.ReviewDate DESC
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting user reviews:", error)
    res.status(500).json({ error: "Failed to retrieve user reviews" })
  }
}

exports.addReview = async (req, res) => {
  const { UserID, BookID, Rating, ReviewText } = req.body

  try {
    const pool = await getConnection()

    // Check if user has already reviewed this book
    const existingReview = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("BookID", sql.Int, BookID)
      .query("SELECT ReviewID FROM BookReviews WHERE UserID = @UserID AND BookID = @BookID")

    if (existingReview.recordset.length > 0) {
      return res.status(400).json({ error: "You have already reviewed this book" })
    }

    // Execute stored procedure to add review
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("BookID", sql.Int, BookID)
      .input("Rating", sql.Int, Rating)
      .input("ReviewText", sql.NVarChar, ReviewText)
      .execute("InsertBookReview") // Assuming you have a stored procedure named InsertBookReview

    console.log("✅ Review added successfully:", result.recordset)
    res.status(201).json({ message: "Review added successfully", data: result.recordset })
  } catch (error) {
    console.error("❌ Add review failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to add review" })
  }
}

exports.updateReview = async (req, res) => {
  const reviewId = req.params.reviewId
  const { ReviewText } = req.body

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("ReviewID", sql.Int, reviewId)
      .input("ReviewText", sql.NVarChar, ReviewText)
      .query("UPDATE BookReviews SET ReviewText = @ReviewText WHERE ReviewID = @ReviewID")

    console.log("✅ Review updated successfully")
    res.status(200).json({ message: "Review updated successfully" })
  } catch (error) {
    console.error("❌ Update review failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to update review" })
  }
}

exports.updateReviewRating = async (req, res) => {
  const reviewId = req.params.reviewId
  const { Rating } = req.body

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("ReviewID", sql.Int, reviewId)
      .input("Rating", sql.Int, Rating)
      .query("UPDATE BookReviews SET Rating = @Rating WHERE ReviewID = @ReviewID")

    console.log("✅ Rating updated successfully")
    res.status(200).json({ message: "Rating updated successfully" })
  } catch (error) {
    console.error("❌ Update rating failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to update rating" })
  }
}

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("ReviewID", sql.Int, reviewId)
      .query("DELETE FROM BookReviews WHERE ReviewID = @ReviewID")

    console.log("✅ Review deleted successfully")
    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("❌ Delete review failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to delete review" })
  }
}
