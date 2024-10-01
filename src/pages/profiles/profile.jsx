import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import ArticleCard from '../../components/articleCards';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="text-center text-black">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Fetch user data and articles
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); 
      try {
        // Fetch the profile user data
        const userResponse = await axios.get(`http://127.0.0.1:1234/api/article/user/user/${userId}`);
        const userData = userResponse.data.user;
        setUser(userData);

        // Fetch current logged-in user profile to check following status
        const currentUserResponse = await axios.get(`http://127.0.0.1:1234/api/article/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem('token')}`,
          },
        });
        const currentUser = currentUserResponse.data.user;
        setIsFollowing(currentUser.following.includes(userData._id)); 

        const articlesResponse = await axios.get(`http://127.0.0.1:1234/api/article/post/article/${userId}`);
        const articlesData = articlesResponse.data.posts || [];
        console.log(articlesData);
        setArticles(articlesData);
        setFilteredArticles(articlesData);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || 'Failed to fetch user or articles data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const Popup = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-black p-8 rounded-lg shadow-2xl transform transition-transform duration-300 scale-100 hover:scale-105">
          <p className="text-lg text-center text-white font-medium">{message}</p>
          <button 
            onClick={onClose} 
            className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200">
            Close
          </button>
        </div>
      </div>
    );
  };
  

  // Handle article click to navigate to ArticleView
  const handleArticleClick = (article) => {
    navigate(`/articles/${article._id}`); 
  };

  // Debounced filtering of articles based on search query
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (articles.length > 0) {
        const filtered = articles.filter((article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredArticles(filtered);
      } else {
        setFilteredArticles([]); 
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, articles]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  // Handle following the author with optimistic UI update
  const followAuthor = async () => {
    setFollowLoading(true);
    setIsFollowing(true); // Optimistically update the UI
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${user._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage?.getItem('token')}`,
        },
      });
      setPopupMessage('Successfully followed the author!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error following:', error);
      setIsFollowing(false); 
      setPopupMessage('Failed to follow the author.');
      setShowPopup(true);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle unfollowing the author with optimistic UI update
  const unfollowAuthor = async () => {
    setFollowLoading(true);
    setIsFollowing(false); // Optimistically update the UI
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${user._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage?.getItem('token')}`,
        },
      });
      setPopupMessage('Successfully unfollowed the author!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error unfollowing:', error);
      setIsFollowing(true); // Revert if request fails
      setPopupMessage('Failed to unfollow the author.');
      setShowPopup(true);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar />
      </nav>

      {/* Hamburger Icon for Profile Toggle (Mobile) */}
      <div className="lg:hidden flex justify-start p-4">
        <svg 
          onClick={toggleProfileVisibility} 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 cursor-pointer" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-label="Toggle Profile"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`lg:w-1/4 w-full sm:h-full bg-black p-6 lg:relative absolute transition-transform duration-300 ease-in-out transform ${isProfileVisible ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50 border-r border-gray-900`}>
          {user && (
            <div className="text-center mb-8">
              <img
                src={user.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg ring-4 ring-gray-700"
              />
              <h2 className="text-2xl font-semibold text-white">{user.firstName || 'N/A'} {user.lastName || 'N/A'}</h2>
              <p className="text-gray-400 mb-2">{user.email || 'No email available'}</p>
              <div className="flex justify-center space-x-4 mb-4">
                <span className="text-gray-400">Followers: <strong className="text-white">{user.followers?.length || 0}</strong></span>
                <span className="text-gray-400">Following: <strong className="text-white">{user.following?.length || 0}</strong></span>
              </div>
              <button
                onClick={isFollowing ? unfollowAuthor : followAuthor}
                className={`mt-4 px-6 py-2 rounded-full ${isFollowing ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white transition duration-200 ease-in-out shadow-md transform hover:scale-105`}
                disabled={followLoading}
              >
                {followLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Articles by {user?.firstName || 'User'} {user?.lastName || ''}</h1>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full md:w-1/2 p-3 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-1 focus:ring-gray-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

           {/* Articles Grid */}
           <div className="grid gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((articleItem) => (
                <ArticleCard
                  key={articleItem._id}
                  title={articleItem.title}
                  description={articleItem.description}
                  image={articleItem.image}
                  categories={articleItem.categories}
                  onClick={() => handleArticleClick(articleItem)}
                />
              ))
            ) : (
              <p className="text-white text-center">No articles found. {user?.firstName} hasn't written any articles yet!</p>
            )}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup 
          message={popupMessage} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </div>
  );
};

export default UserProfilePage;
