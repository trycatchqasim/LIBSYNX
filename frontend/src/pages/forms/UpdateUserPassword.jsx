"use client"

import { useState } from "react"
import axios from "axios"
import "../../index.css"

const UpdateUserPassword = ({ userId }) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All password fields are required")
      setMessageType("error")
      return
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match")
      setMessageType("error")
      return
    }

    try {
      const response = await axios.patch(`http://localhost:4000/api/users/${userId}/password`, {
        currentPassword,
        newPassword,
      })

      setMessage("Password updated successfully")
      setMessageType("success")

      // Clear form after successful reset
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      setMessage(error.response?.data?.error || "Failed to update password")
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Update Password</h1>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Update Password</button>
        </form>

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default UpdateUserPassword
