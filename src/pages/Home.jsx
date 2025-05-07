import React, { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import Carousel from '../component/Carousel';

const Home = () => {
    const { isDark } = useTheme(); // Importing the isDark state from ThemeContext
    // useEffect to add or remove the 'dark' class from the document element based on isDark state

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const imagesUrls = [
        `/carousel/Product1.png`,
        ` /carousel/Product2.png`,
        ` /carousel/Product3.webp`,
        ` /carousel/Product4.webp`,
        ` /carousel/Product5.webp`,
    ];
    return (

        <>
            <section className='pt-20 bg-color-background text-color-text  '>

                <div className=" gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl   lg:py-16 lg:px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Left - Text Content */}
                        <div className="flex-1 text-left md:mt-0">
                            <h2 className="text-4xl tracking-tight md:text-6xl font-bold leading-tight">
                                Welcome to <span className="text-highlight">TerraBloom</span>
                            </h2>
                            <p className="m-4 text-lg max-w-lg">
                                Nurture your space and spirit with our curated collection of eco-friendly plants, wellness goods, and green living essentials.
                            </p>
                            <button className="btn-primary rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Click Me</button>
                        </div>

                        {/* Right - Image */}
                        <div className="relative flex-1">
                            {/* Decorative Object - behind carousel */}
                            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
                                <img
                                    src="/object.png"
                                    width={500}
                                    loading="lazy"
                                    alt="Decorative Object"
                                    className="w-full h-full bg-[#e1d8c6] object-cover rounded-lg shadow-md "
                                />
                            </div>

                            {/* Carousel - above the object */}
                            <div className="relative z-10">
                                <Carousel images={imagesUrls} interval={5000} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Hero Section End */}

            { /*Our Purpose  */}

            <section className="bg-color-background text-color-text  ">
                <h2 className=" text-4xl tracking-tight font-extrabold text-center ">We’re not just a store. We’re a movement. </h2>
                <div className="gap-16 items-center  mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div className="grid grid-cols-2 gap-4 mt-8 mb-4">
                        <img className="mt-4 w-full lg:mt-10 rounded-lg" loading="lazy" src="PromiseTwo.jpg" alt="healthy plant " />
                        <img className="w-full rounded-lg" loading="lazy" src="PromiseOne.jpg" alt="office content 1" />


                    </div>
                    <div className="font-light mt-4 lg:mt-10">
                        <p className="mb-4">At TerraBloom, we believe eco-conscious living should be simple, beautiful, and accessible. Every product we create is crafted with love for the planet — using ethical, sustainable materials that leave zero guilt and zero waste.</p>
                        <p>We are designers, makers, and environmental advocates. A tight-knit team driven by purpose, obsessed with quality, and passionate about solving real-world problems with sustainable solutions. Small enough to move fast — bold enough to make a difference.</p>
                        <div className="grid grid-cols-2 mt-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition hover:shadow-lg">
                                <div className="text-4xl text-highlight mb-2">♻️</div>
                                <p className="text-color-text font-medium">100% Sustainable Materials</p>
                            </div>

                            {/* Card 2 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition hover:shadow-lg">
                                <div className="text-4xl text-highlight mb-2">🧴</div>
                                <p className="text-color-text font-medium">Plastic-Free Packaging</p>
                            </div>

                            {/* Card 3 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition hover:shadow-lg">
                                <div className="text-4xl text-highlight mb-2">🌍</div>
                                <p className="text-color-text font-medium">Carbon-Neutral Delivery</p>
                            </div>
                            {/* Card 4 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition hover:shadow-lg">
                                <div className="text-4xl text-highlight mb-2">🤝</div>
                                <p className="text-color-text font-medium">Ethically Sourced</p>
                            </div>
                        </div>


                    </div>



                </div>
            </section>

        </>

    );
};

export default Home;
