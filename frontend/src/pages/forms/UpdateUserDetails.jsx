"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const UpdateUserDetails = ({ userId, userData }) => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Username: "",
    Email: "",
  })
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  useEffect(() => {
    // If userData is provided, use it to populate the form
    if (userData) {
      setFormData({
        FirstName: userData.FirstName || "",
        LastName: userData.LastName || "",
        Username: userData.Username || "",
        Email: userData.Email || "",
      })
    } else {
      // Otherwise fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/users/${userId}`)
          const user = response.data
          setFormData({
            FirstName: user.FirstName || "",
            LastName: user.LastName || "",
            Username: user.Username || "",
            Email: user.Email || "",
          })
        } catch (error) {
          console.error("Error fetching user details:", error)
          setMessage("Failed to fetch user details")
          setMessageType("error")
        }
      }

      fetchUserData()
    }
  }, [userId, userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.FirstName || !formData.LastName || !formData.Username || !formData.Email) {
      setMessage("All fields are required")
      setMessageType("error")
      return
    }

    try {
      const response = await axios.patch(`http://localhost:4000/api/users/UserDetail/${userId}`, formData)

      setMessage("User details updated successfully")
      setMessageType("success")
    } catch (error) {
      console.error("Error updating user details:", error)
      setMessage(error.response?.data?.error || "Failed to update user details")
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Update User Details</h1>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="FirstName">First Name</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="LastName">Last Name</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} required />
          </div>

          <button type="submit">Update User</button>
        </form>

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default UpdateUserDetails
