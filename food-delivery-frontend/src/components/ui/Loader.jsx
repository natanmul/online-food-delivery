import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-200`} />
        <div className={`${sizes[size]} absolute top-0 left-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent`} />
      </div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" text="Loading application..." />
    </div>
  );
};

export const InlineLoader = () => {
  return (
    <div className="inline-flex items-center">
      <Loader size="sm" text="" />
    </div>
  );
};

export default Loader;