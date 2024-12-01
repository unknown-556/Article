import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../../components/articleCards";
import Navbar from "../../components/NavBar";

const CommunityPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get(
          `https://article-back.onrender.com/api/article/community/single/6737ab94dfa80ca65798f37b`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setCommunity(response.data.community);

        const articlesResponse = await axios.get(
          `https://article-back.onrender.com/api/article/community/posts/6737ab94dfa80ca65798f37b`
        );
        setPosts(articlesResponse.data.posts || []);
      } catch (error) {
        setError("Failed to fetch community data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  useEffect(() => {
    if (community) {
      const fetchCurrentUser = async () => {
        try {
          const currentUserResponse = await axios.get(
            `https://article-back.onrender.com/api/article/user/profile`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          const currentUser = currentUserResponse.data.user;
          setIsJoined(
            community?.members.some((member) => member.userId === currentUser._id)
          );
        } catch (error) {
          setError("Failed to fetch user profile.");
        }
      };
      fetchCurrentUser();
    }
  }, [community]);

  const handleJoinCommunity = async () => {
    try {
      await axios.post(
        `https://article-back.onrender.com/api/article/community/join/${communityId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setIsJoined(true);
      setPopupMessage("You joined this community!");
      setShowPopup(true);
    } catch {
      setPopupMessage("Failed to join community.");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = posts.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, posts]);

  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar />
      </nav>
  
      {/* Header */}
      <header className="bg-gray-900 py-6 border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{community?.name}</h1>
              <p className="text-gray-400 mt-2">{community?.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleJoinCommunity}
                className={`px-4 py-2 mr-2 rounded ${
                  isJoined
                    ? "bg-black rounded-2xl outline outline-2 cursor-not-allowed"
                    : "bg-white text-black hover:bg-blue-900"
                }`}
                disabled={isJoined}
              >
                {isJoined ? "Joined" : "Join Community"}
              </button>
              <Link to={`/add-article/${communityId}`}>
                <button className="px-4 py-2 bg-black rounded-2xl outline outline-2 hover:bg-gray-900">
                  Add Post
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
  
      {/* Main Content with Sidebar */}
      <div className="container mx-auto flex py-6 px-4 ">
        {/* Main Section */}
        <div className="flex-grow pr-6 border-r border-gray-900">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full p-3 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring focus:ring-blue-600"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
  
          {/* Articles */}
          <div className="grid gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article._id}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                  categories={article.categories}
                  onClick={() => navigate(`/articles/${article._id}`)}
                />
              ))
            ) : (
              <p className="text-gray-400">No posts available in this community.</p>
            )}
          </div>
        </div>
  
        {/* Sidebar */}
        <aside className="w-1/4 h-full bg-black p-4 rounded-lg ">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p className="text-gray-400">{community?.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(community?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
          <p className="text-sm text-gray-400 mt-1">Members: {community?.members?.length}</p>
          </div>
        </aside>
      </div>
  
      {/* Popup */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
  
  
};

// Helper Components
const Loading = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <p className="text-white text-xl">Loading...</p>
  </div>
);

const Error = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-black">
    <p className="text-red-500 text-xl">{message}</p>
  </div>
);

export default CommunityPage;
