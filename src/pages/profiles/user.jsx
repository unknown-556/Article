// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import MyArticles from '../../components/MyArticles';
import Bookmarks from '../../components/Bookmarks';
import Library from '../../components/Library';

const ProfilePage = () => {
  const [activePage, setActivePage] = useState('MyArticles');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (page) => {
    setActivePage(page);
    setIsNavOpen(false);
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-600">
        <Navbar onSearch={handleSearch} />
      </nav>

       {/* Toggle Button for Mobile View */}
       <div className="lg:hidden p-4 bg-black text-white">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="text-white bg-black p-2 rounded-md"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
          </button>
        </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        <div
          className={`lg:w-1/4 w-full sm:h-full bg-black p-6 lg:relative absolute transition-all duration-300 z-50  ${
            isNavOpen ? 'left-0' : '-left-full'
          } lg:left-0`}
        >
          {/* Toggle Button for Mobile View
          <div className="lg:hidden p-4 bg-black text-white">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-white bg-black p-2 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div> */}

          {/* User Profile Section */}
          {user && (
            <div className="text-center mb-8">
              <img
                src={user.profilePicture || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          )}

          {/* Navigation Links */}
          <ul className="space-y-6">
            <li>
              <button
                onClick={() => handleLinkClick('MyArticles')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${
                  activePage === 'MyArticles' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'
                }`}
              >
                My Articles
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Bookmarks')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${
                  activePage === 'Bookmarks' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'
                }`}
              >
                Bookmarks
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Library')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${
                  activePage === 'Library' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'
                }`}
              >
                My Library
              </button>
            </li>
          </ul>

          {/* Logout button fixed to the bottom of sidebar */}
          <div className="sm:absolute sm:left-0 sm:bottom-0 w-full flex justify-center mb-4">
            <button
              onClick={handleLogout}
              className="w-3/4 block text-center p-3 bg-black hover:bg-white hover:text-black rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">{activePage}</h1>

          {/* Render active content based on selected page */}
          {activePage === 'MyArticles' && <MyArticles />}
          {activePage === 'Bookmarks' && <Bookmarks />}
          {activePage === 'Library' && <Library />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
