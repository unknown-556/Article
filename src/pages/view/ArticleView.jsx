import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); 
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ text: '' });

  const Popup = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-black p-6 rounded shadow-lg">
          <p className="text-center text-green">{message}</p>
          <button 
            onClick={onClose} 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData)

  const addComment = async (comment) => {
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/post/comment/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    });
      setPopupMessage('Comment added!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }



  const getLoggedInUserProfile = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:1234/api/article/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };


  const fetchArticle = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:1234/api/article/post/single/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setArticle(response.data.article);
      setLoading(false);
      checkUserBookmark(response.data.article._id);
      checkUserLibrary(response.data.article._id);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch article.');
      setLoading(false);
    }
  };


  const getAuthor = async (authorId) => {
    try {
      if (authorId) {
        const response = await axios.get(`http://127.0.0.1:1234/api/article/user/author/${authorId}`);
        setAuthor(response.data.user);
        checkUserFollowing(response.data.user._id); // Check if the current user is following the author
      }
    } catch (error) {
      console.error('Error fetching author:', error);
    }
  };

  // Check if the article is bookmarked by the user
  const checkUserBookmark = async (articleId) => {
    try {
      const user = await getLoggedInUserProfile();
      if (user && user.bookMarks) {
        setIsBookmarked(user.bookMarks.includes(articleId));
      }
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  // Check if the article is in the user's library
  const checkUserLibrary = async (articleId) => {
    try {
      const user = await getLoggedInUserProfile();
      if (user && user.library) {
        setIsInLibrary(user.library.includes(articleId));
      }
    } catch (error) {
      console.error('Error checking library:', error);
    }
  };

  // Check if the current user is following the author
  const checkUserFollowing = async (authorId) => {
    try {
      const user = await getLoggedInUserProfile();
      if (user && user.following) {
        setIsFollowing(user.following.includes(authorId));
      }
    } catch (error) {
      console.error('Error checking following status:', error);
    }
  };

  // Fetch related articles based on categories
  const fetchRelatedArticles = async () => {
    try {
      const categories = article?.categories;
      if (categories && categories.length > 0) {
        const categoriesParam = categories.join(','); // Assuming API expects comma-separated categories
        const response = await axios.get(`http://127.0.0.1:1234/api/article/post/related/${categoriesParam}`);
        setRelatedArticles(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  // Handle bookmarking the article
  const handleBookmark = async () => {
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/bookmark/${article._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsBookmarked(true);
      setPopupMessage('Article bookmarked!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error bookmarking article:', error);
      alert('Failed to bookmark the article.');
    }
  };

  // Handle adding the article to the library
  const handleAddToLibrary = async () => {
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/library/${article._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsInLibrary(true);
      setPopupMessage('Article added to library!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error adding article to library:', error);
      alert('Failed to add the article to library.');
    }
  };

  // Handle following the author
  const followAuthor = async () => {
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${author._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFollowing(true);
      setPopupMessage('Successfully followed the author!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error following the author:', error);
      alert('Failed to follow the author.');
    }
  };

  // Handle unfollowing the author
  const unfollowAuthor = async () => {
    try {
      await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${author._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFollowing(false);
      setPopupMessage('Successfully unfollowed the author!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error unfollowing the author:', error);
      alert('Failed to unfollow the author.');
    }
  };

  useEffect(() => {
    fetchArticle(); // Fetch the article when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (article) {
      getAuthor(article.postedBy); // Fetch author details
      fetchRelatedArticles(); // Fetch related articles
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

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

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white text-xl">No article found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar />
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 mx-auto p-8 space-y-8 md:space-y-0 md:space-x-8 border-b border-gray-900">
        {/* Article Section */}
        <div className="flex-1 border-b border-gray-900">
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleBookmark}
              className={`flex items-center px-4 py-2 rounded-full ${isBookmarked ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white transition duration-150`}
              disabled={isBookmarked}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8V21l7-4 7 4V8a3 3 0 00-3-3H8a3 3 0 00-3 3z" />
              </svg>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={handleAddToLibrary}
              className={`flex items-center px-4 py-2 rounded-full ${isInLibrary ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white transition duration-150`}
              disabled={isInLibrary}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm16 0L4 20M4 4l16 16" />
              </svg>
              {isInLibrary ? 'In Library' : 'Add to Library'}
            </button>
          </div>

          <p className="text-gray-500 ">{new Date(article.createdAt).toLocaleString()}</p>

          {/* View Count */}
          <div className="flex items-center mb-4 text-sm text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4C7.589 4 4 7.589 4 12s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            <span>Views: {article.viewCount || 0}</span>
          </div>

          

          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

          {/* Author Section */}
          {author && (
            <div className="flex items-center mb-6">
              <img
                src={author.profilePic || '/default-profile.png'}
                alt={`${author.firstName} ${author.lastName}`}
                className="w-12 h-12 rounded-full mr-4 cursor-pointer"
                onClick={() => navigate(`/author/${author._id}`)}
              />
              <div>
                <p className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/author/${author._id}`)}>
                  {`${author.firstName} ${author.lastName}`}
                </p>
                {/* <p className="text-gray-400">Followers: {author.followers?.length || 0}</p>
                <p className="text-gray-400">Following: {author.following?.length || 0}</p> */}
              </div>
              <button
                onClick={isFollowing ? unfollowAuthor : followAuthor}
                className={`ml-auto px-4 py-2 rounded-full ${isFollowing ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition duration-150`}
                disabled={!author._id} // Disable if author data isn't loaded
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          )}

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
            className="text-lg leading-8 mb-8 "
            dangerouslySetInnerHTML={{ __html: article.content || 'No content available for this article.' }}
          />

      {/* Comments Section */}
        <div className="mt-8 bg-black p-6  shadow-lg border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-white">Comments</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addComment(formData.text);
            }}
            className="flex flex-col mb-4"
          >
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Add a comment..."
              className="resize-none h-24 p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              required
            />
            <button
              type="submit"
              className="mt-3 px-4 py-2 bg-black hover:bg-white hover:text-black rounded-lg shadow transition duration-200"
            >
              Submit Comment
            </button>
          </form>
          </div>

          {/* List of Comments */}
          <div>
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment, index) => (
                <div key={index} className="border-b border-gray-700 py-3">
                  <Link to={`/author/${comment.userId}`}>
                    <p className="text-sm font-semibold text-blue-400 hover:underline">{comment.postedBy}</p>
                  </Link>
                  <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>


        {/* Related Articles Section */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
          <div className="space-y-4">
            {relatedArticles.map((relatedArticle) => (
              <Link to={`/article/${relatedArticle._id}`} key={relatedArticle._id} className="block p-4 bg-black rounded-lg hover:bg-gray-700 transition duration-150 border-b border-gray-800">
                <h3 className="text-lg font-bold">{relatedArticle.title}</h3>
                <p className="text-gray-400">{relatedArticle.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ArticleView;