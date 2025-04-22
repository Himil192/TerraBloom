import React, { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import Carousel from '../component/Carousel';

const Home = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const imagesUrls = [
        `${import.meta.env.BASE_URL}carousel/Product1.png`,
        `${import.meta.env.BASE_URL}carousel/Product2.png`,
        `${import.meta.env.BASE_URL}carousel/Product3.webp`,
        `${import.meta.env.BASE_URL}carousel/Product4.webp`,
        `${import.meta.env.BASE_URL}carousel/Product5.webp`,
    ];
    return (

        <>
            <div className="bg-color-background text-color-text p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Left - Text Content */}
                    <div className="flex-1 text-left">
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Welcome to <span className="text-highlight">TerraBloom</span>
                        </h2>
                        <p className="m-4 text-lg max-w-lg">
                            Nurture your space and spirit with our curated collection of eco-friendly plants, wellness goods, and green living essentials.
                        </p>
                        <button className="btn-primary rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Click Me</button>
                    </div>

                    {/* Right - Image */}
                    <div className="flex-1">
                        <Carousel images={imagesUrls} interval={5000} />

                    </div>
                </div>
            </div>

        </>

    );
};

export default Home;
