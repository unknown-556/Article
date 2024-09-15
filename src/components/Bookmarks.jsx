import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from './articleCards';




const Bookmarks = ({ onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:1234/api/article/post/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedArticles = response.data?.allArticles || [];
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (articles && articles.length > 0) {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full p-3 rounded-xl bg-gray-900 focus:outline-none "
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Articles Grid */}
      <div className="border-b border-gray-600">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              description={article.description}
              image={article.image}
              categories={article.categories}
              onClick={() => onArticleClick(article)}
            />
            
          ))
        ) : (
          <div>No articles found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;


