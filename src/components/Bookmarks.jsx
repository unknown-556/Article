import React, { useEffect, useState } from 'react';
import axios from 'axios';


// useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('/api/profile/bookmarks', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setUser(response.data);
//       } catch (error) {
//         setError('Failed to fetch user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);




const Bookmarks = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Bookmarks</h1>
      {/* Render user's bookmarks here */}
      <p>Here are your bookmarks...</p>
    </div>
  );
};

export default Bookmarks;
