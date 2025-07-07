"use client"

import { useState } from "react"
import axios from "axios"
import ".././../index.css"

function AuthorForm() {
  const [formData, setFormData] = useState({
    AuthorName: "",
    Biography: "",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const validate = () => {
    if (!formData.AuthorName.trim()) {
      setMessage("Author name is required.")
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
      const res = await axios.post("http://localhost:4000/api/author/insert", formData)
      setMessage(res.data.message || "Author inserted successfully!")
      setMessageType("success")
      // Reset form
      setFormData({
        AuthorName: "",
        Biography: "",
      })
    } catch (err) {
      const backendMsg = err.response?.data?.error || "Error inserting author."
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
        <h2>Insert Author</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input name="AuthorName" placeholder="Author Full Name" value={formData.AuthorName} onChange={handleChange} />
          <textarea name="Biography" placeholder="Biography" value={formData.Biography} onChange={handleChange} />
          <button type="submit">Insert Author</button>
        </form>
        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default AuthorForm
