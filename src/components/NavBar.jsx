import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false); // Toggle for mobile dropdown menu

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <nav className="bg-black text-white p-3 flex items-center justify-between pl-5 sm:p-4 md:p-5 lg:p-6 w-full">
      {/* Logo */}
      <div className="flex items-center  pl-5 ">
        <Link to="/" className="text-2xl font-bold h-10 w-10 ">
          <img src="/letterform.png" alt="" />
        </Link>
      </div>

      {/* Search Bar (visible on all screens) */}
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
              src={user?.profilePicture || '/default-profile.png'}
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 px-4 lg:px-0 py-4 lg:py-0">
          <Link to="/profile" className="hover:text-gray-400 flex items-center py-2 lg:hidden">
            {/* Profile Picture in the Dropdown (visible only on mobile) */}
            <img
              src={user?.profilePicture || '/default-profile.png'}
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

          <Link to="/notifications" className="hover:text-gray-400 flex items-center py-2 lg:pr-6 lg:pl-3">
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
          </Link>
        </div>
        <div className="hidden lg:block h-10 w-10">
        <Link to="/profile" className="py-2">
          <img
            src={user?.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </Link>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
