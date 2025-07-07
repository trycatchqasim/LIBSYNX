const { sql, getConnection } = require("../config/db");

exports.getAllBorrowings = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM vw_AllBorrowings
      ORDER BY BorrowDate DESC
    `);

    console.log("API endpoint hit: getAllBorrwings");
    const borrowings = result.recordset || [];

    if (borrowings.length === 0) {
      return res.json({
        count: 0,
        borrowings: [],
      });
    }

    res.json({
      count: borrowings.length,
      borrowings,
    });
  } catch (error) {
    console.error("Error getting all borrowings:", error);
    res.status(500).json({ error: "Failed to retrieve borrowings" });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM vw_AllNotifications
      ORDER BY CreatedDate DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
};

exports.getOverdueBooks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM vw_OverdueBooks
      ORDER BY DueDate ASC
    `);
    console.log("API endpoint hit: getOverdue");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting overdue books:", error);
    res.status(500).json({ error: "Failed to retrieve overdue books" });
  }
};

exports.insertNotification = async (req, res) => {
  const { UserID, Message, NotificationType } = req.body;
  console.log(UserID);
  console.log(Message);
  console.log(NotificationType);

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("Message", sql.NVarChar, Message)
      .input("NotificationType", sql.NVarChar, NotificationType)
      .execute("InsertNotification"); // Calling the stored procedure
    console.log("✅ Notification Inserted Successfully:", result.recordset);
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (err) {
    console.error("❌ Insert Failed:", err.message);
    res.status(500).json({ error: err.message || "Database insertion error" });
  }
};

exports.insertNotificationForAllUsers = async (req, res) => {
  const { Message, NotificationType } = req.body;

  try {
    const pool = await getConnection();

    const usersResult = await pool.request().query(`
      SELECT UserID FROM Users 
    `);

    const users = usersResult.recordset;
    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No members found to send notifications" });
    }

    const results = [];

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      for (const user of users) {
        const result = await new sql.Request(transaction)
          .input("UserID", sql.Int, user.UserID)
          .input("Message", sql.NVarChar, Message)
          .input("NotificationType", sql.NVarChar, NotificationType)
          .execute("InsertNotification");

        results.push(result.recordset[0]);
      }

      await transaction.commit();

      console.log(
        `✅ Notifications sent to ${users.length} users successfully`
      );
      res.status(201).json({
        message: `Notifications sent to ${users.length} users successfully`,
        count: users.length,
        data: results,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    console.error("❌ Sending notifications to all users failed:", err.message);
    res.status(500).json({ error: err.message || "Database operation error" });
  }
};

exports.DeleteNotification = async (req, res) => {
  const Nid = req.params.id;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id1", sql.Int, Nid)
      .query("Delete from Notifications  where NotificationID =  @id1");

    console.log("Notification Deleted");
    res
      .status(201)
      .json({ message: "Operation Successful", data: result.recordset });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
