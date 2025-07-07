"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  // Show loading state while authentication is being determined
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole !== undefined && currentUser.RoleID !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.RoleID === 1) {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to={`/user/dashboard/${currentUser.UserID}`} replace />
    }
  }

  // Return the children (the protected component) if authenticated and authorized
  return children
}

export default ProtectedRoute