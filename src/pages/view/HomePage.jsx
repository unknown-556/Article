import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../../components/articleCards';
import Navbar from '../../components/NavBar';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortType, setSortType] = useState('Newest');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://article-back.onrender.com/api/article/post/all');
        const allArticles = response.data.allArticles;
        console.log(allArticles);
        setArticles(allArticles);
        setFilteredArticles(allArticles);

        const uniqueCategories = ['All', ...new Set(allArticles.flatMap((a) => a.categories))];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch articles.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/articles/${article.slug}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterAndSortArticles(category, sortType);
  };

  const handleSortChange = (type) => {
    setSortType(type);
    filterAndSortArticles(selectedCategory, type);
  };

  const filterAndSortArticles = (category, type) => {
    let filtered = articles;

    // Filter articles by category
    if (category !== 'All') {
      filtered = articles.filter((article) => article.categories.includes(category));
    }

    // Sort articles based on the selected sort type
    if (type === 'Newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === 'Most Viewed') {
      filtered = [...filtered].sort((a, b) => b.viewCount - a.viewCount);
    }

    setFilteredArticles(filtered);
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black text-white p-1 border-b border-gray-900">
        <Navbar />
      </nav>

      {/* Filters */}
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col mb-8">
          {/* Horizontal and Slidable Category Filter */}
          <div className="overflow-x-auto whitespace-nowrap mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`py-2 px-4 rounded-lg mr-2 transition duration-300 ${
                  selectedCategory === category ? 'bg-gray-600' : 'bg-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Sort Filter */}
          <select
            value={sortType}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          >
            <option value="Newest">Newest</option>
            <option value="Most Viewed">Most Viewed</option>
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6  ">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                description={article.description}
                image={article.image}
                categories={article.categories}
                onClick={() => handleArticleClick(article)}
              />
            ))
          ) : (
            <p className="text-white text-center">No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
