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
  const [selectedFile, setSelectedFile] = useState(null); // For profile pic upload
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

  const handleProfilePicClick = () => {
    // Trigger the hidden file input
    document.getElementById('fileInput').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result;

        try {
          const response = await axios.put('http://127.0.0.1:1234/api/article/user/update', {
            profilePic: base64String, // Send base64 string to the server
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          // Update user profile with the new picture
          setUser((prevUser) => ({
            ...prevUser,
            profilePic: response.data.profilePic,
          }));
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          setError('Failed to update profile picture');
        }
      };

      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:1234/api/article/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data.user);
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
            d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`lg:w-1/4 w-full sm:h-full bg-black p-6 lg:relative absolute transition-all duration-300 z-50 border-r border-gray-900 ${isNavOpen ? 'left-0' : '-left-full'} lg:left-0`}
        >
          {/* User Profile Section */}
          {user && (
            <div className="text-center mb-8">
              <img
                src={user.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer"
                onClick={handleProfilePicClick} // On profile pic click
              />
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-400">{user.email}</p>

              {/* Hidden file input for profile pic upload */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Navigation Links */}
          <ul className="space-y-6">
            <li>
              <button
                onClick={() => handleLinkClick('MyArticles')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${activePage === 'MyArticles' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'}`}
              >
                My Articles
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Bookmarks')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${activePage === 'Bookmarks' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'}`}
              >
                Bookmarks
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('Library')}
                className={`w-full block text-left p-3 rounded-lg transition duration-300 ${activePage === 'Library' ? 'focus:ring-2 focus:ring-white' : 'bg-black hover:ring-1 hover:ring-white'}`}
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
        <div className="mx-auto flex-col flex-1 overflow-y-auto items-center justify-center">
          <h1 className="text-black text-2xl font-bold mb-6">{activePage}</h1>

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
