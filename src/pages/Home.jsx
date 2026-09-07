import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Leaf,
    Truck,
    Recycle,
    HeartHandshake,
    ShoppingBag,
    Globe,
    Check,
    Star,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import Carousel from '../component/Carousel';
import ProductCards from '../component/ProductCards';
import TestimonialCard from '../component/TestimonialCard';
import NewsLetter from './NewsLetter';
import RecentlyViewed from '../component/RecentlyViewed';
import { getAllProducts } from '../services/productService';
import { getAllBlogs } from '../services/blogService';

import 'aos/dist/aos.css';
import Aos from 'aos';

const HERO_IMAGES = [
    '/carousel/Product1.png',
    '/carousel/Product2.png',
    '/carousel/Product3.webp',
    '/carousel/Product4.webp',
    '/carousel/Product5.webp',
];

const FEATURES = [
    { icon: Truck, title: 'Free Eco Delivery', text: 'Carbon-neutral shipping on every order.' },
    { icon: Recycle, title: 'Plastic-Free Packaging', text: 'Compostable materials, zero waste.' },
    { icon: Leaf, title: 'Sustainably Sourced', text: 'Ethically made, planet-first products.' },
    { icon: HeartHandshake, title: '1% Gives Back', text: 'Profits fund reforestation projects.' },
];

const PURPOSE_POINTS = [
    '100% plastic-free materials in every product',
    'Ethical, low-waste supply chain from source to door',
    'A tree planted with every single order',
];

const STEPS = [
    { icon: ShoppingBag, title: 'Choose Your Product', text: 'Browse our eco-conscious collection and pick what fits your lifestyle.' },
    { icon: Truck, title: 'We Deliver To You', text: 'Our green delivery brings your order safely and sustainably.' },
    { icon: Globe, title: 'You Impact The Earth', text: 'Every product you buy contributes to a cleaner, greener world.' },
];

const TESTIMONIALS = [
    { image: 'https://i.pravatar.cc/150?img=12', name: 'Maria L.', title: 'Eco Shopper', message: 'I switched to TerraBloom 6 months ago and it changed how I live. Every product feels good and does good.' },
    { image: 'https://i.pravatar.cc/150?img=9', name: 'Arjun P.', title: 'Environmentalist', message: "It's not just a store, it's a movement. TerraBloom makes eco-friendly feel effortless." },
    { image: 'https://i.pravatar.cc/150?img=15', name: 'Sara M.', title: 'Zero Waste Advocate', message: 'From the compostable packaging to the lovely products, I feel proud supporting TerraBloom.' },
    { image: 'https://i.pravatar.cc/150?img=18', name: 'Tom H.', title: 'Climate Blogger', message: 'A rare brand that actually walks the talk. Highly recommend to conscious buyers.' },
    { image: 'https://i.pravatar.cc/150?img=22', name: 'Lina K.', title: 'Nature Enthusiast', message: 'So refreshing to see plastic-free deliveries. TerraBloom made my eco journey fun!' },
    { image: 'https://i.pravatar.cc/150?img=31', name: 'David W.', title: 'Green Techie', message: "Smart packaging, mindful sourcing, and solid service. Can't go back to regular shopping." },
    { image: 'https://i.pravatar.cc/150?img=35', name: 'Nikhil S.', title: 'Vegan Chef', message: 'Amazing options that align with my values. TerraBloom never disappoints!' },
    { image: 'https://i.pravatar.cc/150?img=45', name: 'Jenna R.', title: 'Earth Warrior', message: 'A small step for me, a giant leap for Earth. Thanks TerraBloom!' },
];

const IMPACT_STATS = [
    { value: '5,000+', label: 'Trees Planted' },
    { value: '120k+', label: 'Plastic Items Avoided' },
    { value: '10k+', label: 'Orders Delivered' },
];

const FEATURED_COUNT = 8;
const TEASER_COUNT = 3;

const Home = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        Aos.init({ duration: 800, once: true, offset: 80 });
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    // --- Live catalog data (public reads, enforced by firestore.rules) ---
    const [featured, setFeatured] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const [allProducts, allBlogs] = await Promise.all([
                    getAllProducts(),
                    getAllBlogs(),
                ]);
                if (!alive) return;
                const topRated = [...allProducts]
                    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
                    .slice(0, FEATURED_COUNT);
                setFeatured(topRated);
                // blogService sorts oldest -> newest, so flip for "latest"
                setLatestPosts(allBlogs.slice(-TEASER_COUNT).reverse());
            } catch {
                if (alive) {
                    setFeatured([]);
                    setLatestPosts([]);
                }
            } finally {
                if (alive) setLoadingCatalog(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    // --- Testimonials pager state ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

    function getSlidesToShow() {
        const width = window.innerWidth;
        if (width >= 1024) return 6;
        if (width >= 640) return 4;
        return 1;
    }

    useEffect(() => {
        const handleResize = () => {
            setSlidesToShow(getSlidesToShow());
            setCurrentIndex(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.max(1, Math.ceil(TESTIMONIALS.length / slidesToShow));

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

    const currentTestimonials = TESTIMONIALS.slice(
        currentIndex * slidesToShow,
        (currentIndex + 1) * slidesToShow
    );

    return (
        <>
            {/* ================= Hero ================= */}
            <section className="bg-color-background text-color-text overflow-hidden">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-24 lg:pb-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                        {/* Left - copy */}
                        <div className="order-2 lg:order-1 text-center lg:text-left">
                            <span
                                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm font-semibold"
                                style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                data-aos="fade-down"
                            >
                                <Leaf className="h-4 w-4" />
                                100% Plastic-Free &middot; Carbon Neutral
                            </span>
                            <h1
                                className="mt-6 text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight"
                                data-aos="fade-up"
                            >
                                Live Greener, <span className="text-highlight">Bloom Brighter</span>
                            </h1>
                            <p
                                className="mt-5 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 opacity-80"
                                data-aos="fade-up" data-aos-delay="100"
                            >
                                Curated eco-friendly plants, wellness goods and green-living essentials delivered to your door, kind to the planet.
                            </p>
                            <div
                                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                                data-aos="fade-up" data-aos-delay="200"
                            >
                                <Link
                                    to="/products"
                                    className="btn-primary w-full sm:w-auto rounded-full px-7 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
                                >
                                    Start Shopping Green
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/blogs"
                                    className="btn-secondary w-full sm:w-auto px-7 py-3 text-sm font-semibold"
                                >
                                    Read Our Story
                                </Link>
                            </div>
                            {/* Stats */}
                            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0" data-aos="fade-up" data-aos-delay="300">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--primary-color)' }}>10k+</p>
                                    <p className="text-xs sm:text-sm opacity-70">Happy Customers</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--primary-color)' }}>500+</p>
                                    <p className="text-xs sm:text-sm opacity-70">Eco Products</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-extrabold inline-flex items-center gap-1" style={{ color: 'var(--primary-color)' }}>
                                        4.8
                                        <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                                    </p>
                                    <p className="text-xs sm:text-sm opacity-70">Average Rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - visual */}
                        <div className="relative order-1 lg:order-2 w-full overflow-hidden" data-aos="fade-up" data-aos-delay="150">
                            <div
                                className="absolute -top-10 -right-6 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                                style={{ backgroundColor: 'var(--secondary-color)' }}
                            />
                            <div className="relative card-surface rounded-3xl shadow-xl border overflow-hidden">
                                <Carousel images={HERO_IMAGES} />
                            </div>
                            {/* Floating badges (kept inside bounds on mobile) */}
                            <div className="absolute top-3 right-3 card-surface rounded-2xl shadow-lg border px-4 py-2.5 flex items-center gap-2" data-aos="zoom-in" data-aos-delay="400">
                                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                                <div className="text-left leading-tight">
                                    <p className="text-sm font-bold">4.8/5</p>
                                    <p className="text-[11px] opacity-70">2,300+ reviews</p>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3 card-surface rounded-2xl shadow-lg border px-4 py-2.5 flex items-center gap-2.5" data-aos="zoom-in" data-aos-delay="500">
                                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: 'var(--primary-color)' }}>
                                    <Leaf className="h-5 w-5" />
                                </span>
                                <div className="leading-tight">
                                    <p className="text-sm font-bold">5,000+</p>
                                    <p className="text-[11px] opacity-70">Trees planted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Trust strip ================= */}
            <section className="bg-color-background text-color-text">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-surface relative z-10 -mt-12 lg:-mt-14 rounded-3xl shadow-lg border p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => (
                            <div key={feature.title} className="flex flex-col items-center text-center gap-2" data-aos="fade-up" data-aos-delay={index * 100}>
                                <span className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                                    <feature.icon className="h-5 w-5" />
                                </span>
                                <h3 className="text-sm sm:text-base font-semibold">{feature.title}</h3>
                                <p className="text-xs sm:text-sm opacity-70">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= Our Purpose ================= */}
            <section className="bg-color-background text-color-text py-16 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image collage */}
                    <div className="relative" data-aos="fade-up">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="/PurposeOne.jpg"
                                alt="Our purpose - sustainable living"
                                loading="lazy"
                                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-md"
                            />
                            <img
                                src="/lots-leaves.jpg"
                                alt="Fresh green leaves"
                                loading="lazy"
                                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-md mt-6"
                            />
                        </div>
                        <div className="card-surface absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl shadow-xl border px-5 py-3 flex items-center gap-3 whitespace-nowrap">
                            <span className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: 'var(--secondary-color)' }}>
                                <Leaf className="h-5 w-5" />
                            </span>
                            <p className="text-sm font-bold">Growing since 2022</p>
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="text-center lg:text-left mt-10 lg:mt-0">
                        <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">Our Purpose</span>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" data-aos="fade-up" data-aos-delay="100">
                            Not just a store &mdash; a movement
                        </h2>
                        <p className="mt-4 opacity-80 max-w-xl mx-auto lg:mx-0" data-aos="fade-up" data-aos-delay="150">
                            Every TerraBloom product is chosen to shrink your footprint and grow something better. Together, small everyday swaps add up to real planetary change.
                        </p>
                        <ul className="mt-6 space-y-3 text-left max-w-md mx-auto lg:mx-0" data-aos="fade-up" data-aos-delay="200">
                            {PURPOSE_POINTS.map((point) => (
                                <li key={point} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: 'var(--primary-color)' }}>
                                        <Check className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm sm:text-base">{point}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8" data-aos="fade-up" data-aos-delay="250">
                            <Link to="/products" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold inline-flex items-center gap-2">
                                Explore Our Collection
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Featured Products ================= */}
            <section className="bg-color-background text-color-text pt-8 pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">Best Sellers</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" data-aos="fade-up" data-aos-delay="100">Featured Products</h2>
                    <p className="mt-3 opacity-70 max-w-md mx-auto text-sm sm:text-base" data-aos="fade-up" data-aos-delay="150">
                        Handpicked planet-friendly essentials you can feel good about buying.
                    </p>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {loadingCatalog ? (
                            <div className="col-span-full flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary-color)' }} />
                            </div>
                        ) : featured.length === 0 ? (
                            <p className="col-span-full opacity-70 py-6">
                                Our shelves are being restocked � check back soon.
                            </p>
                        ) : (
                            featured.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex justify-center"
                                    data-aos="zoom-in-up"
                                    data-aos-delay={index * 100}
                                    data-aos-once="true"
                                >
                                    <ProductCards product={product} />
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-12 flex justify-center" data-aos="fade-up">
                        <Link to="/products" className="btn-secondary px-7 py-3 text-sm font-semibold">
                            View All Products
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= Impact banner ================= */}
            <section className="bg-color-background text-color-text pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="rounded-3xl px-6 py-12 sm:px-12 text-center text-white shadow-xl"
                        style={{ background: 'linear-gradient(120deg, var(--primary-color), var(--secondary-color))' }}
                        data-aos="zoom-in"
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Small Swaps, Big Impact</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-white/90 text-sm sm:text-base">
                            Together, our community is turning everyday purchases into planetary change.
                        </p>
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {IMPACT_STATS.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-3xl sm:text-4xl font-extrabold">{stat.value}</p>
                                    <p className="mt-1 text-sm text-white/85">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <Link
                            to="/products"
                            className="btn-glass-light mt-10 inline-flex items-center gap-2"
                            style={{ color: 'var(--primary-color)' }}
                        >
                            Join the Movement
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= How It Works ================= */}
            <section className="bg-color-background text-color-text py-16 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">How It Works</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" data-aos="fade-up" data-aos-delay="100">Simple Steps to Sustainable Living</h2>
                    <p className="mt-3 opacity-70 max-w-2xl mx-auto text-sm sm:text-base" data-aos="fade-up" data-aos-delay="150">
                        We made it effortless to go green. Just follow these steps and join the eco-revolution!
                    </p>
                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.title}
                                className="card-surface relative rounded-2xl border shadow-md p-7 pt-9 text-center hover:-translate-y-1 hover:shadow-xl transition"
                                data-aos="fade-up"
                                data-aos-delay={index * 120}
                            >
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md" style={{ backgroundColor: 'var(--primary-color)' }}>
                                    {index + 1}
                                </span>
                                <span className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(136, 183, 59, 0.15)' }}>
                                    <step.icon className="h-7 w-7" style={{ color: 'var(--primary-color)' }} />
                                </span>
                                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                                <p className="mt-2 text-sm opacity-70">{step.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12" data-aos="fade-up">
                        <Link to="/products" className="btn-primary rounded-full px-7 py-3 text-sm font-semibold inline-flex items-center gap-2">
                            Start Shopping Green
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= Testimonials ================= */}
            <section className="bg-color-background text-color-text py-16 lg:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">Testimonials</span>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" data-aos="fade-up" data-aos-delay="100">What Our Customers Say</h2>
                        <p className="mt-3 opacity-70 max-w-2xl mx-auto text-sm sm:text-base" data-aos="fade-up" data-aos-delay="150">
                            Real stories from real people who care about the Earth as much as we do.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentTestimonials.map((testimonial, index) => (
                            <div key={testimonial.name} data-aos="fade-up" data-aos-delay={index * 100} data-aos-once="true">
                                <TestimonialCard
                                    image={testimonial.image}
                                    name={testimonial.name}
                                    title={testimonial.title}
                                    message={testimonial.message}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pager */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <button type="button" onClick={prevSlide} aria-label="Previous testimonials" className="btn-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md transition hover:scale-105">
                            &#10094;
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={'Go to page ' + (i + 1)}
                                    onClick={() => setCurrentIndex(i)}
                                    className="h-2.5 rounded-full transition-all"
                                    style={{
                                        width: i === currentIndex ? '24px' : '10px',
                                        backgroundColor: i === currentIndex ? 'var(--primary-color)' : 'rgba(74, 155, 75, 0.3)',
                                    }}
                                />
                            ))}
                        </div>
                        <button type="button" onClick={nextSlide} aria-label="Next testimonials" className="btn-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md transition hover:scale-105">
                            &#10095;
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= Blog teaser ================= */}
            <section className="bg-color-background text-color-text py-16 lg:py-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">From The Blog</span>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" data-aos="fade-up" data-aos-delay="100">Tips for Greener Living</h2>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingCatalog ? (
                            <div className="col-span-full flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--primary-color)' }} />
                            </div>
                        ) : latestPosts.length === 0 ? (
                            <p className="col-span-full text-center opacity-70 py-6">
                                Fresh articles are on the way � stay tuned.
                            </p>
                        ) : (
                            latestPosts.map((post, index) => (
                                <Link
                                    key={post.id || post.title}
                                    to="/blogs"
                                    className="card-surface group rounded-2xl border shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 120}
                                >
                                    <div className="h-44 overflow-hidden">
                                        <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-highlight text-xs font-bold uppercase tracking-wider">{post.category}</p>
                                        <h3 className="mt-1.5 text-base font-semibold leading-snug">{post.title}</h3>
                                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
                                            Read more
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    <div className="mt-12 text-center" data-aos="fade-up">
                        <Link to="/blogs" className="btn-secondary px-7 py-3 text-sm font-semibold">View All Articles</Link>
                    </div>
                </div>
            </section>

            {/* ================= Recently viewed ================= */}
            <RecentlyViewed />

            {/* ================= Newsletter ================= */}
            <NewsLetter />
        </>
    );
};

export default Home;
