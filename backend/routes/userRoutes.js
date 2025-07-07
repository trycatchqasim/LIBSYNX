const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//get all users
router.get("/", userController.getAllUsers);

//get user overdue books
router.get("/:id/overdue", userController.getUserOverdueBooks);

// Get user by ID
router.get("/:id", userController.getUserById);

// Get user's notifications
router.get("/:id/notifications", userController.getUserNotifications);

// Get user's borrowing history
router.get("/:id/borrowing-history", userController.getUserBorrowingHistory);

// Get user's book reviews
router.get("/:id/reviews", userController.getUserReviews);

// Update user details
router.patch("/UserDetail/:id", userController.updateUserDetails);

// Update user role
router.patch("/:id/role", userController.updateUserRole);

// Update user account status
router.patch("/:id/status", userController.updateUserStatus);

// Reset user password (stores as plain text)
router.patch("/:id/password", userController.resetUserPassword);

// Extend book due date
router.patch("/borrowing/:borrowId/extend", userController.extendDueDate);

// Mark book as returned
router.patch("/borrowing/:borrowId/return", userController.markBookAsReturned);

// Update overdue status for all borrowed books
router.patch("/borrowing/overdue/update", userController.updateOverdueStatus);

// Update borrowing history (correct BorrowDate, DueDate, ReturnDate, or Status)
router.patch(
  "/borrowing/:borrowId/history",
  userController.updateBorrowingHistory
);

// Mark notification as read
router.patch(
  "/notifications/:notificationId/read",
  userController.markNotificationAsRead
);

// Update notification message
router.patch(
  "/notifications/:notificationId",
  userController.updateNotificationMessage
);

// Update user book review
router.patch("/reviews/:reviewId", userController.updateUserReview);

// Update user book rating
router.patch("/reviews/:reviewId/rating", userController.updateUserRating);

router.post("/insert", userController.insertUser);

router.delete("/delete/:id", userController.DeleteUser);

router.post("/login",userController.loginUser)

// GET /api/books/reviews/all - Get all book reviews
router.get("/", async (req, res) => {
  try {
    // Query to get all book reviews with book title and username
    const reviews = await db.query(`
      SELECT r.ReviewID, r.BookID, r.UserID, r.Rating, r.ReviewText, r.ReviewDate,
             b.Title, u.Username
      FROM BookReviews r
      JOIN Books b ON r.BookID = b.BookID
      JOIN Users u ON r.UserID = u.UserID
      ORDER BY r.ReviewDate DESC
    `)

    res.status(200).json(reviews)
  } catch (error) {
    console.error("Error fetching all book reviews:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /api/borrowings - Borrow a book
router.post("/api/borrowings", async (req, res) => {
  try {
    const { UserID, BookID } = req.body

    // Check if the book is available
    const book = await db.query("SELECT * FROM Books WHERE BookID = ? AND AvailableCopies > 0", [BookID])

    if (!book || book.length === 0) {
      return res.status(400).json({ error: "Book is not available for borrowing" })
    }

    // Create a borrowing record
    const borrowDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // Due in 14 days

    await db.query("INSERT INTO Borrowings (UserID, BookID, BorrowDate, DueDate, Status) VALUES (?, ?, ?, ?, ?)", [
      UserID,
      BookID,
      borrowDate,
      dueDate,
      "Borrowed",
    ])

    // Update book availability
    await db.query("UPDATE Books SET AvailableCopies = AvailableCopies - 1 WHERE BookID = ?", [BookID])

    res.status(201).json({ message: "Book borrowed successfully" })
  } catch (error) {
    console.error("Error borrowing book:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// This is a mock API endpoint for the backend
// You would need to implement this on your backend server


// POST /api/returns - Return a book
router.post("/api/returns", async (req, res) => {
  try {
    const { UserID, BookID } = req.body

    // Check if the user has borrowed this book
    const borrowing = await db.query(
      'SELECT * FROM Borrowings WHERE UserID = ? AND BookID = ? AND Status = "Borrowed"',
      [UserID, BookID],
    )

    if (!borrowing || borrowing.length === 0) {
      return res.status(400).json({ error: "No active borrowing found for this book" })
    }

    const borrowingId = borrowing[0].BorrowingID
    const returnDate = new Date()

    // Update borrowing record
    await db.query('UPDATE Borrowings SET ReturnDate = ?, Status = "Returned" WHERE BorrowingID = ?', [
      returnDate,
      borrowingId,
    ])

    // Update book availability
    await db.query("UPDATE Books SET AvailableCopies = AvailableCopies + 1 WHERE BookID = ?", [BookID])

    res.status(200).json({ message: "Book returned successfully" })
  } catch (error) {
    console.error("Error returning book:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Add the borrow route
router.post("/insert/borrow", userController.insertBorrowingHistory)


module.exports = router;
