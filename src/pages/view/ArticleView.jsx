import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Navbar from '../../components/NavBar';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [author, setAuthor] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); // Track if the article is bookmarked
  const [isInLibrary, setIsInLibrary] = useState(false); // Track if the article is in library
  const [isFollowing, setIsFollowing] = useState(false); // Track if the author is followed

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:1234/api/article/post/single/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setArticle(response.data.article);
      setLoading(false);
      checkUserBookmark(response.data.article._id); // Check if this article is bookmarked
      checkUserLibrary(response.data.article._id); // Check if this article is in library
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getAuthor = async (authorId) => { 
    try {
      if (authorId) {
        const response = await axios.get(`http://127.0.0.1:1234/api/article/user/author/${authorId}`);
        setAuthor(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  const getLoggedInUserProfile = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:1234/api/article/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.user; // Return user data to use it in checks
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const checkUserBookmark = async (articleId) => {
    try {
      const user = await getLoggedInUserProfile();
      if (user && user.bookMarks) {
        setIsBookmarked(user.bookMarks.includes(articleId)); // Check if the article is bookmarked
      }
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  const checkUserLibrary = async (articleId) => {
    try {
      const user = await getLoggedInUserProfile();
      if (user && user.library) {
        setIsInLibrary(user.library.includes(articleId)); // Check if the article is in library
      }
    } catch (error) {
      console.error('Error checking library:', error);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const categories = article?.categories;
      if (categories) {
        const response = await axios.get(`http://127.0.0.1:1234/api/article/post/related/${categories}`);
        setRelatedArticles(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:1234/api/article/user/bookmark/${article._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsBookmarked(true); // Set bookmark state to true
      alert('Article bookmarked!');
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const handleAddToLibrary = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:1234/api/article/user/library/${article._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsInLibrary(true); // Set library state to true
      alert('Article added to library!');
    } catch (error) {
      console.error('Error adding article to library:', error);
    }
  };

  const followAuthor = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${author._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFollowing(true);
      alert('Successfully followed the author!');
    } catch (error) {
      console.error('Error following:', error);
    }
  };

  useEffect(() => {
    fetchArticle(); // Fetch article when component mounts
  }, [id]);

  useEffect(() => {
    if (article) {
      getAuthor(article.postedBy); // Call getAuthor with the author ID
      fetchRelatedArticles(); // Fetch related articles once the article is available
    }
  }, [article]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>No article found.</div>;
  }

  return (
    <div className="flex flex-col mx-auto p-8 bg-black text-white space-y-6">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900 mb-6">
        <Navbar />
      </nav>
      
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Main Article Section */}
        <div className="flex-1">
          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
  
          {/* Author Section */}
          {author && (
            <div className="flex items-center mb-4 cursor-pointer" onClick={() => navigate(`/author/${author._id}`)}>
              <img
                src={author.profilePic}
                alt={`${author.firstName} ${author.lastName}`}
                className="w-12 h-12 rounded-full mr-3"
              />
              <span className="text-lg font-semibold">{`${author.firstName} ${author.lastName}`}</span>
              <button
                onClick={followAuthor}
                className={`ml-4 px-4 py-2 rounded-full ${isFollowing ? 'bg-gray-900' : 'bg-blue-600'} text-white hover:bg-blue-500 transition duration-150`}
                disabled={isFollowing}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
  
          {/* Views */}
          <div className="flex items-center mb-2 text-sm text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 00-10 10h2a8 8 0 018-8V2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22v-4a8 8 0 01-8-8H2a10 10 0 0010 10z" />
            </svg>
            <span>Views: {article.viewCount || 0}</span>
          </div>
  
          {/* Article Image */}
          {article.image && (
            <div className="mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
  
          {/* Article Description */}
          <p className="text-lg mb-6 italic text-gray-300">{article.description}</p>
  
          {/* Article Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-400 transition duration-150"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
  
          {/* Article Content */}
          <div
            className="text-lg leading-8 mb-8"
            dangerouslySetInnerHTML={{ __html: article.content || 'No content available for this article.' }}
          />
  
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBookmark}
              className={`flex items-center px-4 py-2 rounded-full ${isBookmarked ? 'bg-gray-600' : 'bg-blue-600'} text-white hover:bg-blue-500 transition duration-150`}
              disabled={isBookmarked}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={handleAddToLibrary}
              className={`flex items-center px-4 py-2 rounded-full ${isInLibrary ? 'bg-gray-600' : 'bg-blue-600'} text-white hover:bg-blue-500 transition duration-150`}
              disabled={isInLibrary}
            >
              {isInLibrary ? 'In Library' : 'Add to Library'}
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="lg:w-1/4">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          {relatedArticles.length > 0 ? (
            relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle._id} className="border-b border-gray-700 mb-4 pb-4">
                <h3 className="text-lg font-semibold">
                  <a href={`/articles/${relatedArticle._id}`} className="text-blue-500 hover:underline">
                    {relatedArticle.title}
                  </a>
                </h3>
                <p className="text-gray-400">{relatedArticle.description}</p>
              </div>
            ))
          ) : (
            <p>No related articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
