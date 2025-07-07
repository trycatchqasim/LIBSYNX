const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
router.use(express.urlencoded({ extended: true }));
//get available books

//get available books
router.get("/available", bookController.getAvailableBooks);

//get popular books
router.get("/popular", bookController.getPopularBooks);

//get recent booksnp
router.get("/recent", bookController.getRecentlyAddedBooks);

//get book reviews by its id
router.get("/:id/reviews", bookController.getBookReviews);

// Get all books
router.get("/", bookController.getAllBooks);

//Get Book by ID
router.get("/:id", bookController.getBookById);


// Update book details
router.patch("/BookDetails/:id", bookController.updateBookDetails);

// Update available copies
router.patch("/:id/copies", bookController.updateBookCopies);

// Mark book as lost/damaged
router.patch("/:id/lost", bookController.markBookAsLost);

// Update book category
router.patch("/:id/category", bookController.updateBookCategory);

router.post("/insert/book",bookController.insertBook)

router.post("/insert/AuthorToBook",bookController.AssignBookToAuthor)

router.post("/insert/bookreview",bookController.insertBookReview)

router.delete("/delete/book/:id",bookController.DeleteBook)

router.delete("/delete/bookreview/:id",bookController.DeleteBookReview)

module.exports = router;
