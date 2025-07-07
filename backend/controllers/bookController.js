const { sql, getConnection } = require("../config/db");

// Get available books (books with available copies > 0)
exports.getAvailableBooks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM vw_AvailableBooks
      ORDER BY Title
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting available books:", error);
    res.status(500).json({ error: "Failed to retrieve available books" });
  }
};

// Get popular books (based on borrow count)
exports.getPopularBooks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM vw_PopularBooks
      ORDER BY BorrowCount DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting popular books:", error);
    res.status(500).json({ error: "Failed to retrieve popular books" });
  }
};

// Get recently added books (top 10 based on BookID descending)
exports.getRecentlyAddedBooks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 10 *
      FROM vw_AllBooks
      ORDER BY BookID DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting recently added books:", error);
    res.status(500).json({ error: "Failed to retrieve recently added books" });
  }
};

// Get all books - simplified
exports.getAllBooks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM vw_AllBooks
      ORDER BY Title
    `);

    res.json(result.recordset);
    console.log("API endpoint hit: getAllBooks");
  } catch (error) {
    console.error("Error getting all books:", error);
    res.status(500).json({ error: "Failed to retrieve books" });
  }
};

// Get book by ID - simplified
exports.getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("bookId", sql.Int, bookId).query(`
        SELECT *
        FROM vw_AllBooks
        WHERE BookID = @bookId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting book by ID:", error);
    res.status(500).json({ error: "Failed to retrieve book" });
  }
};

exports.getBookReviews = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("bookId", sql.Int, bookId).query(`
        SELECT * FROM vw_BookReviews
        WHERE BookID = @bookId
        ORDER BY ReviewDate DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting book reviews:", error);
    res.status(500).json({ error: "Failed to retrieve book reviews" });
  }
};

exports.updateBookDetails = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const {
      Title,
      CategoryID,
      PublishYear,
      Description,
      TotalCopies,
      copyDifference,
    } = req.body;

    if (!Title || !CategoryID || !PublishYear) {
      return res
        .status(400)
        .json({ error: "Title, CategoryID, and PublishYear are required" });
    }

    const pool = await getConnection();

    // First, get the current available copies
    const currentBook = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .query("SELECT AvailableCopies FROM Books WHERE BookID = @BookID");

    if (currentBook.recordset.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Calculate new available copies
    const currentAvailable = currentBook.recordset[0].AvailableCopies;
    const newAvailable = Math.max(0, currentAvailable + (copyDifference || 0));

    // Update both total and available copies
    const result = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .input("Title", sql.NVarChar, Title)
      .input("CategoryID", sql.Int, CategoryID)
      .input("PublishYear", sql.Int, PublishYear)
      .input("TotalCopies", sql.Int, TotalCopies || 0)
      .input("AvailableCopies", sql.Int, newAvailable)
      .input("Description", sql.NVarChar, Description).query(`
        UPDATE Books
        SET Title = @Title, 
            CategoryID = @CategoryID, 
            PublishYear = @PublishYear, 
            TotalCopies = @TotalCopies,
            AvailableCopies = @AvailableCopies,
            Description = @Description
        WHERE BookID = @BookID
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book details updated successfully" });
  } catch (error) {
    console.error("Error updating book details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBookCopies = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { AvailableCopies } = req.body;

    if (AvailableCopies < 0) {
      return res
        .status(400)
        .json({ error: "Available copies cannot be negative" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .input("AvailableCopies", sql.Int, AvailableCopies)
      .query(
        "UPDATE Books SET AvailableCopies = @AvailableCopies WHERE BookID = @BookID"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book availability updated successfully" });
  } catch (error) {
    console.error("Error updating book copies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.markBookAsLost = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .query("UPDATE Books SET AvailableCopies = 0 WHERE BookID = @BookID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book marked as lost/damaged" });
  } catch (error) {
    console.error("Error marking book as lost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBookCategory = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const { CategoryID } = req.body;

    if (!CategoryID) {
      return res.status(400).json({ error: "CategoryID is required" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BookID", sql.Int, bookId)
      .input("CategoryID", sql.Int, CategoryID)
      .query(
        "UPDATE Books SET CategoryID = @CategoryID WHERE BookID = @BookID"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book category updated successfully" });
  } catch (error) {
    console.error("Error updating book category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.insertBookReview = async (req, res) => {
  const { UserID, BookID, Rating, ReviewText } = req.body;
  console.log(UserID);
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("BookID", sql.Int, BookID)
      .input("Rating", sql.Int, Rating)
      .input("ReviewText", sql.NVarChar, ReviewText)
      .execute("InsertBookReview"); // Calling the stored procedure

    console.log("✅ Review Inserted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (err) {
    console.error("❌ Insert Failed:", err.message);
    res.status(500).json({ message: "Database Error" });
  }
};
exports.insertBook = async (req, res) => {
  const { Title, CategoryID, AuthorID, PublishYear, TotalCopies, Description } = req.body;

  try {
    const pool = await getConnection();

    // First procedure: InsertBook
    const insertResult = await pool
      .request()
      .input("Title", sql.NVarChar, Title)
      .input("CategoryID", sql.Int, CategoryID)
      .input("PublishYear", sql.Int, PublishYear)
      .input("TotalCopies", sql.Int, TotalCopies)
      .input("Description", sql.NVarChar, Description)
      .execute("InsertBook");

    const insertedBook = insertResult.recordset[0];
    const BookID = insertedBook.BookID; // Adjust this field name to match your DB return

    console.log("✅ Book inserted with ID:", BookID);

    // Second procedure: AssignAuthorToBook
    const assignResult = await pool
      .request()
      .input("AuthorID", sql.Int, AuthorID)
      .input("BookID", sql.Int, BookID)
      .execute("AssignAuthorToBook");

    console.log("✅ Author assigned to book:", assignResult.rowsAffected);

    res.status(201).json({
      message: "Book inserted and author assigned successfully",
      book: insertedBook,
    });

  } catch (err) {
    console.error("❌ Operation Failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.DeleteBookReview = async (req, res) => {
  const bid = req.params.id;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id1", sql.Int, bid)
      .query("Delete from BookReviews where ReviewID =  @id1");

    console.log(" Book Review Deleted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (err) {
    console.error("❌ Could not delete:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.DeleteBook = async (req, res) => {
  const BID = req.params.id;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id1", sql.Int, BID)
      .query("Delete from Books where Bookid =  @id1");
    console.log(" Book Deleted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (err) {
    console.log("Database error");
    res.status(500).json({ error: err.message });
  }
};

exports.AssignBookToAuthor = async (req, res) => {
  const { AuthorID, BookID } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("AuthorID", sql.Int, AuthorID)
      .input("BookID", sql.Int, BookID)
      .execute("AssignAuthorToBook"); // Calling the stored procedure

    console.log("✅ Review Inserted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (err) {
    console.error("❌ Insert Failed:", err.message);
    res.status(500).json({ message: "Database Error" });
  }
};
