"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import "../../index.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Username: "",
    PasswordHash: "",
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // Prepare data for API - match the expected fields
      const apiData = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Username: formData.Username,
        PasswordHash: formData.PasswordHash,
        RoleID: 2, // Always set RoleID to 2 for regular users
      }

      // Use the correct API endpoint
      const response = await axios.post("http://localhost:4000/api/users/insert", apiData)

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#F1E2A0] rounded-full flex items-center justify-center mx-auto">
            <span className="text-[#211C1D] text-3xl font-bold">L</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">LibSynx</h1>
          <p className="text-gray-600">Library Management System</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {success ? (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
            Registration successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="FirstName"
                placeholder="First Name"
                value={formData.FirstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="LastName"
                placeholder="Last Name"
                value={formData.LastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <input
              type="text"
              name="Username"
              placeholder="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />

            <input
              type="password"
              name="PasswordHash"
              placeholder="Password"
              value={formData.PasswordHash}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <button type="submit" className="w-full bg-[#56453E] text-white py-2 rounded hover:bg-opacity-90">
              Sign Up
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
