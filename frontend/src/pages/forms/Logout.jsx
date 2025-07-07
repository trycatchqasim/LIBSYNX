"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Logout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Perform logout
    logout()

    // Redirect to login page
    navigate("/login")
  }, [logout, navigate])

  return (
    <div className="container">
      <div className="header">
        <h1>Logging out...</h1>
      </div>
      <div className="form-card">
        <p className="text-center">Please wait while we log you out.</p>
      </div>
    </div>
  )
}

export default Logout
