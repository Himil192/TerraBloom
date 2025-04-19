import React, { useEffect, useState } from 'react';

const Carousel = ({ images, intervel = 3000 }) => {
    // images is an array of image URLs
    //state to hold the current image index
    const [currentIndex, setCurrentIndex] = useState(0);
    //change the image evry 3 seconds/miliseconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, intervel);
        return () => clearInterval(timer); // Cleanup the interval on component unmount   
    }, [images.length, intervel]); // Add images.length and intervel as dependencies
    return (
        <div className="w-full overflow-hidden py-4 px-2">
            <img
                src={images[currentIndex]}
                alt={`slide ${currentIndex + 1}`}
                className="w-full h-auto max-h-60 mx-auto rounded-xl shadow-md transition-transform duration-300 ease-in-out"
            />
        </div>
    );
};

export default Carousel;
