"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../../index.css"

const LoginWithFetch = () => {
  const [formData, setFormData] = useState({
    Username: "",
    PasswordHash: "",
  })

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Using fetch instead of axios
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (data && data.user) {
        // Store user data in context
        login(data.user)

        // Navigate based on role
        if (data.user.RoleID === 1) {
          navigate(`/admin/dashboard/${data.user.UserID}`)
        } else if (data.user.RoleID === 2) {
          navigate(`/user/dashboard/${data.user.UserID}`)
        } else {
          setError("Unknown user role")
        }
      } else {
        setError("Invalid response from server")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#F1E2A0] rounded-full flex items-center justify-center mx-auto">
            <span className="text-[#211C1D] text-3xl font-bold">L</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">LibSynx</h1>
          <p className="text-gray-600">Library Management System</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Login (Fetch API)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#56453E] text-white py-2 rounded hover:bg-opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginWithFetch
