const { sql, getConnection } = require("../config/db");

// Get books by category

exports.getBooksByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("categoryId", sql.Int, categoryId)
      .query(`
          SELECT *
          FROM vw_AllBooks
          WHERE CategoryID = @categoryId
          ORDER BY Title
        `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting books by category:", error);
    res.status(500).json({ error: "Failed to retrieve books by category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT CategoryID, CategoryName 
      FROM Categories
      ORDER BY CategoryName
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const catID = parseInt(req.params.id);

    if (isNaN(catID)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("CategoryID", sql.Int, catID)
      .query(`
        SELECT CategoryID, CategoryName 
        FROM Categories 
        WHERE CategoryID = @CategoryID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};
exports.getCategoryAuthors = async (req, res) => {
  try {
    const catId = parseInt(req.params.id);

    if (isNaN(catId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const pool = await getConnection();
    const result = await pool.request().input("CategoryID", sql.Int, catId)
      .query(`
          SELECT * FROM vw_AuthorsByCategory
          WHERE CategoryID = @CategoryID
        `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ error: "No authors found for this category" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(
      `Error fetching authors for category ${req.params.id}:`,
      error
    );
    res.status(500).json({ error: "Failed to fetch category authors" });
  }
};

exports.getCategoryByName = async (req, res) => {
  try {
    const categoryName = req.params.name;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("CategoryName", sql.VarChar, categoryName).query(`
        SELECT CategoryID, CategoryName 
        FROM Categories 
        WHERE CategoryName = @CategoryName
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(
      `Error fetching category with name ${req.params.name}:`,
      error
    );
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// Add this function to your categoryController.js file

exports.updateCategory = async (req, res) => {
  const { CategoryName } = req.body;
  const categoryId = parseInt(req.params.id);

  if (isNaN(categoryId)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("CategoryID", sql.Int, categoryId)
      .input("CategoryName", sql.NVarChar, CategoryName).query(`
        UPDATE Categories 
        SET CategoryName = @CategoryName 
        WHERE CategoryID = @CategoryID
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

exports.insertCategory = async (req, res) => {
  let { CategoryName } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("CategoryName", sql.NVarChar, CategoryName)
      .execute("InsertCategory"); // Calling the stored procedure
    console.log("Category inserted Successfully");
    res.status(201).json("Operation Successful");
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Database insertion error" });
  }
};

exports.DeleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id1", sql.Int, id)
      .query("Delete from Categories where CategoryId =  @id1");
    if (result.recordset) {
      console.log("Category deleted sucessfully");
      res.status(201).json(result.message);
    }
    res.status(500).json({ error: "Does not exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
