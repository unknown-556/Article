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
  const [alertLink, setAlertLink] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false); 
  const navigate = useNavigate()

  const handleLinkClick = (page) => {
    setActivePage(page);
    setAlertLink(`You are viewing ${page}`);
    setIsNavOpen(false); // Close the navbar on mobile after clicking a link
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

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="flex flex-col h-screen">
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

        <div className="flex flex-1">
          {/* Left Navigation Bar - Visible on toggle in Mobile and always on Desktop */}
          <div
            className={`lg:flex flex-col w-64 bg-black text-white p-4 absolute lg:relative z-50 ${
              isNavOpen ? 'block' : 'hidden'
            } lg:block`}
          >
            {/* Display user profile details */}
            {user && (
              <div className="profile-info text-center mb-8 w-1/2 mx-auto sm:w-1/2">
              <img
                src={user.profilePicture || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            
            )}

            {/* Navigation Links */}
            <nav>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleLinkClick('MyArticles')}
                    className={`w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white ${
                      activePage === 'MyArticles'
                        ? 'focus:ring-2 focus:ring-white'
                        : ''
                    }`}
                  >
                    My Articles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('Bookmarks')}
                    className={`w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white ${
                      activePage === 'Bookmarks'
                        ? 'focus:ring-2 focus:ring-white'
                        : ''
                    }`}
                  >
                    Bookmarks
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('Library')}
                    className={`w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white ${
                      activePage === 'Library'
                        ? 'focus:ring-2 focus:ring-white'
                        : ''
                    }`}
                  >
                    My Library
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className='w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white '
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-black text-white p-8 lg:pl-0">
            <h1>{activePage}</h1>
            {/* Render alert for the clicked link */}
            {alertLink && <p className="text-green-400">{alertLink}</p>}
            {/* Conditionally render content based on active page */}
            {activePage === 'MyArticles' && <MyArticles />}
            {activePage === 'Bookmarks' && <Bookmarks />}
            {activePage === 'Library' && <Library />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
