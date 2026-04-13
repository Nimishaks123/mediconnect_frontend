import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">404</h1>
        <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute shadow-md">
          Page Not Found
        </div>
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Oops! Are you lost?
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
