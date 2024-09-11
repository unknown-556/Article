import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Assuming you're using `useNavigate` from React Router

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button 
          type="submit" 
          className={`w-full p-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center mt-6">
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute inset-x-0 bg-gray-300 h-px"></span>
            <span className="relative px-4 bg-gray-800 text-gray-300">OR</span>
          </div>
          <Link to="/signup" className="text-green-500 hover:text-green-600 font-medium transition duration-300 ease-in-out">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;