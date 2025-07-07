const express = require("express")
const router = express.Router()
const borrowingController = require("../controllers/borrowingcontroller")

// POST /api/borrowings/borrow - Borrow a book
router.post("/borrow", borrowingController.borrowBook)

// POST /api/borrowings/return - Return a book
router.post("/return", borrowingController.returnBook)

// GET /api/borrowings/user/:userId - Get borrowed books for a user
router.get("/user/:userId", borrowingController.getUserBorrowedBooks)

// GET /api/borrowings/available - Get all available books
router.get("/available", borrowingController.getAvailableBooks)

module.exports = router
