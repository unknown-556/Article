import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import '../../index.css';

const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    categories: []
  });

  const [previewMode, setPreviewMode] = useState(false); 
  const [imagePreview, setImagePreview] = useState(null);
  const [formPart, setFormPart] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const categories = [
    'Technology', 'Health', 'Business', 'Science', 'Programming', 'Coding', 'Psychology', 'Marketing', 'Lifestyle', 'Books',
    'Environment', 'Sports', 'Education', 'Travel', 'Art', 'Music', 'Food', 'Politics', 'Economics', 'History',
    'Fashion', 'Entertainment', 'Culture', 'Finance', 'Nature', 'Gaming', 'Spirituality', 'Philosophy', 'Movies', 'Parenting'
  ];

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);  
        setFormData({ ...formData, image: reader.result });  
      };
      reader.readAsDataURL(file);  
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleCategorySelect = (category) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter(c => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('image', formData.image);
    formData.categories.forEach((category) => {
      data.append('categories[]', category); 
    });

    console.log(formData)

    try {
      await axios.post('https://article-back.onrender.com/api/article/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShowPopup(true); 
      setFormData({ title: '', description: '', content: '', image: '', categories: [] });
      navigate('/profile');
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding article:', error.response?.data?.message || error.message);
    }
  };

  const handleNext = () => {
    setFormPart(formPart + 1);
  };

  const handleBack = () => {
    setFormPart(formPart - 1);
  };

  const triggerFileUpload = () => {
    document.getElementById('file-input').click();
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowCategories(true);
  };


  const categoryRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryRef]);

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}  
      {formPart === 0 && (
        <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-md w-full max-w-md md:max-w-2xl lg:max-w-3xl">
          <h2 className="text-2xl text-white mb-6 text-center">Add New Article</h2>
          <input
            type="text"
            name="title"
            placeholder="Article Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none"
            required
          />
          <textarea
            name="description"
            placeholder="Article Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Category Search Input */}
          <input
            type="text"
            placeholder="Search Categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none"
          />

          {/* Display Selected Categories */}
          {formData.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 ">
              {formData.categories.map((selectedCategory, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium"
                >
                  {selectedCategory}
                </span>
              ))}
            </div>
          )}

          {/* Category Selection Popup */}
          {showCategories && (
            <div
              ref={categoryRef}
              className="absolute z-10 bg-gray-800 rounded-lg p-4 mt-1 max-h-48 overflow-y-scroll"
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <label key={category} className="block text-white mb-2">
                    <input
                      type="checkbox"
                      value={category}
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategorySelect(category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))
              ) : (
                <p className="text-gray-300">No categories found</p>
              )}
            </div>
          )}


          <div className="flex justify-between">
            <button type="button" onClick={handleNext} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
              Next
            </button>
            
          </div>
        </form>
      )}

          {formPart === 1 && (
          <div className="flex flex-col items-center bg-black p-8 rounded-lg shadow-md w-full max-w-md md:max-w-2xl lg:max-w-3xl relative">
            <h2 className="text-2xl text-white mb-6 text-center">Add Image</h2>
            <div
              onClick={triggerFileUpload}
              className="bg-black text-white w-full h-48 rounded-lg flex justify-center items-center cursor-pointer text-xl hover:bg-gray-700 mb-4 border-dashed border-2 border-white"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                'Click or Drag to Upload Image'
              )}
            </div>
            <input id="file-input" type="file" onChange={handleImageUpload} className="hidden" />

            <div className="flex justify-between w-full mt-6">
              <button onClick={handleBack} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
                Back
              </button>
              <button onClick={handleNext} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
                Next
              </button>
            </div>
          </div>
        )}

      {formPart === 2 && (
        <div className="w-full h-full relative">
          <FroalaEditorComponent
            tag="textarea"
            model={formData.content}
            onModelChange={handleContentChange}
            className="w-full h-full"
            config={{
              placeholderText: 'Start writing your article...',
              charCounterCount: true,
              height: '100vh',
              editorClass: 'editor-custom-bg',
            }}
          />
          <div className="bg-black">
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
                Back
              </button>
              <button type="button" onClick={handlePreview} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
              Preview
            </button>
              <button type="submit" onClick={handleSubmit} className="w-2/5 bg-black hover:bg-white hover:text-black p-3 hover:rounded-xl text-white">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

{previewMode && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50 overflow-y-auto p-4">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl lg:max-w-4xl">
      <h2 className="text-2xl lg:text-3xl text-center mb-4 font-semibold">{formData.title}</h2>

      <p className="mb-6 text-gray-800 text-lg lg:text-xl">{formData.description}</p>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mb-6 max-h-96 w-full object-contain rounded-lg"
        />
      )}

      <div
        className="prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: formData.content }}
      ></div>

      <p className="text-gray-500 mt-6">
        <strong>Categories:</strong> {formData.categories.join(', ')}
      </p>

      <button
        onClick={() => setPreviewMode(false)}
        className="bg-black text-white p-3 rounded-lg mt-4 w-full lg:w-auto lg:px-6 lg:py-3"
      >
        Close Preview
      </button>
    </div>
  </div>
)}


      {showPopup && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
                <div className="bg-black p-6 rounded-lg text-center">
                  <h3 className="text-lg text-green-500 font-bold mb-2">Success!</h3>
                  <p>Your article has been added successfully.</p>
                  <button onClick={() => setShowPopup(false)} className="mt-4 bg-black text-green-500 py-2 px-4 rounded">
                    Close
                  </button>
                </div>
              </div>
            )}
    </div>
  );
};

export default AddArticle;
