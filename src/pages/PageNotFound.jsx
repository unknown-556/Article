import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-cascadia bg-black w-full h-full">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg max-w-md w-full">
        {/* Navigation */}
        <nav className='bg-red-800 py-3 rounded-t-lg flex justify-center'>
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition duration-200">
            Article<span className="font-semibold font-sans">404</span>
          </Link>
        </nav>

        {/* Terminal-like Display */}
        <div className='px-6 py-8'>
          <div className="space-y-3">
            <p className="text-sm text-green-400"> <span className='text-blue-500'>~</span> ₦ 404</p>
            <p className="text-sm text-green-400"> <span className='text-blue-500'>~</span> ₦ page not found</p>
            <p className="text-sm text-green-400"> <span className='text-blue-500'>~</span> ₦ <Link to="/" className="text-blue-400 hover:underline">go back home</Link></p>
            
            {/* Input Field */}
            <p className="text-sm text-green-400"> <span className='text-blue-500'>~</span> ₦ 
              <input
                type="text"
                placeholder='_'
                className='bg-gray-800 text-green-400 ml-2 border-b border-green-500 focus:outline-none w-32 placeholder:text-green-400 animate-pulse'
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
