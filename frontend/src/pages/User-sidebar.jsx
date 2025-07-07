"use client"
import {
  MdDashboard,
  MdMenuBook,
  MdHistory,
  MdPerson,
  MdNotifications,
  MdLogout,
  MdStar,
  MdAdd,
  MdCheck,
  MdLock,
  MdLibraryBooks,
  MdBookmarkAdd,
  MdRateReview,
} from "react-icons/md"

export function UserSidebar({ onNavigate, activePage }) {
  // Navigation items for the sidebar
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { id: "update-user-details", label: "Update User Details", icon: <MdPerson /> },
    { id: "book-review", label: "Submit Book Review", icon: <MdStar /> },
    { id: "borrowing-history", label: "Borrowing History", icon: <MdHistory /> },
  
    { id: "update-review", label: "Update Review", icon: <MdMenuBook /> },
   
    { id: "mark-notification", label: "Mark Notifications", icon: <MdCheck /> },
   
    { id: "update-password", label: "Update Password", icon: <MdLock /> },
    { id: "borrow-book", label: "Borrow Book", icon: <MdBookmarkAdd /> },
    { id: "return-book", label: "Return Book", icon: <MdLibraryBooks /> },
    { id: "available-books", label: "Available Books", icon: <MdLibraryBooks /> },
    { id: "all-book-reviews", label: "All Book Reviews", icon: <MdRateReview /> },
  ]

  return (
    <aside className="w-64 h-screen bg-[#211C1D] text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[#56453E] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#F1E2A0] rounded-full flex items-center justify-center">
            <span className="text-[#211C1D] text-lg font-bold">L</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">LibSynx</h1>
            <p className="text-xs opacity-70">User Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded transition-colors ${
                  activePage === item.id ? "bg-[#56453E] text-[#F1E2A0]" : "hover:bg-[#56453E]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#56453E]">
        <button
          onClick={() => onNavigate("logout")}
          className="flex items-center space-x-2 w-full px-4 py-2 rounded hover:bg-[#56453E] transition-colors"
        >
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
