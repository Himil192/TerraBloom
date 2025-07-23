import React from 'react';

const Unauthorized = () => {
    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold text-red-600">⛔ Unauthorized</h1>
            <p className="mt-4 text-lg">You don’t have permission to access this page.</p>
        </div>
    );
};

export default Unauthorized;
