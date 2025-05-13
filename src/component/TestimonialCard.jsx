import React from 'react';

const TestimonialCard = ({ image, name, title, message }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-4 w-full max-w-xs"> {/* Fixed max width */}
            <div className="flex items-center mb-4">
                <img
                    src={image}  // Replace with the actual image URL
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    alt={`${name}'s picture`}
                    loading="lazy"
                />
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
                    <p className="text-gray-500 text-sm ">{title}</p>
                </div>
            </div>
            <p className="text-gray-700 text-sm">{message}</p>
        </div>
    );
};

export default TestimonialCard;
