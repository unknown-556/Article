import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://article-back.onrender.com/api/article/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
        }

        // Fetch unread notifications count
        const notificationsResponse = await axios.get('https://article-back.onrender.com/api/article/user/unread/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (notificationsResponse.status === 200 && notificationsResponse.data.unreadCount !== undefined) {
          setUnreadNotifications(notificationsResponse.data.unreadCount);
        }
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-black">
  //       <p className="text-red-500 text-xl">{error}</p>
  //     </div>
  //   );
  // }

  return (
    <nav className="bg-black text-white p-2 flex items-center justify-between lg:pt-0 pl-1 sm:p-4 md:p-5 lg:p-2 w-full">
      {/* Logo */}
      <div className="flex items-center lg:pl-2 ">
        <Link to="/" className="text-2xl font-bold h-10 w-10 ">
          <img src="/letterform.png" alt="Logo" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-4 lg:pl-5">
        <input
          type="text"
          placeholder="Search..."
          className="w-full lg:w-60 p-2 rounded-2xl bg-gray-900 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all duration-500 ease-in-out lg:focus:w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Hamburger Icon for Mobile View */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="text-white focus:outline-none"
        >
          <img
            src={user?.profilePic || '/default-profile.png'}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </button>
      </div>

      {/* Links - Dropdown on Mobile */}
      <div
        className={`lg:flex items-center lg:space-x-4 ${
          isNavOpen ? 'block' : 'hidden'
        } lg:block absolute lg:static bg-black lg:bg-transparent w-full lg:w-auto top-16 left-0 lg:top-auto lg:left-auto z-50 lg:z-auto`}
      >
        {user ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 px-4 lg:px-0 py-4 lg:py-0">
            <Link to="/profile" className="hover:text-gray-400 flex items-center py-2 lg:hidden">
              <img
                src={user?.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <p className="ml-2">My Profile</p>
            </Link>

            <Link to="/create" className="hover:text-gray-400 flex items-center py-2 lg:pl-6 lg:pr-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 5l3 3m0 0l-3 3m3-3H4v8h12V8zM4 6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H6l-2 2z"
                />
              </svg>
              <p className="ml-2">Write</p>
            </Link>

            <Link to="/notifications" className="hover:text-gray-400 flex items-center py-2 lg:pr-6 lg:pl-3 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M14 5v2a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3V5m4 0a1 1 0 0 1 1 1v2h-2V6a1 1 0 0 1 1-1zm-2 11v1a2 2 0 1 1-4 0v-1m2 0a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2z"
                />
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute bg-red-600 text-white text-xs font-bold rounded-full px-2">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <div className="hidden lg:block h-10 w-10">
          <Link to="/profile" className="py-2">
            <img
              src={user?.profilePic || '/default-profile.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
          </div>
          
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 px-4 lg:px-0 py-4 lg:py-0">
            <Link to="/login" className="hover:text-gray-400 py-2">
              Login
            </Link>
            <Link to="/signup" className="hover:text-gray-400 py-2">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
