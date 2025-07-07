"use client"
import { MdMenuBook, MdHistory, MdNotifications, MdStar } from "react-icons/md"

export default function DashboardHome({ onNavigate, userId, borrowedBooks = [], notifications = [] }) {
  // Stats for the dashboard
  const stats = [
    {
      title: "Borrow Book",
      value: "Borrow",
      icon: <MdMenuBook size={24} />,
      color: "bg-blue-100 text-blue-600",
      subtitle: "Find and borrow books",
      onClick: () => onNavigate("borrow-book"),
    },
    {
      title: "Return Book",
      value: "Return",
      icon: <MdHistory size={24} />,
      color: "bg-purple-100 text-purple-600",
      subtitle: "Return borrowed books",
      onClick: () => onNavigate("return-book"),
    },
    {
      title: "Notifications",
      value: "View",
      icon: <MdNotifications size={24} />,
      color: "bg-yellow-100 text-yellow-600",
      subtitle: "Unread messages",
      onClick: () => onNavigate("mark-notification"),
    },
    {
      title: "Available Books",
      value: "Browse",
      icon: <MdStar size={24} />,
      color: "bg-green-100 text-green-600",
      subtitle: "Find new books",
      onClick: () => onNavigate("available-books"),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#211C1D] mb-6">Welcome to Your Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
              <div>
                <h3 className="text-gray-600 text-lg font-medium mb-1">{stat.title}</h3>
                <div className="flex justify-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowed Books Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#211C1D]">Your Borrowed Books</h2>
        {borrowedBooks && borrowedBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#E0D7C7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Book Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#211C1D] uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowedBooks.map((book) => (
                  <tr key={book.BorrowingID || book.BookID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.Title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.AuthorName || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.BorrowDate ? new Date(book.BorrowDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.DueDate ? new Date(book.DueDate).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">You don't have any borrowed books.</div>
        )}
      </div>

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#211C1D]">Recent Notifications</h2>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.NotificationID}
                className={`p-4 rounded-lg border ${
                  notification.NotificationStatus !== "Read" ? "bg-white border-[#F1E2A0]" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`font-medium ${
                      notification.NotificationStatus !== "Read" ? "text-[#211C1D]" : "text-gray-700"
                    }`}
                  >
                    {notification.NotificationType}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {notification.CreatedDate ? new Date(notification.CreatedDate).toLocaleString() : "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{notification.Message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">You don't have any notifications.</div>
        )}
      </div>
    </div>
  )
}
