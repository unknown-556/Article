import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionManager = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Assuming the token contains the expiry in the payload
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiry = tokenPayload.exp * 1000; // Convert to milliseconds

      const checkSession = () => {
        const currentTime = Date.now();
        if (currentTime >= expiry) {
          // Token has expired, perform auto-logout
          localStorage.removeItem('token');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      };

      // Check session expiration on component mount
      checkSession();

      // Optionally, you can set an interval to check session regularly
      const interval = setInterval(checkSession, 60000); // Check every minute

      // Clean up the interval when component unmounts
      return () => clearInterval(interval);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default SessionManager;
