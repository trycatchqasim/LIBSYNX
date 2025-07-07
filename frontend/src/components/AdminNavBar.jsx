import { IoPerson } from "react-icons/io5";
import React from "react";
import { useAuth } from "../pages/context/AuthContext"; // Import useAuth hook

const getCurrentDate = () => {
  const now = new Date();
  return now.toDateString();
};

const AdminNavbar = () => {
  // Get the current authenticated user from context
  const { user } = useAuth();
  
  // Default user if not logged in (shouldn't happen due to ProtectedRoute)
  const adminUser = user || {
    Username: "Guest",
    RoleID: 0,
  };

  return (
    <nav className="flex items-center justify-between bg-gray-50 p-4 shadow rounded mb-4">
      <div className="flex items-center space-x-3">
        <IoPerson size={28} className="text-gray-600" />
        <div>
          <div className="text-lg font-semibold text-gray-800">{adminUser.Username}</div>
          <div className="text-sm text-gray-500">
            {adminUser.RoleID === 1 ? "Administrator" : "User"}
          </div>
        </div>
      </div>
      <div className="text-base font-medium text-gray-700">
        {getCurrentDate()}
      </div>
    </nav>
  );
};

export default AdminNavbar;