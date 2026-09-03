import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ image, name, title, message }) => {
    return (
        <div className="card-surface rounded-2xl shadow-md border p-6 w-full h-full flex flex-col">
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
            <Quote className="h-6 w-6 mb-2" style={{ color: 'var(--secondary-color)' }} />
            <p className="text-gray-700 text-sm mt-auto">{message}</p>
        </div>
    );
};

export default TestimonialCard;
