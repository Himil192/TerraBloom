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
                loading="lazy"
                alt={`slide ${currentIndex + 1}`}
                className="w-full h-full object-contain mx-auto  transition-transform duration-300 ease-in-out 
            sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
            sm:max-h-48 md:max-h-64 lg:max-h-72 xl:max-h-80"
            />
        </div>



    );
};

export default Carousel;
