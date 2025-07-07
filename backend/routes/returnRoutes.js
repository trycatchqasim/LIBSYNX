const express = require("express")
const router = express.Router()
const returnController = require("../controllers/returnController")

// POST /api/returns - Return a book
router.post("/", returnController.returnBook)

// GET /api/returns/user/:userId - Get return history for a user
router.get("/user/:userId", returnController.getUserReturns)

// GET /api/returns - Get all returns
router.get("/", returnController.getAllReturns)

module.exports = router
