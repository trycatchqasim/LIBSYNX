const { sql, getConnection } = require("../config/db")

exports.returnBook = async (req, res) => {
  const { UserID, BookID } = req.body

  try {
    const pool = await getConnection()

    // Check if the user has borrowed this book
    const borrowingCheck = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("BookID", sql.Int, BookID)
      .query(`
        SELECT BorrowingID FROM Borrowings 
        WHERE UserID = @UserID AND BookID = @BookID AND Status = 'Borrowed'
      `)

    if (!borrowingCheck.recordset.length) {
      return res.status(400).json({ error: "No active borrowing found for this book" })
    }

    // Execute stored procedure to return book
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("BookID", sql.Int, BookID)
      .execute("ReturnBook") // Assuming you have a stored procedure named ReturnBook

    console.log("✅ Book returned successfully:", result.recordset)
    res.status(200).json({ message: "Book returned successfully", data: result.recordset })
  } catch (error) {
    console.error("❌ Return book failed:", error.message)
    res.status(500).json({ error: error.message || "Failed to return book" })
  }
}

exports.getUserReturns = async (req, res) => {
  const userId = req.params.userId

  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT b.BorrowingID, b.BookID, b.UserID, b.BorrowDate, b.DueDate, b.ReturnDate, b.Status,
               bk.Title, bk.AuthorName
        FROM Borrowings b
        JOIN Books bk ON b.BookID = bk.BookID
        WHERE b.UserID = @UserID AND b.Status = 'Returned'
        ORDER BY b.ReturnDate DESC
      `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting user returns:", error)
    res.status(500).json({ error: "Failed to retrieve user returns" })
  }
}

exports.getAllReturns = async (req, res) => {
  try {
    const pool = await getConnection()
    const result = await pool.request().query(`
      SELECT * FROM vw_AllReturns
      ORDER BY ReturnDate DESC
    `)

    res.json(result.recordset)
  } catch (error) {
    console.error("Error getting all returns:", error)
    res.status(500).json({ error: "Failed to retrieve returns" })
  }
}
