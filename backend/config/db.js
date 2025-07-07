const sql = require("mssql");

const dbConfig = {
  user: "sa",
  password: "12345678",
  server: "localhost",
  database: "TripleByte4", // Replace with your actual database name
  options: {
    encrypt: false,
    trustServerCertificate: true, // For local dev / self-signed certs
  },
};

// Create a function to get a SQL Server connection pool
const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to SQL Server successfully");
    return pool;
  } catch (error) {
    console.error("SQL Connection Error:", error);
    throw error;
  }
};

// For simple queries

module.exports = {
  getConnection,
  sql, // Exporting sql to use data types in other files
};
