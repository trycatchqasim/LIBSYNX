const express = require("express");
const cors = require("cors");
const { getConnection } = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const userRoutes = require("./routes/userRoutes");
const adminroutes = require("./routes/reportRoutes");
const categoryroutes = require("./routes/categoryRoutes");

const borrowingRoutes = require("./routes/borrowingRoutes")
const returnRoutes = require("./routes/returnRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

const app = express();
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Book routes
app.use("/api/books", bookRoutes);

//author Routes
app.use("/api/author", authorRoutes);

//user Routes
app.use("/api/users", userRoutes);

app.use("/api/admin", adminroutes);

app.use("/api/category", categoryroutes);

app.use("/api/borrowings",userRoutes)

app.use("/api/returns",userRoutes)

app.use("/api/reviews", reviewRoutes)


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
