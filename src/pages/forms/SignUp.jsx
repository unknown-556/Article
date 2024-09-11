import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      setLoading(false);
    } else {
      setPasswordsMatch(true);
      const formattedData = {
        ...formData,
        firstName: capitalizeFirstLetter(formData.firstName),
        lastName: capitalizeFirstLetter(formData.lastName),
      };

      try {
        const res = await axios.post('/api/signup', formattedData);
        localStorage.setItem('token', res.data.token);
        alert('Signup successful!');
        navigate('/login'); 
      } catch (error) {
        console.error('Error signing up:', error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black ">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          required
        />

        {!passwordsMatch && <p className="text-red-500 mb-4">Passwords do not match</p>}

        <button type="submit" className="w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="text-center mt-6">
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute inset-x-0 bg-white h-px"></span>
            <span className="relative px-4 bg-black text-white">OR</span>
          </div>
          <Link to="/Login" className="text-white hover:text-gray-500 font-medium transition duration-300 ease-in-out">
            Login
          </Link>
        </div>
      </form>

    </div>
  );
};

export default Signup;

