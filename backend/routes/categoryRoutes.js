const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Get all categories
router.get("/", categoryController.getAllCategories);

//get category by name
router.get("/name/:name", categoryController.getCategoryByName);

// to insert
router.post("/insert", categoryController.insertCategory);

// to delete
router.delete("/delete/:id", categoryController.DeleteCategory);

// Get books by category - specific route before generic /:id route
router.get("/:id/books", categoryController.getBooksByCategory);

// Get authors by category - specific route before generic /:id route
router.get("/:id/authors", categoryController.getCategoryAuthors);

// Get category by ID - most generic route should come last
router.get("/:id", categoryController.getCategoryById);


router.patch("/update/:id", categoryController.updateCategory);

module.exports = router;
