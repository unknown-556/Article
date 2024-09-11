import React from 'react';
import { Link } from 'react-router-dom';

const ModalOverlay = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center font-cascadia no-scrollbar fixed inset-0 bg-opacity-50 z-10 backdrop-blur-sm">
      <div className="bg-grey text-white rounded-3xl shadow-2xl max-w-sm w-3/4">
        <nav
          className={`py-1 rounded-t-3xl flex justify-between items-center px-4 ${
            type === 'success' ? 'bg-blue-500' : 'bg-red-500'
          }`}
        >
          <Link to="/">
            <div className="font-cascadia text-2xl p-0 m-0">
              Artcle<span className="p-0 m-0 font-semibold font-sans text-2xl">_</span>
            </div>
          </Link>
          <div className="flex flex-row gap-1">
            <div className="w-4 h-4 rounded-full bg-white cursor-pointer"></div>
            <div className="w-4 h-4 rounded-full bg-white cursor-pointer"></div>
            <div className="w-4 h-4 rounded-full bg-white cursor-pointer"></div>
          </div>
        </nav>
        <div className="px-4">
          <div className="mt-2">
            <h2
              className={`text-lg text-center font-semibold mb-4 ${
                type === 'success' ? 'text-blue-500' : 'text-red-500'
              }`}
            >
              {type === 'success' ? 'Success' : 'Error'}
            </h2>
            <p
              className={`mb-4 text-center ${
                type === 'success' ? 'text-blue-500' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;
