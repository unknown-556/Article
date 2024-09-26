import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import ArticleCard from '../../components/articleCards';

const UserProfilePage = () => {
  const { userId } = useParams(); // Capture user ID from the URL
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileVisible, setIsProfileVisible] = useState(false); // State to manage profile visibility

  // Fetch the user by ID, then use the userId to fetch their articles
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://127.0.0.1:1234/api/article/user/user/66e5c5e67c08e2d53d08bd9a`);
        const userData = userResponse.data.user;
        setUser(userData);

        const articlesResponse = await axios.get(`http://127.0.0.1:1234/api/article/post/article/66e5c5e67c08e2d53d08bd9a`);
        const articlesData = articlesResponse.data.posts || [];
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

  // Search functionality
  useEffect(() => {
    if (articles && articles.length > 0) {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles([]); // Reset filtered articles if articles is empty
    }
  }, [searchQuery, articles]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Toggle function for profile section
  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar />
      </nav>

      {/* Hamburger Icon for Profile Toggle */}
      <div className="lg:hidden flex justify-start p-4">
        <svg 
          onClick={toggleProfileVisibility} 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 cursor-pointer" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`lg:w-1/4 w-full sm:h-full bg-black p-6 lg:relative absolute transition-all duration-300 z-50 border-r border-gray-900 ${isProfileVisible ? 'block' : 'hidden lg:block'}`}>
          {/* User Profile Section */}
          {user && (
            <div className="text-center mb-8">
              <img
                src={user.profilePic || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">Followers: {user.followers?.length || 0}</p>
              <p className="text-gray-400">Following: {user.following?.length || 0}</p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Articles by {user?.firstName} {user?.lastName}</h1>

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
          <div className="items-center justify-center">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id} // Ensure the key is unique
                  title={article.title}
                  description={article.description}
                  image={article.image}
                  categories={article.categories}
                />
              ))
            ) : (
              <p className="text-white">No articles found matching your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
