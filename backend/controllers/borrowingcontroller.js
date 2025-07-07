const { sql, getConnection } = require("../config/db")

// Controller for borrowing a book
exports.borrowBook = async (req, res) => {
  const { userId, bookId } = req.body

  try {
    const pool = await getConnection()

    // Execute the BorrowBook stored procedure
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("BookID", sql.Int, bookId)
      .execute("BorrowBook")

    if (result.recordset && result.recordset.length > 0) {
      console.log("✅ Book borrowed successfully:", result.recordset)
      res.status(201).json({
        message: "Book borrowed successfully!",
        borrowId: result.recordset[0].BorrowID,
      })
    } else {
      res.status(400).json({ error: "Failed to borrow book" })
    }
  } catch (error) {
    console.error("❌ Borrow book failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to borrow book" })
  }
}

// Controller for returning a book
exports.returnBook = async (req, res) => {
  const { userId, bookId } = req.body

  try {
    const pool = await getConnection()

    // Execute the ReturnBook stored procedure
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("BookID", sql.Int, bookId)
      .execute("ReturnBook")

    console.log("✅ Book returned successfully")
    res.status(200).json({ message: "Book returned successfully" })
  } catch (error) {
    console.error("❌ Return book failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to return book" })
  }
}

// Get borrowed books for a user
exports.getUserBorrowedBooks = async (req, res) => {
  const userId = req.params.userId

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT bh.BorrowID, bh.BookID, bh.UserID, bh.BorrowDate, bh.DueDate, bh.Status,
               b.Title, 
               STRING_AGG(a.AuthorName, ', ') AS AuthorName
        FROM BorrowingHistory bh
        JOIN Books b ON bh.BookID = b.BookID
        LEFT JOIN BookAuthors ba ON b.BookID = ba.BookID
        LEFT JOIN Authors a ON ba.AuthorID = a.AuthorID
        WHERE bh.UserID = @UserID AND bh.Status = 'Borrowed'
        GROUP BY bh.BorrowID, bh.BookID, bh.UserID, bh.BorrowDate, bh.DueDate, bh.Status, b.Title
        ORDER BY bh.BorrowDate DESC
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting user borrowed books:", error)
    res.status(500).json({ error: "Failed to retrieve borrowed books" })
  }
}

// Get all available books
exports.getAvailableBooks = async (req, res) => {
  try {
    const pool = await getConnection()
    const result = await pool.request().query(`
        SELECT b.BookID, b.Title, b.PublishYear, b.TotalCopies, b.AvailableCopies,
               c.CategoryID, c.CategoryName,
               STRING_AGG(a.AuthorName, ', ') AS AuthorName
        FROM Books b
        LEFT JOIN Categories c ON b.CategoryID = c.CategoryID
        LEFT JOIN BookAuthors ba ON b.BookID = ba.BookID
        LEFT JOIN Authors a ON ba.AuthorID = a.AuthorID
        WHERE b.AvailableCopies > 0
        GROUP BY b.BookID, b.Title, b.PublishYear, b.TotalCopies, b.AvailableCopies, c.CategoryID, c.CategoryName
        ORDER BY b.Title
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting available books:", error)
    res.status(500).json({ error: "Failed to retrieve available books" })
  }
}
