import React, { useState, useRef, useEffect } from 'react';
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
        setImagePreview(reader.result);  // Set the preview image
        setFormData({ ...formData, image: reader.result });  // Save the Base64 string in formData
      };
      reader.readAsDataURL(file);  // Convert image to Base64 string
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleCategorySelect = (category) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(cat => cat !== category)
      : [...formData.categories, category];

    setFormData({ ...formData, categories: newCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('image', formData.image);
    data.append('categories', formData.categories.join(','));

    console.log(formData)

    try {
      await axios.post('http://127.0.0.1:1234/api/article/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Article added successfully!');
      setFormData({ title: '', description: '', content: '', image: '', categories: [] });
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

          {/* Category Selection Popup */}
          {showCategories && (
            <div
              ref={categoryRef}
              className="absolute z-10 bg-gray-800 rounded-lg p-4 mt-1 max-h-48 overflow-y-scroll overflow-y-scroll"
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
          <button
            type="button"
            onClick={triggerFileUpload}
            className="bg-white text-black w-12 h-12 rounded-full flex justify-center items-center text-xl hover:bg-gray-700 mb-4"
            title="Upload Image"
          >
            +
          </button>
          <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleImageUpload} />
          {imagePreview && (
            <div className="w-full flex justify-center mt-4">
              <img src={imagePreview} alt="Image preview" className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
          )}

          <div className="w-full flex justify-between mt-4">
            <button onClick={handleBack} className="w-2/5 bg-black p-3 rounded-lg text-white hover:text-black hover:bg-white">
              Back
            </button>
            <button onClick={handleNext} className="w-2/5 bg-black p-3 rounded-lg text-white hover:text-black hover:bg-white">
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

    </div>
  );
};

export default AddArticle;
