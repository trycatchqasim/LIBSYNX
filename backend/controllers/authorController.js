const { sql, getConnection } = require("../config/db");

exports.getAllAuthors = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT AuthorID, AuthorName, BookCount
      FROM vw_AllAuthors
      ORDER BY AuthorName
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting all authors:", error);
    res.status(500).json({ error: "Failed to retrieve authors" });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
      return res.status(400).json({ error: "Invalid author ID" });
    }

    const pool = await getConnection();

    const authorResult = await pool
      .request()
      .input("authorId", sql.Int, authorId).query(`
        SELECT AuthorID, AuthorName, Biography
        FROM vw_AllAuthors
        WHERE AuthorID = @authorId
      `);

    if (authorResult.recordset.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(authorResult.recordset[0]);
  } catch (error) {
    console.error("Error getting author by ID:", error);
    res.status(500).json({ error: "Failed to retrieve author" });
  }
};

// Get author with their books
exports.getAuthorWithBooks = async (req, res) => {
  try {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
      return res.status(400).json({ error: "Invalid author ID" });
    }

    const pool = await getConnection();

    // Get author details from view
    const authorResult = await pool
      .request()
      .input("authorId", sql.Int, authorId).query(`
        SELECT *
        FROM vw_AuthorBooks
        WHERE AuthorID = @authorId
      `);

    if (authorResult.recordset.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(authorResult.recordset[0]);
  } catch (error) {
    console.error("Error getting author with books:", error);
    res.status(500).json({ error: "Failed to retrieve author data" });
  }
};
exports.getPopularAuthors = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM vw_PopularAuthors
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting popular authors:", error);
    res.status(500).json({ error: "Failed to retrieve popular authors" });
  }
};


exports.updateAuthorDetails = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        const { AuthorName, Biography } = req.body;

        if (!AuthorName) {
            return res.status(400).json({ error: "Author name is required" });
        }

        const pool = await getConnection();
        const result = await pool.request()
            .input("AuthorID", sql.Int, authorId)
            .input("AuthorName", sql.NVarChar, AuthorName)
            .input("Biography", sql.NVarChar, Biography || null)
            .query(`
                UPDATE Authors
                SET AuthorName = @AuthorName, Biography = @Biography
                WHERE AuthorID = @AuthorID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Author not found" });
        }

        res.json({ message: "Author details updated successfully" });
    } catch (error) {
        console.error("Error updating author details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateAuthorBooks = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        const { BookIDs } = req.body;

        if (!Array.isArray(BookIDs) || BookIDs.length === 0) {
            return res.status(400).json({ error: "At least one BookID is required" });
        }

        const pool = await getConnection();

        // First, delete existing author-book relationships
        await pool.request()
            .input("AuthorID", sql.Int, authorId)
            .query("DELETE FROM BookAuthors WHERE AuthorID = @AuthorID");

        // Insert new author-book relationships
        for (let bookId of BookIDs) {
            await pool.request()
                .input("BookID", sql.Int, bookId)
                .input("AuthorID", sql.Int, authorId)
                .query("INSERT INTO BookAuthors (BookID, AuthorID) VALUES (@BookID, @AuthorID)");
        }

        res.json({ message: "Author-book relationships updated successfully" });
    } catch (error) {
        console.error("Error updating author books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.insertAuthor = async (req,res)=>
  { 
      const {AuthorName,Biography} = req.body;
      
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("AuthorName", sql.NVarChar, AuthorName)
      .input("Biography", sql.NVarChar, Biography)
      .execute("InsertAuthor"); // Calling the stored procedure
    console.log(" Author Inserted Successfully:", result.recordset);
    res.status(201).json({ error: "Operation Successful"});
    
  } catch (err) {
    console.error("❌ Insert Failed:", err.message);
    res.status(500).json({ error: err.message });
    }

  };

  exports.DeleteAuthor = async(req,res) =>
  {
    const myid  = req.params.id;
try {
    const pool = await getConnection();
    const result =  await pool.request()
    .input("id1", sql.Int, myid)
      .query("Delete from Authors where AuthorId =  @id1");
      
        console.log(" Author Deleted Successfully:", result.recordset);
     res.status(201).json(result.message);
     
  } catch (err) {
    console.error("❌ Could not delete:", err);
    res.status(500).json({ error: err.message });
    
  }

  }