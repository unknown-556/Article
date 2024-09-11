import React, { useState } from 'react';
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
    category: ''
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formPart, setFormPart] = useState(0);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file }); 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('image', formData.image); 
    data.append('category', formData.category);

    try {
      console.log(formData)
      await axios.post('/api/articles', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Article added successfully!');
      setFormData({ title: '', description: '', content: '', image: '', category: '' }); 
      console.log(formData)
      setImagePreview(null); 
    } catch (error) {
      console.error('Error adding article:', error.response?.data?.message || error.message);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true); 
  };

  const handleClosePreview = () => {
    setPreviewMode(false); 
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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            required
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
          </select>
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
        

        <input
        type="file"
        id="file-input"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        />
        

        {imagePreview && (
        <div className="w-full flex justify-center mt-4">
            <img
            src={imagePreview}
            alt="Image preview"
            className="max-w-full h-auto rounded-lg shadow-md"
            />
        </div>
        )}


        <div className="w-full flex justify-between mt-4">
        <button
            onClick={handleBack}
            className="w-2/5 bg-black p-3 rounded-lg text-white hover:text-black hover:bg-white"
        >
            Back
        </button>
        <button
            onClick={handleNext}
            className="w-2/5 bg-black p-3 rounded-lg text-white hover:text-black hover:bg-white"
        >
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
              <button onClick={handleBack} className="w-2/5 bg-black rounded-lg text-white">
                Back
              </button>
              <button onClick={handlePreview} className="w-2/5 bg-black p-3 rounded-lg text-white">
                Preview
              </button>
              <button onClick={handleSubmit} className="w-2/5 bg-black p-3 rounded-lg text-white">
                Add Article
              </button>
            </div>
          </div>
        </div>
      )}

      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-3xl text-white mb-4">{formData.title}</h2>
            <p className="text-gray-300 mb-4">{formData.description}</p>
            {imagePreview && <img src={imagePreview} alt="Preview" className="mb-4 max-h-64 object-cover" />}
            <div className="text-white mb-4" dangerouslySetInnerHTML={{ __html: formData.content }}></div>
            <p className="text-white mb-4">Category: {formData.category}</p>
            <button onClick={handleClosePreview} className="w-full bg-black hover:bg-red-600 p-3 rounded-lg text-white">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddArticle;
