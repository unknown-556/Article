// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom'; 
// import axios from 'axios';
// import Navbar from '../../components/NavBar';
// import LoadingSpinner from '../../components/LoadingSpinner'; // Add a loading spinner component if necessary
// import ErrorMessage from '../../components/ErrorMessage'; // Add an error message component

const ArticleView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [article, setArticle] = useState(null);
//   const [relatedArticles, setRelatedArticles] = useState([]);
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isInLibrary, setIsInLibrary] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [actionLoading, setActionLoading] = useState({ bookmark: false, library: false, follow: false });

//   const getLoggedInUserProfile = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:1234/api/article/user/profile`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       return response.data.user;
//     } catch (error) {
//       setError('Error fetching user profile.');
//       return null;
//     }
//   };

//   const fetchArticle = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:1234/api/article/post/single/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setArticle(response.data.article);
//       setLoading(false);
//       checkUserBookmark(response.data.article._id);
//       checkUserLibrary(response.data.article._id);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to fetch article.');
//       setLoading(false);
//     }
//   };

//   const getAuthor = async (authorId) => {
//     try {
//       if (authorId) {
//         const response = await axios.get(`http://127.0.0.1:1234/api/article/user/author/${authorId}`);
//         setAuthor(response.data.user);
//         checkUserFollowing(response.data.user._id);
//       }
//     } catch (error) {
//       setError('Error fetching author details.');
//     }
//   };

//   const checkUserBookmark = async (articleId) => {
//     try {
//       const user = await getLoggedInUserProfile();
//       if (user && user.bookMarks) {
//         setIsBookmarked(user.bookMarks.includes(articleId));
//       }
//     } catch (error) {
//       setError('Error checking bookmarks.');
//     }
//   };

//   const checkUserLibrary = async (articleId) => {
//     try {
//       const user = await getLoggedInUserProfile();
//       if (user && user.library) {
//         setIsInLibrary(user.library.includes(articleId));
//       }
//     } catch (error) {
//       setError('Error checking library.');
//     }
//   };

//   const checkUserFollowing = async (authorId) => {
//     try {
//       const user = await getLoggedInUserProfile();
//       if (user && user.following) {
//         setIsFollowing(user.following.includes(authorId));
//       }
//     } catch (error) {
//       setError('Error checking following status.');
//     }
//   };

//   const fetchRelatedArticles = async () => {
//     try {
//       const categories = article?.categories;
//       if (categories && categories.length > 0) {
//         const categoriesParam = categories.join(',');
//         const response = await axios.get(`http://127.0.0.1:1234/api/article/post/related/${categoriesParam}`);
//         setRelatedArticles(response.data.posts);
//       }
//     } catch (error) {
//       setError('Error fetching related articles.');
//     }
//   };

//   const handleBookmark = async () => {
//     setActionLoading({ ...actionLoading, bookmark: true });
//     try {
//       await axios.post(`http://127.0.0.1:1234/api/article/user/bookmark/${article._id}`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setIsBookmarked(true);
//       alert('Article bookmarked!');
//     } catch (error) {
//       alert('Failed to bookmark the article.');
//     } finally {
//       setActionLoading({ ...actionLoading, bookmark: false });
//     }
//   };

//   const handleAddToLibrary = async () => {
//     setActionLoading({ ...actionLoading, library: true });
//     try {
//       await axios.post(`http://127.0.0.1:1234/api/article/user/library/${article._id}`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setIsInLibrary(true);
//       alert('Article added to library!');
//     } catch (error) {
//       alert('Failed to add the article to library.');
//     } finally {
//       setActionLoading({ ...actionLoading, library: false });
//     }
//   };

//   const followAuthor = async () => {
//     setActionLoading({ ...actionLoading, follow: true });
//     try {
//       await axios.post(`http://127.0.0.1:1234/api/article/user/follow/${author._id}`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setIsFollowing(true);
//       alert('Successfully followed the author!');
//     } catch (error) {
//       alert('Failed to follow the author.');
//     } finally {
//       setActionLoading({ ...actionLoading, follow: false });
//     }
//   };

//   const unfollowAuthor = async () => {
//     setActionLoading({ ...actionLoading, follow: true });
//     try {
//       await axios.post(`http://127.0.0.1:1234/api/article/user/unfollow/${author._id}`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setIsFollowing(false);
//       alert('Successfully unfollowed the author!');
//     } catch (error) {
//       alert('Failed to unfollow the author.');
//     } finally {
//       setActionLoading({ ...actionLoading, follow: false });
//     }
//   };

//   useEffect(() => {
//     fetchArticle();
//   }, [id]);

//   useEffect(() => {
//     if (article) {
//       getAuthor(article.postedBy);
//       fetchRelatedArticles();
//     }
//   }, [article]);

//   if (loading) {
//     return <LoadingSpinner />; // Replace with your spinner component
//   }

//   if (error) {
//     return <ErrorMessage message={error} />; // Replace with your error message component
//   }

//   if (!article) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black">
//         <p className="text-white text-xl">No article found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-black text-white">
//       <Navbar />
//       <div className="flex flex-col md:flex-row flex-1 mx-auto p-8 space-y-8 md:space-y-0 md:space-x-8">
//         <div className="flex-1">
//           <div className="flex space-x-4 mb-4">
//             <button
//               onClick={handleBookmark}
//               disabled={isBookmarked || actionLoading.bookmark}
//               className={`flex items-center px-4 py-2 rounded-full ${isBookmarked ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'} text-white transition duration-150`}
//             >
//               {actionLoading.bookmark ? <LoadingSpinner /> : 'Bookmark'}
//             </button>
//             <button
//               onClick={handleAddToLibrary}
//               disabled={isInLibrary || actionLoading.library}
//               className={`flex items-center px-4 py-2 rounded-full ${isInLibrary ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'} text-white transition duration-150`}
//             >
//               {actionLoading.library ? <LoadingSpinner /> : 'Add to Library'}
//             </button>
//           </div>
//           <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
//           <p className="text-gray-400 mb-6">{article.description}</p>
//           <div className="text-white" dangerouslySetInnerHTML={{ __html: article.content }}></div>
//         </div>

//         <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-md">
//           <h2 className="text-2xl font-semibold mb-4">Author: {author?.name}</h2>
//           {author && (
//             <button
//               onClick={isFollowing ? unfollowAuthor : followAuthor}
//               className={`px-4 py-2 rounded-full ${isFollowing ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition duration-150`}
//               disabled={actionLoading.follow}
//             >
//               {actionLoading.follow ? <LoadingSpinner /> : isFollowing ? 'Unfollow' : 'Follow'}
//             </button>
//           )}
//         </div>
//       </div>

//       {relatedArticles.length > 0 && (
//         <div className="bg-gray-900 p-4">
//           <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {relatedArticles.map((relatedArticle) => (
//               <Link key={relatedArticle._id} to={`/article/${relatedArticle._id}`} className="block p-4 bg-gray-800 rounded-md">
//                 <h3 className="text-lg font-bold mb-2">{relatedArticle.title}</h3>
//                 <p className="text-gray-400">{relatedArticle.description}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
 };

export default ArticleView;
