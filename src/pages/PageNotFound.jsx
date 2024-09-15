import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-cascadia bg-black w-full h-full overflow-hidden no-scrollbar">
      <div className="bg-gray-900    text-white rounded-t-3xl shadow-2xl max-w-sm w-full">
        <nav className='bg-red-900 m-0 py-2 rounded-t-3xl flex justify-between items-center px-4'>
          <Link to="/">
            <div className='font-cascadia text-2xl p-0 m-0 justify-center'>Article<span className='p-0 m-0 font-semibold font-sans text-2xl'></span></div>
          </Link>
        </nav>
        <div className='px-4'>
          <div className="mt-2">
            <p className="text-white">user@Devly_says: <span className='text-blue-400'>~</span><span className='text-devlyWhite'>₦ 404</span></p>
            <p className="text-white">user@Devly_says: <span className='text-blue-400'>~</span><span className='text-devlyWhite'>₦ page not found</span></p>
            <p className="text-white">user@Devly_says: <span className='text-blue-400'>~</span><span className='text-devlyWhite'>₦ </span><Link to="/" className="text-blue-400 hover:underline">go back home</Link></p>
            <p className="text-white pb-12">user@Devly_says: <span className='text-blue-400'>~</span><span className='text-devlyMint'>₦</span><input type="text" placeholder='_' className='bg-[#001D13] text-devlyWhite focus:outline-none w-40 ml-2 break-all active:animate-none placeholder:text-devlyWhite animate-pulse' /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
