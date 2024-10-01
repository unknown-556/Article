import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on each submit

    try {
      const res = await axios.post('http://127.0.0.1:1234/api/article/auth/login', formData);
      localStorage.setItem('token', res.data.accessToken);
      setShowPopup(true); 
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Incorrect email or password'); 
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        <button 
          type="submit" 
          className={`w-full p-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:bg-white hover:text-black'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-6">
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute inset-x-0 bg-white h-px"></span>
            <span className="relative px-4 bg-black text-white">OR</span>
          </div>
          <Link to="/signup" className="text-white hover:text-gray-500 font-medium transition duration-300 ease-in-out">
            Create an Account
          </Link>
        </div>
      </form>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center text-green-500 items-center bg-black bg-opacity-75 z-50">
          <div className="bg-black p-6 rounded-lg text-center">
            <h3 className="text-lg text-green-500 font-bold mb-2">Success!</h3>
            <p>You are now logged in. Redirecting to home...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
