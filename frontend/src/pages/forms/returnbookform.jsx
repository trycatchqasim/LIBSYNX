"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "../../index.css";

const ReturnBookForm = ({ userId }) => {
  // Parse userId to an integer
  const parsedUserId = userId ? parseInt(userId) : null;

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentDateTime = new Date().toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'

  useEffect(() => {
    if (parsedUserId === null || isNaN(parsedUserId)) {
      setMessage("Invalid User ID.");
      setMessageType("error");
      return;
    }

    const fetchBorrowedBooks = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/users/${parsedUserId}/borrowing-history`);
        console.log("Fetched borrowed books:", res.data);
        // Filter only books that are not yet returned
        const activeBorrows = res.data.filter(b => b.Status === "Borrowed" && b.ReturnDate === null);
        setBorrowedBooks(activeBorrows);
      } catch (err) {
        console.error("Failed to fetch borrowed books:", err);
        setMessage(`Failed to load borrowed books for user ${parsedUserId}`);
        setMessageType("error");
      }
    };

    fetchBorrowedBooks();
  }, [parsedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBookId) {
      setMessage("Please select a book to return.");
      setMessageType("error");
      return;
    }

    const formData = {
      UserID: parsedUserId,
      BookID: parseInt(selectedBookId),
      Date: currentDateTime,
      Status: "Returned",
    };

    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:4000/api/users/insert/borrow", formData);
      setMessage(res.data.message || "Book returned successfully!");
      setMessageType("success");
      setSelectedBookId("");
      
      // Refresh the borrowed books list after successful return
      const updatedRes = await axios.get(`http://localhost:4000/api/users/${parsedUserId}/borrowing-history`);
      const updatedActiveBorrows = updatedRes.data.filter(b => b.Status === "Borrowed" && b.ReturnDate === null);
      setBorrowedBooks(updatedActiveBorrows);
    } catch (err) {
      console.error("Error returning book:", err);
      setMessage(err.response?.data?.message || "Error returning book.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="header"><h1>Library Management System</h1></div>
      <div className="form-card">
        <h2>Return a Book</h2>

        {borrowedBooks.length === 0 ? (
          <p className="text-center">You have no borrowed books to return.</p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            {/* Book Selection Dropdown */}
            <div className="form-group">
              <label htmlFor="bookSelect">Select Book to Return</label>
              <select
                id="bookSelect"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
                className="w-full"
              >
                <option value="">-- Select a book --</option>
                {borrowedBooks.map((book) => (
                  <option key={book.BookID} value={book.BookID}>
                    {book.Title}
                  </option>
                ))}
              </select>
            </div>


            <button type="submit" disabled={submitting}>
              {submitting ? "Processing..." : "Return Book"}
            </button>
          </form>
        )}

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  );
};

export default ReturnBookForm;
