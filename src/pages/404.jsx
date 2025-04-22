import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#25C467] to-[#1D1F1F] text-white text-center py-16 px-6">
            {/* Main Heading (404) */}
            <h1 className="text-8xl font-bold mb-4 animate-pulse text-[#F3A424]">
                404
            </h1>
            {/* Sub Heading */}
            <p className="text-3xl mb-6 font-medium text-[#FFFEFF]">
                Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-lg mb-8 text-[#FFFEFF]">
                It might have been moved, or you may have mistyped the URL.
            </p>
            {/* Go Back Button */}
            <Link
                to="/"
                className="inline-block text-xl font-semibold bg-[#565759] text-white px-6 py-3 rounded-lg hover:bg-[#25C467] transition-colors duration-300"
            >
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
