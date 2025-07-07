const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
router.use(express.urlencoded({ extended: true }));
// Get all authors
router.get("/", authorController.getAllAuthors);

// Get author by ID
router.get("/:id", authorController.getAuthorById);

// Get author with their books
router.get("/:id/books", authorController.getAuthorWithBooks);

// Update author details
router.patch("/UpdateAuthor/:id", authorController.updateAuthorDetails);

// Update books assigned to an author
router.patch("/:id/books", authorController.updateAuthorBooks);


router.post('/insert',authorController.insertAuthor);

router.delete('/delete/:id',authorController.DeleteAuthor);

module.exports = router;