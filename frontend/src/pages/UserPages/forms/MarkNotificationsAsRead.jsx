"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../index.css"

const MarkNotificationAsRead = ({ userId }) => {
  const [notifications, setNotifications] = useState([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  useEffect(() => {
    // Fetch user's notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/${userId}/notifications`)
        setNotifications(response.data)
        if (response.data.length === 0) {
          setMessage("No notifications found for this user")
          setMessageType("info")
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setMessage("Failed to fetch notifications")
        setMessageType("error")
      }
    }

    fetchNotifications()
  }, [userId])

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:4000/api/users/notifications/${notificationId}/read`)

      // Update the notifications list to reflect the change
      setNotifications(
        notifications.map((notif) =>
          notif.NotificationID === notificationId ? { ...notif, NotificationStatus: "Read" } : notif,
        ),
      )

      setMessage("Notification marked as read")
      setMessageType("success")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setMessage(error.response?.data?.error || "Failed to mark notification as read")
      setMessageType("error")
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Mark Notifications as Read</h1>
      </div>
      <div className="form-card">
        {notifications.length > 0 ? (
          <div className="notification-list">
            <h3>Unread Notifications</h3>
            {notifications
              .filter((notif) => notif.NotificationStatus !== "Read")
              .map((notif) => (
                <div key={notif.NotificationID} className="notification-item">
                  <div className="notification-content">
                    <p>
                      <strong>Type:</strong> {notif.NotificationType}
                    </p>
                    <p>
                      <strong>Message:</strong> {notif.Message}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(notif.CreatedDate).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => markAsRead(notif.NotificationID)}>Mark as Read</button>
                </div>
              ))}

            {notifications.filter((notif) => notif.NotificationStatus !== "Read").length === 0 && (
              <div className="info-text">No unread notifications found</div>
            )}
          </div>
        ) : (
          <div className="info-text">No notifications found</div>
        )}

        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </div>
  )
}

export default MarkNotificationAsRead
