import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Unauthorized</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-8 space-x-4">
          <Link to="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;