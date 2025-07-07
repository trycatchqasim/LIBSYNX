import { useState, useEffect } from "react";
import axios from "axios";
import { MdNotifications, MdDelete } from "react-icons/md";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    UserID: "all",
    Message: "",
    NotificationType: "Overdue",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/api/admin/notifications"),
      axios.get("http://localhost:3000/api/users"),
    ])
      .then(([notificationRes, usersRes]) => {
        setNotifications(notificationRes.data);

        setUsers(usersRes.data);
      })

      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      })
      .finally(() => setLoading(false));
    console.log(notifications);
  }, []);

  const refreshNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/notifications"
      );
      setNotifications(response.data);
    } catch (err) {
      console.error("Error refreshing notifications:", err);
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const endpoint =
        newNotification.UserID === "all"
          ? "http://localhost:3000/api/admin/insert/notifications/all"
          : "http://localhost:3000/api/admin/insert/notifications";

      const payload =
        newNotification.UserID === "all"
          ? {
              Message: newNotification.Message,
              NotificationType: newNotification.NotificationType,
            }
          : {
              UserID: parseInt(newNotification.UserID),
              Message: newNotification.Message,
              NotificationType: newNotification.NotificationType,
            };

      await axios.post(endpoint, payload);

      alert(
        newNotification.UserID === "all"
          ? "Notification sent to all members successfully!"
          : "Notification sent successfully!"
      );

      setNewNotification({
        UserID: "all",
        Message: "",
        NotificationType: "Overdue",
      });
      setShowAddForm(false);
      refreshNotifications();
    } catch (err) {
      console.error("Error adding notification:", err);
      alert(
        `Failed to add notification: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/admin/delete/notifications/${notificationId}`
        );
        refreshNotifications();
      } catch (err) {
        console.error("Error deleting notification:", err);
        alert("Failed to delete notification");
      }
    }
  };

  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <MdNotifications className="text-[#56453E] text-2xl mr-2" />
          <h1 className="text-2xl font-bold text-[#211C1D]">Notifications</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#56453E] text-white"
        >
          Add New Notification
        </button>
      </div>

      {showAddForm && (
        <div className="mb-5 p-4 border border-gray-300 bg-white">
          <h2 className="text-lg font-semibold mb-2">Add New Notification</h2>
          <form onSubmit={handleAddNotification}>
            <div className="mb-3">
              <label className="block mb-1">Recipient</label>
              <select
                value={newNotification.UserID}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    UserID: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 w-full"
                disabled={sending}
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option
                    key={user.UserID || user.id}
                    value={user.UserID || user.id}
                  >
                    {user.Username || user.name} ({user.Email || user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-1">Type</label>
              <select
                value={newNotification.NotificationType}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    NotificationType: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 w-full"
                disabled={sending}
              >
                <option value="Overdue">Overdue</option>
                <option value="New">New</option>
                <option value="Removed">Removed</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-1">Message</label>
              <textarea
                value={newNotification.Message}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    Message: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 w-full h-24"
                required
                disabled={sending}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#56453E] text-white flex items-center"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Notification"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300"
                disabled={sending}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded text-gray-700">
          No notifications found.
        </div>
      ) : (
        <div className="bg-white border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-[#E0D7C7]">
              <tr>
                <th className="p-2 text-left border border-gray-300">User</th>
                <th className="p-2 text-left border border-gray-300">Type</th>
                <th className="p-2 text-left border border-gray-300">
                  Message
                </th>
                <th className="p-2 text-left border border-gray-300">Date</th>
                <th className="p-2 text-left border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification.NotificationID}
                  className="border-b border-gray-300"
                >
                  <td className="p-2 border border-gray-300">
                    {notification.Username ||
                      notification.UserName ||
                      "Unknown"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        notification.NotificationType === "Overdue"
                          ? "bg-red-100 text-red-800"
                          : notification.NotificationType === "New"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {notification.NotificationType}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {notification.Message}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {new Date(notification.CreatedDate).toLocaleString()}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button
                      onClick={() =>
                        handleDeleteNotification(notification.NotificationID)
                      }
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete Notification"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notifications;
