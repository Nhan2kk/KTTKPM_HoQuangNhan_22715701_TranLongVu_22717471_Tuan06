import React, { useState, useEffect } from "react";
import paymentService, {type Notification } from "../services/paymentService";
import "../styles/notifications.css";

interface NotificationsProps {
  userId: number;
  autoRefresh?: boolean;
}

export default function Notifications({
  userId,
  autoRefresh = true,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();

    if (autoRefresh) {
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getNotificationsByUserId(userId);
      const notifications = data.data || data;
      setNotifications(notifications);

      const unread = notifications.filter(
        (n: Notification) => !n.isRead
      ).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await paymentService.markAsRead(notificationId);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await paymentService.markAllAsRead(userId);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_SUCCESS":
        return "✓";
      case "ORDER_CREATED":
        return "📦";
      case "ORDER_PREPARING":
        return "👨‍🍳";
      case "ORDER_READY":
        return "✓";
      case "ORDER_DELIVERED":
        return "🚚";
      default:
        return "📢";
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {loading && <div className="loading-text">Loading...</div>}

      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications yet</div>
      ) : (
        <>
          <div className="notifications-list">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.isRead ? "read" : "unread"}`}
              >
                <span className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="mark-read-btn"
                    title="Mark as read"
                  >
                    •
                  </button>
                )}
              </div>
            ))}
          </div>

          {notifications.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="show-more-btn"
            >
              Show more ({notifications.length - 5} more)
            </button>
          )}

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="mark-all-read-btn"
            >
              Mark all as read
            </button>
          )}
        </>
      )}
    </div>
  );
}
