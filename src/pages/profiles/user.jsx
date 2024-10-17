import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import MyArticles from '../../components/MyArticles';
import Bookmarks from '../../components/Bookmarks';
import Library from '../../components/Library';

// Inline SVG Icons
const BookIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M5 3a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-4-4A2 2 0 0011.586 3H5z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M5 3a2 2 0 00-2 2v14l7-5 7 5V5a2 2 0 00-2-2H5z" />
  </svg>
);

const LibraryIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </svg>
);

const ProfilePage = () => {
  const [activePage, setActivePage] = useState('MyArticles');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'https://article-back.onrender.com/api/article/user';

  const handleLinkClick = (page) => {
    setActivePage(page);
    setIsNavOpen(false);
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowPopup(true); 
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload a JPEG, PNG, or GIF image.');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size exceeds the 5MB limit.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result;

        try {
          setUploading(true);
          const response = await axios.put(
            `${API_BASE_URL}/update`,
            {
              profilePic: base64String,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          setUser((prevUser) => ({
            ...prevUser,
            profilePic: response.data.profilePic,
          }));
          setError(null);
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          setError('Failed to update profile picture');
        } finally {
          setUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data.user);
        setError(null);
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
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar onSearch={handleSearch} />
      </nav>

      {/* Hamburger Icon for Mobile View */}
      <div className="lg:hidden p-4 bg-black text-white">
        <svg
          onClick={() => setIsNavOpen(!isNavOpen)}
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isNavOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
          />
        </svg>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`lg:w-1/4 w-full sm:h-full bg-black p-6 lg:relative absolute transition-all duration-300 z-50 border-r border-gray-900 ${
            isNavOpen ? 'left-0' : '-left-full'
          } lg:left-0`}
        >
          {/* User Profile Section */}
          {user && (
            <div className="text-center mb-8">
              <img
                src={user.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer"
                onClick={handleProfilePicClick}
              />
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400">{user.email}</p>

              {/* Hidden file input for profile pic upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Uploading Indicator */}
              {uploading && <p className="text-white mt-2">Uploading...</p>}
            </div>
          )}

          {/* Navigation Links */}
          <ul className="space-y-6">
            <li>
              <button
                onClick={() => handleLinkClick('MyArticles')}
                className={`w-full flex items-center p-3 rounded-lg transition duration-300 ${
                  activePage === 'MyArticles'
                    ? 'bg-gray-800 focus:ring-2 focus:ring-white'
                    : 'bg-black hover:bg-gray-700'
                }`}
              >
                <BookIcon />
                My Articles
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Bookmarks')}
                className={`w-full flex items-center p-3 rounded-lg transition duration-300 ${
                  activePage === 'Bookmarks'
                    ? 'bg-gray-800 focus:ring-2 focus:ring-white'
                    : 'bg-black hover:bg-gray-700'
                }`}
              >
                <BookmarkIcon />
                Bookmarks
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Library')}
                className={`w-full flex items-center p-3 rounded-lg transition duration-300 ${
                  activePage === 'Library'
                    ? 'bg-gray-800 focus:ring-2 focus:ring-white'
                    : 'bg-black hover:bg-gray-700'
                }`}
              >
                <LibraryIcon />
                My Library
              </button>
            </li>
          </ul>

          {/* Logout button fixed to the bottom of sidebar */}
          <div className="sm:absolute sm:left-0 sm:bottom-0 w-full flex justify-center mb-4">
            <button
              onClick={handleLogout}
              className="w-3/4 flex items-center justify-center p-3 bg-black hover:bg-white hover:text-black rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto flex flex-col flex-1 overflow-y-auto items-center justify-start p-6 bg-black">
          <h1 className="text-white text-2xl font-bold mb-6">{activePage}</h1>

          {/* Render active content based on selected page */}
          {activePage === 'MyArticles' && <MyArticles />}
          {activePage === 'Bookmarks' && <Bookmarks />}
          {activePage === 'Library' && <Library />}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 text-green-500 flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="bg-black p-6 rounded-lg text-center">
            <h3 className="text-lg text-green-500 font-bold mb-2">Success!</h3>
            <p>Logged out succsessfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
