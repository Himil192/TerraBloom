import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import Carousel from '../component/Carousel';
import ProductCards from '../component/ProductCards';
import { Link } from 'react-router-dom';
import TestimonialCard from '../component/TestimonialCard';

import 'aos/dist/aos.css'; // You can also use <link> for styles
import Aos from 'aos';
const Home = () => {


    useEffect(() => {
        Aos.init({
            duration: 800, // Duration of animations in milliseconds
            once: false, // Whether animation should happen only once - while scrolling down
            offset: 100, // Offset (in px) from the original trigger point


        }); // Initialize AOS with a duration of 1000ms


    }, []);

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

    const products = [
        {
            id: 1,
            image: "/FeatureProducts/BambooBrush.jpg",
            title: "Bamboo Toothbrush",
            price: 100,
        },
        {
            id: 2,
            image: "/FeatureProducts/gorrilaSocks.jpg",
            title: "Gorillas Socks socks",
            price: 120.0,
        },
        {
            id: 3,
            image: "/FeatureProducts/Eco-Panda-facial-removal.jpg",
            title: "Eco Panda Facial Removal Pads",
            price: 250.0,
        },
    ];


    const testimonials = [
        {
            image: "https://i.pravatar.cc/150?img=12",
            name: "Maria L.",
            title: "Eco Shopper",
            message:
                "I switched to TerraBloom 6 months ago and it changed how I live. Every product feels good and *does* good.",
        },
        {
            image: "https://i.pravatar.cc/150?img=9",
            name: "Arjun P.",
            title: "Environmentalist",
            message:
                "It’s not just a store, it’s a movement. TerraBloom makes eco-friendly feel effortless.",
        },
        {
            image: "https://i.pravatar.cc/150?img=15",
            name: "Sara M.",
            title: "Zero Waste Advocate",
            message:
                "From the compostable packaging to the lovely products, I feel proud supporting TerraBloom.",
        },
        {
            image: "https://i.pravatar.cc/150?img=18",
            name: "Tom H.",
            title: "Climate Blogger",
            message:
                "A rare brand that actually walks the talk. Highly recommend to conscious buyers.",
        },
        {
            image: "https://i.pravatar.cc/150?img=22",
            name: "Lina K.",
            title: "Nature Enthusiast",
            message:
                "So refreshing to see plastic-free deliveries. TerraBloom made my eco journey fun!",
        },
        {
            image: "https://i.pravatar.cc/150?img=31",
            name: "David W.",
            title: "Green Techie",
            message:
                "Smart packaging, mindful sourcing, and solid service. Can’t go back to regular shopping.",
        },
        {
            image: "https://i.pravatar.cc/150?img=25",
            name: "Emily Z.",
            title: "Eco Mom",
            message:
                "From baby goods to kitchen staples, TerraBloom's products are life-changing.",
        },
        {
            image: "https://i.pravatar.cc/150?img=35",
            name: "Nikhil S.",
            title: "Vegan Chef",
            message:
                "Amazing options that align with my values. TerraBloom never disappoints!",
        },
        {
            image: "https://i.pravatar.cc/150?img=45",
            name: "Jenna R.",
            title: "Earth Warrior",
            message:
                "A small step for me, a giant leap for Earth. Thanks TerraBloom 🌍",
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

    function getSlidesToShow() {
        const width = window.innerWidth;
        if (width >= 1024) return 6; // 3 cols x 2 rows
        if (width >= 640) return 4;  // 2 cols x 2 rows
        return 1;                    // 1 col x 1 row
    }

    useEffect(() => {
        const handleResize = () => {
            setSlidesToShow(getSlidesToShow());
            setCurrentIndex(0); // Reset index on resize to avoid out-of-bound issues
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         nextSlide();
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, [currentIndex, slidesToShow]);

    const totalPages = Math.ceil(testimonials.length / slidesToShow);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    };

    const currentTestimonials = testimonials.slice(
        currentIndex * slidesToShow,
        (currentIndex + 1) * slidesToShow
    );

    return (

        <>
            <section className='pt-20 bg-color-background text-color-text  '>

                <div className=" gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl   lg:py-16 lg:px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Left - Text Content */}
                        <div className="flex-1 text-left md:mt-0 ">
                            <h2 className="text-4xl tracking-tight md:text-6xl font-bold leading-tight    " data-aos="fade-right" data-aos-delay="200" >
                                Welcome to <span className="text-highlight">TerraBloom</span>
                            </h2>
                            <p className="m-4 text-lg max-w-lg   " data-aos="fade-up" data-aos-delay="200">
                                Nurture your space and spirit with our curated collection of eco-friendly plants, wellness goods, and green living essentials.
                            </p>
                            <button className="btn-primary rounded-lg text-sm px-5 py-2.5 me-2 mb-2 " data-aos="fade-up" data-aos-delay="200">Click Me</button>
                        </div>

                        {/* Right - Image */}
                        <div className="relative flex-1 " data-aos="fade-left" data-aos-delay="200">
                            {/* Decorative Object - behind carousel */}
                            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
                                <img
                                    src="/object.png"
                                    width={500}

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

            <section className="bg-color-background text-color-text pt-25 ">
                <h2 className=" text-4xl tracking-tight font-extrabold text-center " data-aos="fade-up" data-aos-delay="200">We’re not just a store. We’re a movement. </h2>
                <div className="gap-16 items-center  mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div className="grid grid-cols-2 gap-4 mt-8 mb-4">
                        <img className="mt-4 w-full lg:mt-10 rounded-lg " loading="lazy" src="PromiseTwo.jpg" alt="healthy plant " data-aos="fade-up" data-aos-delay="200" />
                        <img className="w-full rounded-lg " loading="lazy" src="PromiseOne.jpg" alt="office content 1" data-aos="fade-down" data-aos-delay="200" />


                    </div>
                    <div className="font-light mt-4 lg:mt-10">
                        <p className="mb-4 " data-aos="fade-left" data-aos-delay="200">At TerraBloom, we believe eco-conscious living should be simple, beautiful, and accessible. Every product we create is crafted with love for the planet — using ethical, sustainable materials that leave zero guilt and zero waste.</p>
                        <p data-aos="fade-left" data-aos-delay="200">We are designers, makers, and environmental advocates. A tight-knit team driven by purpose, obsessed with quality, and passionate about solving real-world problems with sustainable solutions. Small enough to move fast — bold enough to make a difference.</p>
                        <div className="grid grid-cols-2 mt-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition-transform duration-300 hover:shadow-lg hover:-translate-y-1  " data-aos="fade-up" data-aos-delay="0">
                                <div className="text-4xl text-highlight mb-2">♻️</div>
                                <p className="text-color-text font-medium">100% Sustainable Materials</p>
                            </div>

                            {/* Card 2 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition-transform duration-300 hover:shadow-lg hover:-translate-y-1  " data-aos="fade-up" data-aos-delay="200" >
                                <div className="text-4xl text-highlight mb-2">🧴</div>
                                <p className="text-color-text font-medium">Plastic-Free Packaging</p>
                            </div>

                            {/* Card 3 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition-transform duration-300 hover:shadow-lg hover:-translate-y-1  " data-aos="fade-up" data-aos-delay="400">
                                <div className="text-4xl text-highlight mb-2">🌍</div>
                                <p className="text-color-text font-medium">Carbon-Neutral Delivery</p>
                            </div>
                            {/* Card 4 */}
                            <div className="flex flex-col items-center text-center p-4 shadow-md rounded-xl bg-color-background border border-color-border transition-transform duration-300 hover:shadow-lg hover:-translate-y-1  " data-aos="fade-up" data-aos-delay="600">
                                <div className="text-4xl text-highlight mb-2">🤝</div>
                                <p className="text-color-text font-medium">Ethically Sourced</p>
                            </div>
                        </div>


                    </div>



                </div>
            </section>

            {/* Featured Products */}



            <section className="bg-color-background text-color-text pt-25">
                <h2 className="text-4xl tracking-tight font-extrabold text-center mb-8" data-aos="fade-up" data-aos-delay="200">Featured Products</h2>
                <div className="flex flex-wrap justify-center  "  >

                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            data-aos="zoom-in-up"
                            data-aos-delay={index * 100}
                            data-aos-once="true"
                            className="m-4"
                        >
                            <ProductCards product={product} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mb-10">
                    <Link to="/Products" >

                        <button className="btn-primary rounded-lg text-sm px-5 py-2.5 me-2 mb-2" href="/Products" data-aos="slide-up" data-aos-delay="200">View All Products</button>
                    </Link>
                </div>
            </section >

            {/*Testimonials */}
            <section className="bg-color-background text-color-text pt-24 pb-16" >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-bold text-4xl" data-aos="fade-up" data-aos-delay="200">Testimonials</h2>
                        <h3 className="text-3xl sm:text-2xl font-extrabold text-highlight mt-2" data-aos="fade-up" data-aos-delay="200">
                            What Our Customers Say
                        </h3>
                        <p className="text-base text-color-text mt-4 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                            Real stories from real people who care about the Earth as much as we do.
                        </p>
                    </div>

                    <div className="relative overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentTestimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 150}  // stagger animation by 150ms per card
                                    data-aos-once="true"           // animate only once
                                >
                                    <TestimonialCard
                                        image={testimonial.image}
                                        name={testimonial.name}
                                        title={testimonial.title}
                                        message={testimonial.message}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center mt-6 space-x-4">
                            <button
                                className="btn-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-90 transition"
                                onClick={prevSlide} data-aos="zoom-in-right" data-aos-delay="200"
                            >
                                &#10094;
                            </button>
                            <button
                                className="btn-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-90 transition"
                                onClick={nextSlide} data-aos="zoom-in-left" data-aos-delay="200"
                            >
                                &#10095;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/*how it works */}
            <section className=" bg-color-background  pt-24 pb-16" >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className=" font-bold text-4xl" data-aos="fade-up" data-aos-delay="200">How It Works</h2>
                    <h3 className="text-3xl font-bold  text-highlight  mt-2 mb-4" data-aos="fade-up" data-aos-delay="200"> Simple Steps to Sustainable Living</h3>
                    <p className=" mb-12 text-color-text max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        We’ve made it effortless to go green. Just follow these steps and join our eco-revolution!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        <div className="p-6  bg-white  rounded-xl shadow hover:shadow-lg transition" data-aos="fade-right" data-aos-delay="200">
                            <div className="   text-4xl mb-4">🛍️</div>
                            <h4 className="text-xl  text-gray-900 font-semibold  mb-2">Choose Your Product</h4>
                            <p className=" text-sm text-gray-700">Browse our eco-conscious collection and pick what fits your lifestyle.</p>
                        </div>


                        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition" data-aos="fade-up" data-aos-delay="200">
                            <div className="  text-4xl mb-4">🚚</div>
                            <h4 className="text-xl text-gray-900 font-semibold  mb-2">We Deliver To You</h4>
                            <p className="  text-sm text-gray-700">Our green delivery ensures your order arrives safely and sustainably.</p>
                        </div>

                        <div className="p-6 bg-white  rounded-xl shadow hover:shadow-lg transition" data-aos="fade-left" data-aos-delay="200">
                            <div className="  text-4xl mb-4">🌍</div>
                            <h4 className="text-xl text-gray-900 font-semibold   mb-2">You Impact The Earth</h4>
                            <p className="  text-sm text-gray-700   ">Every product you buy contributes to a cleaner, greener world.</p>
                        </div>
                    </div>


                    <div className="mt-10" data-aos="fade-down" data-aos-delay="200">
                        <button href="/Products" className="inline-block  btn-primary py-3 px-6 rounded-full text-sm font-semibold    ">
                            Start Shopping Green
                        </button>
                    </div>
                </div>
            </section >
            {/* Newsletter Signup */}

            < section className="bg-color-background text-color-text pt-24 pb-16" >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="font-bold text-4xl" data-aos="zoom-in-up" data-aos-delay="200">Join the Eco Revolution</h2>
                    <h3 className="text-3xl font-bold text-highlight mt-2 mb-4" data-aos="zoom-in-up" data-aos-delay="200">Subscribe to Our Newsletter</h3>
                    <p className="mb-12 text-color-text max-w-2xl mx-auto" data-aos="zoom-in-up" data-aos-delay="200">
                        Get exclusive offers, eco-tips, and the latest news on sustainable living.
                    </p>

                    <form className="flex justify-center flex-col sm:flex-row" >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border border-color-border rounded-l-lg p-3 w-full sm:w-1/3 mb-4 sm:mb-0"
                            data-aos="zoom-in-right" data-aos-delay="200"
                        />
                        <button type="submit" className="btn-primary  px-6 py-3 sm:ml-4" data-aos="zoom-in-left" data-aos-delay="200">
                            Subscribe
                        </button>
                    </form>
                </div>
            </ section>


        </>

    );
};

export default Home;
