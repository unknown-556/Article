import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import ModalOverlay from '../../components/ModalOverlay';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch('https://connect-i645.onrender.com/api/connect/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setLoading(false);
      const data = await response.json();
      console.log('Response from API:', data);

      if (response.ok) {
        setModalMessage('LOGGED IN SUCCESSFULLY');
        setModalType('success');
        setModalOpen(true);

        localStorage.setItem('accessToken', data.accessToken);
        setTimeout(() => navigate('/Community'), 3000);
      } else {
        setModalMessage('FAILED TO LOGIN. CHECK YOUR LOGIN DETAILS AND TRY AGAIN');
        setModalType('error');
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form:', error);
      setModalMessage('Something went wrong');
      setModalType('error');
      setModalOpen(true);
    }
  };

  return (
    <div id="webcrumbs"> 
      <div className="w-[400px] bg-black rounded-lg shadow-lg text-white p-6">
        <h1 className="font-title text-center text-2xl mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-200 text-black"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 rounded-md bg-gray-200 text-black pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {formData.password ? (
                showPassword ? <EyeOff /> : <Eye />
              ) : (
                <Lock />
              )}
            </span>
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-white rounded-full mt-4" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="form-actions mt-4">
          <Link to="/Email" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <div className="form-actions mt-4">
          <Link to="/signup">
            <button type="button" className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
      
      <ModalOverlay isOpen={modalOpen} message={modalMessage} type={modalType} />
    </div>
  );
  
};

export default Login;
