// src/pages/Notifications/Notifications.jsx

import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import Navbar from '../../components/NavBar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Popup Component
  const Popup = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <p className="text-center text-green-500">{message}</p>
          <button 
            onClick={onClose} 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Fetch notifications
  const getNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://article-back.onrender.com/api/article/user/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.message || 'Failed to fetch notifications.');
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        return;
      }

      await axios.post(`http://127.0.0.1:1234/api/article/user/notifications/${notificationId}/mark-as-read`, 
        {}, // Assuming no body is required
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect the read notification
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );

      setPopupMessage('Notification marked as read.');
      setShowPopup(true);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError(error.response?.data?.message || 'Failed to mark notification as read.');
      setShowPopup(true);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        return;
      }

      await axios.delete(`http://127.0.0.1:1234/api/article/user/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });   

      // Remove the deleted notification from local state
    //   setNotifications((prevNotifications) =>
    //     prevNotifications.filter((notif) => notif._id !== notificationId)
    //   );

      setPopupMessage('Notification deleted.');
      setShowPopup(true);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError(error.response?.data?.message || 'Failed to delete notification.');
      setShowPopup(true);
    }
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-xl">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link to="/" className="text-blue-400 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 border-b border-gray-900">
        <Navbar />
      </nav>

      {/* Main Content */}
      <div className="flex-1 mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-400">You have no notifications.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-4 rounded-lg border ${
                  notification.read ? 'border-gray-700 bg-gray-800' : 'border-blue-600 bg-blue-900'
                } flex justify-between items-center`}
              >
                <div>
                  <p className="text-lg">
                    {notification.message}
                    {notification.articleId && (
                      <>
                        {' '} - <Link to={`/article/${notification.articleId}`} className="text-blue-400 hover:underline">View Article</Link>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-400 rounded text-white text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-400 rounded text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popup Message */}
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Notifications;
