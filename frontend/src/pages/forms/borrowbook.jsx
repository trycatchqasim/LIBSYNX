import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BorrowFormWithUserIdFromURL = () => {
  const { userId } = useParams();

  const today = new Date();
  const formattedToday = today.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  const [formData, setFormData] = useState({
    UserID: "",
    BookID: "",
    Date: formattedToday,
    Status: "Borrowed",
  });

  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, UserID: userId }));
    }
  }, [userId]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/books/available");
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setMessage("Failed to load books");
        setMessageType("error");
      }
    };

    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.BookID) {
      setMessage("Please select a book to borrow.");
      setMessageType("error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/users/insert/borrow", formData);
      setMessage(res.data.message || "Borrow record inserted!");
      setMessageType("success");

      // Reset book field but keep user and date
      setFormData((prev) => ({
        ...prev,
        BookID: "",
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to insert record.");
      setMessageType("error");
    }
  };

  return (
    <div className="container">
      <div className="header"><h1>Library Management System</h1></div>
      <div className="form-card">
        <h2>Borrow Book</h2>
        <form className="form" onSubmit={handleSubmit}>
      
          {/* Book Dropdown */}
          <div className="form-group">
            <label htmlFor="BookID">Select Book</label>
            <select
              name="BookID"
              value={formData.BookID}
              onChange={handleChange}
              required
              className="w-full"
            >
              <option value="">-- Select a book --</option>
              {books.map((book) => (
                <option key={book.BookID} value={book.BookID}>
                  {book.Title}...({book.AvailableCopies} available)
                </option>
              ))}
            </select>
          </div>




          <button type="submit">Insert Borrow Record</button>
        </form>

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  );
};

export default BorrowFormWithUserIdFromURL;
