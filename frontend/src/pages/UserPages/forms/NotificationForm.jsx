"use client"

import { useState } from "react"
import axios from "axios"
import "../../index.css"

function NotificationForm({ userId }) {
  const [formData, setFormData] = useState({
    Message: "",
    NotificationType: "System",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const validate = () => {
    if (!formData.Message) {
      setMessage("Message is required.")
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
      const res = await axios.post("http://localhost:4000/api/admin/insert/notifications", {
        ...formData,
        UserID: userId,
      })
      setMessage(res.data.message || "Notification added!")
      setMessageType("success")
      // Reset form
      setFormData({
        Message: "",
        NotificationType: "System",
      })
    } catch (err) {
      const backendMsg = err.response?.data?.error || "Error: Failed to add notification."
      setMessage(backendMsg)
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Add Notification</h1>
      </div>
      <div className="form-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Message</label>
            <textarea
              name="Message"
              placeholder="Notification message"
              value={formData.Message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="NotificationType" onChange={handleChange} value={formData.NotificationType}>
              <option value="Overdue">Overdue</option>
              <option value="Reservation">Reservation</option>
              <option value="Available">Available</option>
              <option value="System">System</option>
            </select>
          </div>

          <button type="submit">Send Notification</button>
        </form>
        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default NotificationForm
