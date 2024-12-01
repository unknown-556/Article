import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../../components/articleCards";

const CommunityPage = () => {
  const { communityId } = useParams(); // Get communityId from URL params
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false); // Track if user has joined the community
  const [popupMessage, setPopupMessage] = useState(""); // State for the popup message
  const [showPopup, setShowPopup] = useState(false); // Control the visibility of the popup
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query

  // Fetch community and posts data
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get(
          `https://article-back.onrender.com/api/article/community/single/6737ab94dfa80ca65798f37b`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCommunity(response.data.community);

        
        const articlesResponse = await axios.get(`http://127.0.0.1:1234/api/article/community/posts/6737ab94dfa80ca65798f37b`);
        const articlesData = articlesResponse.data.posts || [];
        console.log(articlesData);
        setPosts(articlesData)
      } catch (error) {
        setError("Failed to fetch community data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  // Fetch current user data and check if they have joined the community
  useEffect(() => {
    if (community) {
      const fetchCurrentUser = async () => {
        try {
          const currentUserResponse = await axios.get(
            `https://article-back.onrender.com/api/article/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${localStorage?.getItem("token")}`,
              },
            }
          );
          const currentUser = currentUserResponse.data.user;
          setIsJoined(community?.members.some(member => member.userId === currentUser._id));
        } catch (error) {
          setError("Failed to fetch user profile.");
        }
      };
      fetchCurrentUser();
    }
  }, [community]);

  // Handle joining the community
  const handleJoinCommunity = async () => {
    try {
      await axios.post(
        `https://article-back.onrender.com/api/article/community/join/${communityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsJoined(true);
      setPopupMessage('You joined this community!');
      setShowPopup(true);
    } catch (error) {
      setPopupMessage('Failed to join community.');
      setShowPopup(true);
    }
  };

  // Debounced filtering of articles based on search query
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (posts.length > 0) {
        const filtered = posts.filter((article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredArticles(filtered);
      } else {
        setFilteredArticles([]); 
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, posts]);

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle article click to navigate to ArticleView
  const handleArticleClick = (article) => {
    navigate(`/articles/${article._id}`); 
  };

  // Close the popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Hide popup after 3 seconds
      return () => clearTimeout(timeout); // Cleanup on component unmount or when showPopup changes
    }
  }, [showPopup]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Community Header */}
      <header className="bg-gray-800 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">{community.name}</h1>
          <p className="mt-2 text-gray-400">{community.description}</p>
          <div className="mt-4">
            <span className="text-sm text-gray-400">
              Members: {community.members.length}
            </span>
            <button
              onClick={handleJoinCommunity}
              className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
              disabled={isJoined}
            >
              {isJoined ? "Joined" : "Join Community"}
            </button>
          </div>
          <div>
            <Link to={`/add-article/${communityId}`}>
              <button className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition">
                Add Post
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Posts Section */}
      <section className="container mx-auto py-8 px-4">
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
            <p className="text-gray-400">No posts available in this community.</p>
          )}
        </div>
      </section>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;



;
