import React from 'react';

const ArticleCard = ({ title, description, image, categories, onClick }) => {
  return (
    <div
      className="justify-center border-b border-gray-800 flex lg:w-3/4 lg:h-60 flex-col md:flex-row bg-black text-white shadow-lg  overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer mb-8"
      onClick={onClick}
    >
     

      {/* Content Section */}
      <div className={`flex-1 p-6 ${image ? 'md:w-2/3' : 'w-full'}`}>
        <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
          {title}
        </h3>
        <p className="text-white mb-4 line-clamp-3">
          {description}
        </p>
        <div className='lg:pt-14 sm:pt-1'>
        
        </div>
      </div>

       {/* Image Section - Only render if the image prop is provided */}
       {image && (
        <div className="md:w-1/3 h-56 md:h-auto">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
