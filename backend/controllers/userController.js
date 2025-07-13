const { sql, getConnection } = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
            SELECT *
            FROM vw_allUsers U
            ORDER BY U.UserID
      `);
    console.log("API endpoint hit: getAllUsers");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
          SELECT * FROM vw_allUsers
          WHERE UserID = @userId
        `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
          SELECT * FROM vw_UserNotifications
          WHERE UserID = @userId
          ORDER BY CreatedDate DESC
        `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting user notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

exports.getUserBorrowingHistory = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT * FROM vw_UserBorrowingHistory
        WHERE UserID = @userId
        ORDER BY BorrowDate DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting user borrowing history:", error);
    res.status(500).json({ error: "Failed to retrieve borrowing history" });
  }
};

// Get user book reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT * FROM vw_BookReviews
        WHERE UserID = @userId
        ORDER BY ReviewDate DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting user reviews:", error);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};

// Get user's overdue books
exports.getUserOverdueBooks = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT BorrowID, BookID, Title, BorrowDate, DueDate
        FROM vw_OverdueBooks
        WHERE UserID = @userId
        ORDER BY DueDate ASC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting user overdue books:", error);
    res.status(500).json({ error: "Failed to retrieve overdue books" });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { FirstName, LastName, Username } = req.body;

    if (!FirstName || !LastName || !Username) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const pool = await getConnection();
    const checkUser = await pool
      .request()
      .input("Username", sql.NVarChar, Username)
      .input("UserID", sql.Int, userId)
      .query(
        "SELECT 1 FROM Users WHERE Username = @Username AND UserID <> @UserID"
      );

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName)
      .input("Username", sql.NVarChar, Username).query(`
                UPDATE Users
                SET FirstName = @FirstName, LastName = @LastName, Username = @Username
                WHERE UserID = @UserID
            `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { RoleID } = req.body;

    if (!RoleID) {
      return res.status(400).json({ error: "RoleID is required" });
    }

    const pool = await getConnection();
    const checkRole = await pool
      .request()
      .input("RoleID", sql.Int, RoleID)
      .query("SELECT 1 FROM UserRoles WHERE RoleID = @RoleID");

    if (checkRole.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid RoleID" });
    }

    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("RoleID", sql.Int, RoleID)
      .query("UPDATE Users SET RoleID = @RoleID WHERE UserID = @UserID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { AccountStatus } = req.body;

    if (AccountStatus !== 0 && AccountStatus !== 1) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("AccountStatus", sql.Bit, AccountStatus)
      .query(
        "UPDATE Users SET AccountStatus = @AccountStatus WHERE UserID = @UserID"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account status updated successfully" });
  } catch (error) {
    console.error("Error updating user account status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "Password cannot be empty" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("NewPassword", sql.NVarChar, newPassword) // Store plain text password
      .query(`
              UPDATE Users 
              SET PasswordHash = @NewPassword 
              WHERE UserID = @UserID
          `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.extendDueDate = async (req, res) => {
  try {
    const borrowId = parseInt(req.params.borrowId);
    const { newDueDate } = req.body;

    if (!newDueDate) {
      return res.status(400).json({ error: "New due date is required" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BorrowID", sql.Int, borrowId)
      .input("NewDueDate", sql.DateTime, newDueDate).query(`
                UPDATE BorrowingHistory
                SET DueDate = @NewDueDate
                WHERE BorrowID = @BorrowID AND Status = 'Borrowed'
            `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ error: "Borrow record not found or book already returned" });
    }

    res.json({ message: "Due date extended successfully" });
  } catch (error) {
    console.error("Error extending due date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.markBookAsReturned = async (req, res) => {
  try {
    const borrowId = parseInt(req.params.borrowId);
    const { returnDate } = req.body;

    if (!returnDate) {
      return res.status(400).json({ error: "Return date is required" });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("BorrowID", sql.Int, borrowId)
      .input("ReturnDate", sql.DateTime, returnDate).query(`
                UPDATE BorrowingHistory
                SET ReturnDate = @ReturnDate, Status = 'Returned'
                WHERE BorrowID = @BorrowID AND Status = 'Borrowed'
            `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ error: "Borrow record not found or book already returned" });
    }

    res.json({ message: "Book marked as returned" });
  } catch (error) {
    console.error("Error marking book as returned:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateOverdueStatus = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
            UPDATE BorrowingHistory
            SET Status = 'Overdue'
            WHERE DueDate < GETDATE() AND Status = 'Borrowed'
        `);

    res.json({
      message: `${result.rowsAffected[0]} borrow records updated as overdue`,
    });
  } catch (error) {
    console.error("Error updating overdue status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBorrowingHistory = async (req, res) => {
  try {
    const borrowId = parseInt(req.params.borrowId);
    const { BorrowDate, DueDate, ReturnDate, Status } = req.body;

    if (!BorrowDate && !DueDate && !ReturnDate && !Status) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const pool = await getConnection();
    const request = pool.request().input("BorrowID", sql.Int, borrowId);

    if (BorrowDate) {
      const result = await request
        .input("BorrowDate", sql.DateTime, BorrowDate)
        .query(
          "UPDATE BorrowingHistory SET BorrowDate = @BorrowDate WHERE BorrowID = @BorrowID"
        );
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
    }
    if (DueDate) {
      const result = await request
        .input("DueDate", sql.DateTime, DueDate)
        .query(
          "UPDATE BorrowingHistory SET DueDate = @DueDate WHERE BorrowID = @BorrowID"
        );
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
    }
    if (ReturnDate) {
      const result = await request
        .input("ReturnDate", sql.DateTime, ReturnDate)
        .query(
          "UPDATE BorrowingHistory SET ReturnDate = @ReturnDate WHERE BorrowID = @BorrowID"
        );
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
    }
    if (Status) {
      const result = await request
        .input("Status", sql.NVarChar, Status)
        .query(
          "UPDATE BorrowingHistory SET Status = @Status WHERE BorrowID = @BorrowID"
        );
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
    }

    res.json({ message: "Borrowing history updated successfully" });
  } catch (error) {
    console.error("Error updating borrowing history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.notificationId);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("NotificationID", sql.Int, notificationId).query(`
                UPDATE Notifications
                SET NotificationStatus = 'Read'
                WHERE NotificationID = @NotificationID
            `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateNotificationMessage = async (req, res) => {
  try {
    const notificationId = parseInt(req.params.notificationId);
    const { Message, NotificationType } = req.body;

    if (!Message || !NotificationType) {
      return res
        .status(400)
        .json({ error: "Message and NotificationType are required" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("NotificationID", sql.Int, notificationId)
      .input("Message", sql.NVarChar, Message)
      .input("NotificationType", sql.NVarChar, NotificationType).query(`
                UPDATE Notifications
                SET Message = @Message, NotificationType = @NotificationType
                WHERE NotificationID = @NotificationID
            `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    const { ReviewText } = req.body;

    if (!ReviewText) {
      return res.status(400).json({ error: "Review text is required" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ReviewID", sql.Int, reviewId)
      .input("ReviewText", sql.NVarChar, ReviewText).query(`
                UPDATE BookReviews
                SET ReviewText = @ReviewText
                WHERE ReviewID = @ReviewID
            `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserRating = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    const { Rating } = req.body;

    if (!Rating || Rating < 1 || Rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("ReviewID", sql.Int, reviewId)
      .input("Rating", sql.Int, Rating).query(`
                UPDATE BookReviews
                SET Rating = @Rating
                WHERE ReviewID = @ReviewID
            `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.insertBorrowingHistory = async (req, res) => {
  let { UserID, BookID, Status } = req.body;

  try {
    const pool = await getConnection();
    let result; // 👈 define it here

    if (Status === 'Borrowed') {
      result = await pool.request()
        .input("UserID", sql.Int, UserID)
        .input("BookID", sql.Int, BookID)
        .input("Status", sql.NVarChar, Status)
        .execute("InsertBorrowingHistory");
    } else if (Status === 'Returned') {
      result = await pool.request()
        .input("UserID2", sql.Int, UserID)
        .input("BookID2", sql.Int, BookID)
        .input("Status", sql.NVarChar, Status)
        .execute("ReturnBorrowedBook");
    } else {
      throw new Error("Invalid status. Must be 'Borrowed' or 'Returned'.");
    }

    console.log("✅ Borrowing History Inserted Successfully:", result.recordset);
    res.status(201).json({ message: "Operation Successful", data: result.recordset });

  } catch (error) {
    console.error("❌ Insert Failed:", error.message);
    res.status(500).json({ error: error.message || "Database insertion error" });
  }
};

exports.insertUser = async (req, res) => {
  let { FirstName, LastName, Username, PasswordHash, RoleID } = req.body;

  RoleID = RoleID ? Number(RoleID) : 2;

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName)
      .input("Username", sql.NVarChar, Username)
      .input("PasswordHash", sql.NVarChar, PasswordHash)
      .execute("InsertUser");

    console.log("✅ User Inserted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Database insertion error" });
  }
};


exports.DeleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id1", sql.Int, userId)
      .query("Delete from Users where Userid =  @id1");
    console.log("user deleted");
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.loginUser = async (req, res) => {
  const { Username, PasswordHash } = req.body;

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Username", sql.NVarChar, Username)
      .input("PasswordHash", sql.NVarChar, PasswordHash)
      .query(
        "SELECT UserID, FirstName, LastName, RoleID, AccountStatus FROM Users WHERE Username = @Username AND PasswordHash = @PasswordHash"
      );

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if account is blocked (AccountStatus = 0)
    if (user.AccountStatus === 0 || user.AccountStatus === false) {
      return res.status(403).json({ error: "Your account has been blocked. Please contact the administrator." });
    }

    res.status(200).json({
      message: "Login successful",
      user, // contains UserID, FirstName, LastName, RoleID
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Try again later." });
  }
};
