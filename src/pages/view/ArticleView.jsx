import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the article ID from the URL
import axios from 'axios';

const ArticleView = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]); // State for related articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:1234/api/article/post/single/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setArticle(response.data.article); // Ensure correct path to the article data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchRelatedArticles = async () => {
      try {

        const categories = article.categories.join(',');

        console.log(categories)

        const response = await axios.get(`http://127.0.0.1:1234/api/article/post/related/${categories}`, {
            // Additional config options if needed
        });
        setRelatedArticles(response.data.posts); // Adjust path according to your API response
        console.log(response.data.posts)
      } catch (error) {
        console.error('Error fetching related articles:', error);
      }
    };

    fetchArticle();
    fetchRelatedArticles();
  }, [id]); // Re-fetch the article if the ID changes

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
    <div className="flex mx-auto px-6 py-10 bg-black text-white">
        {/* Main Article Section */}
        <div className="flex-1">
            {/* Article Title */}
            <h1 className="text-4xl font-bold mb-8">{article.title}</h1>

            {/* Article Image */}
            {article.image && (
                <div className="mb-8 h-96 w-full">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

            {/* Article Description */}
            <p className="text-lg mb-6 italic">{article.description}</p>

            {/* Article Categories */}
            {article.categories && article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {article.categories.map((category, index) => (
                        <span
                            key={index}
                            className="px-4 py-1 rounded-full bg-gray-700 text-sm font-semibold hover:bg-gray-600 transition duration-200"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            )}

            {/* Article Content with HTML Styling */}
            <div
                className="text-lg leading-8 mb-8" // Increased font size from text-md to text-lg
                dangerouslySetInnerHTML={{ __html: article.content || 'No content available for this article.' }}
            />

            {/* Optional: Add a Comment Section */}
            <div className="border-t border-gray-600 mt-10 pt-6">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                {/* Comment Section Placeholder */}
                <div className="text-gray-400">No comments yet.</div>
            </div>
        </div>

        {/* Sidebar for Related Articles
        <div className="w-1/3 ml-6 ">
            <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                {relatedArticles.length > 0 ? (
                    relatedArticles.map((relatedArticle) => (
                        <div key={relatedArticle.id} className="mb-4">
                            <h3 className="text-lg font-semibold">
                                <a href={`/article/${relatedArticle.id}`} className="hover:underline">
                                    {relatedArticle.title}
                                </a>
                            </h3>
                            <p className="text-sm text-gray-400">{relatedArticle.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400">No related articles found.</div>
                )}
            </div>
        </div> */}
    </div>
);

};

export default ArticleView;
