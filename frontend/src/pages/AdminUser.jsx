import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaUserAlt, FaBook, FaTimes } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBorrowings, setUserBorrowings] = useState([]);
  const [loadingBorrowings, setLoadingBorrowings] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/users");
      console.log("API Response:", response.data); // Debug: Log the API response

      const nonAdminUsers = response.data.filter((user) => {
        return user.RoleName === "Member";
      });

      console.log("Filtered Users:", nonAdminUsers); // Debug: Log filtered users
      setUsers(nonAdminUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/users/delete/${userId}`);
        fetchUsers(); // Refresh user list
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleUserDoubleClick = async (user) => {
    setSelectedUser(user);
    setLoadingBorrowings(true);

    try {
      const userId = user.UserID || user.id;
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}/borrowing-history`
      );
      console.log("Borrowing History:", response.data);
      setUserBorrowings(response.data);
    } catch (err) {
      console.error("Error fetching borrowing history:", err);
      setUserBorrowings([]);
    } finally {
      setLoadingBorrowings(false);
    }
  };

  const closeUserBorrowings = () => {
    setSelectedUser(null);
    setUserBorrowings([]);
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#211C1D]">Users</h1>
        <div className="text-center py-8">Loading users data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#211C1D]">Users</h1>
        <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#211C1D]">Users</h1>

      {/* Users Table */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#E0D7C7]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                Borrowed Books
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.UserID || user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => handleUserDoubleClick(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#56453E] rounded-full flex items-center justify-center text-white">
                        <FaUserAlt />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.FullName || user.Username || user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.Username || user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.Email || user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.IsActive !== false ? (
                      <div className="flex items-center">
                        <FaBook className="text-[#56453E] mr-2" />
                        <span className="px-2 text-xs font-semibold rounded-full bg-[#F1E2A0] text-[#56453E]">
                          {user.BorrowedCount || user.borrowedBooks || 0}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 text-xs font-semibold rounded-full ${
                        user.IsActive !== false
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.IsActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.UserID || user.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={closeUserBorrowings}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#211C1D]">
              Borrowing History:{" "}
              {selectedUser.FullName ||
                selectedUser.Username ||
                selectedUser.name}
            </h2>

            {loadingBorrowings ? (
              <div className="text-center py-8">
                Loading borrowing history...
              </div>
            ) : userBorrowings.length > 0 ? (
              <div className="overflow-y-auto max-h-96">
                <div className="grid gap-4">
                  {userBorrowings.map((borrowing) => (
                    <div
                      key={borrowing.BorrowingID || borrowing.id}
                      className="bg-[#E0D7C7] p-4 rounded-md"
                    >
                      <h3 className="font-bold text-[#211C1D]">
                        {borrowing.Title || borrowing.BookTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Author:</span>{" "}
                        {borrowing.Authors || borrowing.Author || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Borrowed:</span>{" "}
                        {borrowing.BorrowDate
                          ? new Date(borrowing.BorrowDate).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                      {borrowing.ReturnDate && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Returned:</span>{" "}
                          {new Date(borrowing.ReturnDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No borrowing history found for this user
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
