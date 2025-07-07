"use client"

import { useState } from "react"
import axios from "axios"
import "../../index.css"

function BookForm() {
  const [formData, setFormData] = useState({
    Title: "",
    CategoryID: "",
    AuthorID: "",
    PublishYear: "",
    TotalCopies: "",
    AvailableCopies: "",
    Description: "",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const validate = () => {
    const { Title, TotalCopies, AvailableCopies } = formData
    if (!Title || !TotalCopies || !AvailableCopies || AvailableCopies > TotalCopies) {
      setMessage("Title, Total Copies, and Available Copies are required.")
      setMessageType("error")
      return false
    }
    return true
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.post("http://localhost:4000/api/books/insert/book", formData)
      setMessage(res.data.message || "Book inserted successfully!")
      setMessageType("success")
      // Reset form
      setFormData({
        Title: "",
        CategoryID: "",
        AuthorID: "",
        PublishYear: "",
        TotalCopies: "",
        AvailableCopies: "",
        Description: "",
      })
    } catch (err) {
      const backendMsg = err.response?.data?.error || "Error inserting book."
      setMessage(backendMsg)
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Library Management System</h1>
      </div>
      <div className="form-card">
        <h2>Insert Book</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input name="Title" placeholder="Book Title" value={formData.Title} onChange={handleChange} />
          <input name="CategoryID" placeholder="Category ID" value={formData.CategoryID} onChange={handleChange} />
          <input name="AuthorID" placeholder="Author ID" value={formData.AuthorID} onChange={handleChange} /> {/* ✅ AuthorID field */}
          <input name="PublishYear" placeholder="Publish Year" value={formData.PublishYear} onChange={handleChange} />
          <input
            name="TotalCopies"
            placeholder="Total Copies"
            type="number"
            value={formData.TotalCopies}
            onChange={handleChange}
          />
          <input
            name="AvailableCopies"
            placeholder="Available Copies"
            type="number"
            value={formData.AvailableCopies}
            onChange={handleChange}
          />
          <textarea name="Description" placeholder="Description" value={formData.Description} onChange={handleChange} />
          <button type="submit">Insert Book</button>
        </form>
        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default BookForm
