import React, { useState, useEffect } from 'react';
import ArticleCard from '../../components/articleCards'; // Make sure to adjust the path accordingly

const ArticleViewingPage = ({ articleId }) => {
//   const [article, setArticle] = useState(null);
//   const [relatedArticles, setRelatedArticles] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [comment, setComment] = useState('');

//   useEffect(() => {
//     // Fetch the article by ID
//     const fetchArticle = async () => {
//       const response = await fetch(`/api/articles/${articleId}`);
//       const data = await response.json();
//       setArticle(data);
//     };

//     // Fetch related articles by category
//     const fetchRelatedArticles = async () => {
//       const response = await fetch(`/api/articles/related/${articleId}`);
//       const data = await response.json();
//       setRelatedArticles(data);
//     };

//     // Fetch comments for the article
//     const fetchComments = async () => {
//       const response = await fetch(`/api/articles/${articleId}/comments`);
//       const data = await response.json();
//       setComments(data);
//     };

//     fetchArticle();
//     fetchRelatedArticles();
//     fetchComments();
//   }, [articleId]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!comment) return;

//     // Submit the new comment
//     const response = await fetch(`/api/articles/${articleId}/comments`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text: comment }),
//     });

//     if (response.ok) {
//       const newComment = await response.json();
//       setComments((prevComments) => [...prevComments, newComment]);
//       setComment('');
//     }
//   };

//   if (!article) return <p className="text-white">Loading...</p>;

//   return (
//     <div className="bg-black text-white">
//       {/* Header */}
//       <div className="p-6">
//         <h1 className="text-3xl font-bold">{article.title}</h1>
//         <p className="text-gray-400">By {article.author} on {new Date(article.createdAt).toLocaleDateString()}</p>
//       </div>

//       {/* Main Content Area */}
//       <div className="p-6">
//         <div className="article-content">
//           <p>{article.content}</p>
//         </div>
//         {/* View Count */}
//         <div className="mt-4 text-gray-400">
//           <span>Views: {article.viewCount}</span>
//         </div>
//       </div>

//       {/* Related Articles Section */}
//       <div className="p-6 bg-gray-800">
//         <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
//         <ul>
//           {relatedArticles.map((relatedArticle) => (
//             <li key={relatedArticle.id} className="border-b border-gray-600 pb-2 mb-2">
//               <a href={`/article/${relatedArticle.id}`} className="hover:text-blue-500">
//                 {relatedArticle.title}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Comment Section */}
//       <div className="p-6 bg-gray-800 mt-6">
//         <h2 className="text-2xl font-bold mb-4">Comments</h2>
//         {/* Comment input form */}
//         <form onSubmit={handleCommentSubmit} className="mb-4">
//           <textarea
//             className="w-full p-2 bg-gray-700 text-white"
//             rows="4"
//             placeholder="Leave a comment..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//           <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
//             Submit
//           </button>
//         </form>

//         {/* Render existing comments */}
//         {comments.map((comment, index) => (
//           <div key={index} className="border-b border-gray-600 pb-2 mb-2">
//             <p className="font-semibold">{comment.author}</p>
//             <p>{comment.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
};

export default ArticleViewingPage;
