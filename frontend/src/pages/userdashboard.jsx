"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { UserSidebar } from "./user-sidebar"
import { UserNavbar } from "./user-navbar"
import { Footer } from "./footer"
import axios from "axios"

// Import all form components
import UpdateUserDetails from "./forms/UpdateUserDetails"
import BookReviewForm from "./forms/BookReviewForm"
import BorrowingHistoryForm from "./forms/BorrowingHistoryForm"
import NotificationForm from "./forms/NotificationForm"
import UpdateUserReview from "./forms/UpdateUserReview"
import BookForm from "./forms/BookForm"
import MarkNotificationAsRead from "./forms/MarkNotificationsAsRead"
import AuthorForm from "./forms/AuthorForm"
import UpdateUserPassword from "./forms/UpdateUserPassword"
import DashboardHome from "./dashboard-home"
import BorrowBookForm from "./forms/borrowbook"
import AvailableBooksForm from "./forms/availablebooks"
import BookReviewsForm from "./forms/bookreview"
import AllBookReviews from "./forms/AllBookReviews"
import Logout from "./forms/Logout"
import ReturnBookForm from "./forms/returnbookform"

export function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard")
  const [userData, setUserData] = useState(null)
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { userId } = useParams()
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://localhost:4000/api/users/${userId}`)
        setUserData(userResponse.data)

        // Fetch borrowed books
        try {
          const borrowedResponse = await axios.get(`http://localhost:4000/api/users/${userId}/borrowing-history`)
          setBorrowedBooks(Array.isArray(borrowedResponse.data) ? borrowedResponse.data : [])
        } catch (error) {
          console.error("Error fetching borrowed books:", error)
          setBorrowedBooks([])
        }

        // Fetch notifications
        try {
          const notificationsResponse = await axios.get(`http://localhost:4000/api/users/${userId}/notifications`)
          setNotifications(Array.isArray(notificationsResponse.data) ? notificationsResponse.data : [])
        } catch (error) {
          console.error("Error fetching notifications:", error)
          setNotifications([])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  // Update the renderPage function to handle the separate borrow and return book pages
  const renderPage = () => {
    if (loading) {
      return <div className="loading">Loading user data...</div>
    }

    const user = userData || currentUser

    switch (activePage) {
      case "dashboard":
        return (
          <DashboardHome
            onNavigate={setActivePage}
            userId={userId}
            borrowedBooks={borrowedBooks}
            notifications={notifications}
          />
        )
      case "update-user-details":
        return <UpdateUserDetails userId={userId} userData={user} />
      case "book-review":
        return <BookReviewForm userId={userId} />
      case "borrowing-history":
        return <BorrowingHistoryForm userId={userId} />
      case "notification":
        return <NotificationForm userId={userId} />
      case "update-review":
        return <UpdateUserReview userId={userId} />
      case "add-book":
        return <BookForm />
      case "mark-notification":
        return <MarkNotificationAsRead userId={userId} />
      case "add-author":
        return <AuthorForm />
      case "update-password":
        return <UpdateUserPassword userId={userId} />
      case "borrow-book":
        return <BorrowBookForm userId={userId} />
      case "return-book":
        return <ReturnBookForm userId={userId} />
      case "available-books":
        return <AvailableBooksForm />
      case "book-reviews":
        return <BookReviewsForm userId={userId} />
      case "all-book-reviews":
        return <AllBookReviews />
      case "logout":
        return <Logout />
      default:
        return (
          <DashboardHome
            onNavigate={setActivePage}
            userId={userId}
            borrowedBooks={borrowedBooks}
            notifications={notifications}
          />
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <UserSidebar onNavigate={setActivePage} activePage={activePage} />
        <div className="flex-1 flex flex-col">
          <UserNavbar userData={userData || currentUser} />
          <main className="flex-1 p-6 overflow-auto">{renderPage()}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
