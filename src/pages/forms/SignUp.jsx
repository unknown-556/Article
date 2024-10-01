import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // State for the popup
  const [popupMessage, setPopupMessage] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`http://127.0.0.1:1234/api/article/auth/usernames`);
      const usernames = response.data.usernames;
      return !usernames.includes(username); // return true if username is available
    } catch (error) {
      console.error('Error fetching usernames:', error.response?.data?.message || 'Failed to fetch usernames.');
      return false;
    }
  };

  const generateUsername = async (firstName) => {
    let baseUsername = firstName.toLowerCase();
    let newUsername = baseUsername;
    let isAvailable = await checkUsernameAvailability(newUsername);
    let suffix = Math.floor(Math.random() * 10000);

    while (!isAvailable) {
      newUsername = `${baseUsername}${suffix}`;
      isAvailable = await checkUsernameAvailability(newUsername);
      suffix++;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      username: newUsername,
    }));
    setIsUsernameAvailable(true);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Automatically generate username when first name is updated
    if (name === 'firstName') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstName: value,
      }));
      generateUsername(value);
    }

    if (name === 'username') {
      const available = await checkUsernameAvailability(value);
      setIsUsernameAvailable(available);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      setLoading(false);
      return;
    } else {
      setPasswordsMatch(true);
    }

    if (!isUsernameAvailable || !formData.username) {
      setErrorMessage('Please ensure the username is valid and available.');
      setLoading(false);
      return;
    }

    const formattedData = {
      ...formData,
      firstName: capitalizeFirstLetter(formData.firstName),
      lastName: capitalizeFirstLetter(formData.lastName),
    };

    try {
      const res = await axios.post('http://127.0.0.1:1234/api/article/auth/register', formattedData);
      localStorage.setItem('token', res.data.token);
      setPopupMessage('Signup successful! Redirecting to login...'); // Set popup message
      setShowPopup(true); // Show the popup

      // Set a timer to navigate after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      const errorResponse = error.response?.data?.message || 'Signup failed. Please try again.';
      setErrorMessage(errorResponse);
      console.error('Error signing up:', errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded-lg text-center">
            {errorMessage}
          </div>
        )}

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

        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-3 mb-2 ${isUsernameAvailable ? 'bg-black' : 'bg-red-500'} text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white`}
            required
          />
          {!isUsernameAvailable && <p className="text-red-500">Username is not available</p>}
        </div>

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

        <button
          type="submit"
          className="w-full bg-black hover:bg-white p-3 hover:text-black rounded-lg text-white"
          disabled={loading || !isUsernameAvailable}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <div className="text-center mt-6">
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute inset-x-0 bg-white h-px"></span>
            <span className="relative px-4 bg-black text-white">OR</span>
          </div>
          <Link to="/login" className="text-white hover:text-gray-500 font-medium transition duration-300 ease-in-out">
            Login
          </Link>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
          <div className="bg-black text-green-500 p-4 rounded-lg shadow-lg">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
