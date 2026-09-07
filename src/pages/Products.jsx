import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Link } from "react-router-dom";
import ProductCards from "../component/ProductCards";
import { getAllProducts } from "../services/productService";
import { Truck, Recycle, BadgeCheck, Leaf, SearchX, ArrowRight, SlidersHorizontal } from "lucide-react";
import { SkeletonGrid } from "../component/common/Skeletons";
import Aos from "aos";
import "aos/dist/aos.css";

const PRICE_RANGES = [
    { id: "all", label: "All Products", test: () => true },
    { id: "low", label: "Under \u20B9150", test: (p) => p.price < 150 },
    { id: "mid", label: "\u20B9150 - \u20B9400", test: (p) => p.price >= 150 && p.price <= 400 },
    { id: "high", label: "\u20B9400+", test: (p) => p.price > 400 },
];

const SORT_OPTIONS = [
    { id: "featured", label: "Featured" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "rating", label: "Top Rated" },
];

const TRUST_ITEMS = [
    { icon: Truck, title: "Free Eco Delivery", text: "On all orders over \u20B9499" },
    { icon: Recycle, title: "Plastic-Free Packaging", text: "Compostable materials, always" },
    { icon: BadgeCheck, title: "Quality Guaranteed", text: "Loved by 10,000+ customers" },
    { icon: Leaf, title: "1% Gives Back", text: "Every order plants trees" },
];

const Products = () => {
    const { isDark } = useTheme();
    const [activeRange, setActiveRange] = useState("all");
    const [activeSort, setActiveSort] = useState("featured");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const list = await getAllProducts();
                if (!cancelled) setProducts(list);
            } catch (error) {
                console.error("Failed to load products:", error);
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    useEffect(() => {
        Aos.init({ duration: 800, once: true, offset: 60 });
    }, []);

    const visibleProducts = useMemo(() => {
        const range = PRICE_RANGES.find((r) => r.id === activeRange) || PRICE_RANGES[0];
        const list = products.filter((product) => range.test(product));
        const sorted = [...list];
        if (activeSort === "price-asc") sorted.sort((a, b) => a.price - b.price);
        if (activeSort === "price-desc") sorted.sort((a, b) => b.price - a.price);
        if (activeSort === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return sorted;
    }, [activeRange, activeSort, products]);

    const clearFilters = () => {
        setActiveRange("all");
        setActiveSort("featured");
    };

    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(74,155,75,0.18), transparent 70%)" }}
                />
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">
                        Shop Sustainably
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-3 mb-4" data-aos="fade-up" data-aos-delay="100">
                        Our <span className="text-highlight">Products</span>
                    </h1>
                    <p className="text-lg text-color-text opacity-80 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Handpicked, planet-friendly essentials you can feel good about buying.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold" data-aos="fade-up" data-aos-delay="300">
                        <span className="px-4 py-1.5 rounded-full border border-color-border">{products.length} products</span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border">Free delivery over {"\u20B9"}499</span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border">100% plastic-free</span>
                    </div>
                </div>
            </section>

            {/* Filter toolbar */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-surface rounded-2xl shadow-md border border-color-border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4" data-aos="fade-up">
                        <div className="flex items-center gap-2 text-sm font-semibold shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-highlight" />
                            <span className="hidden sm:inline">Filter</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 flex-grow">
                            {PRICE_RANGES.map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => setActiveRange(range.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                        activeRange === range.id
                                            ? "btn-primary text-white shadow-md"
                                            : "border border-color-border hover:opacity-80"
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <label htmlFor="product-sort" className="text-sm opacity-70 whitespace-nowrap">
                                Sort
                            </label>
                            <select
                                id="product-sort"
                                value={activeSort}
                                onChange={(e) => setActiveSort(e.target.value)}
                                className="px-4 py-2 rounded-full border border-color-border bg-color-background text-color-text text-sm focus:outline-none focus:ring-2 focus:ring-highlight"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product grid */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="card-surface rounded-2xl border border-color-border shadow-md py-16 text-center" data-aos="fade-up">
                            <Loader2 className="w-10 h-10 mx-auto animate-spin text-highlight" />
                            <p className="text-color-text opacity-70 mt-4">Loading eco products...</p>
                        </div>
                    ) : visibleProducts.length === 0 ? (
                        <div className="card-surface rounded-2xl border border-color-border shadow-md py-16 text-center" data-aos="fade-up">
                            <SearchX className="w-12 h-12 mx-auto text-highlight mb-4" />
                            <h3 className="text-xl font-bold mb-2">No products found</h3>
                            <p className="text-color-text opacity-70 mb-6">
                                {products.length === 0
                                    ? "The catalog is empty. Check back soon!"
                                    : "Try a different price range."}
                            </p>
                            {products.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="btn-primary rounded-full px-7 py-3 text-sm font-semibold inline-flex items-center gap-2"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-color-text opacity-70 mb-6" data-aos="fade-up">
                                Showing <span className="font-semibold text-highlight">{visibleProducts.length}</span> of {products.length} products
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {visibleProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex justify-center"
                                        data-aos="zoom-in-up"
                                        data-aos-delay={(index % 4) * 100}
                                        data-aos-once="true"
                                    >
                                        <ProductCards product={product} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Gradient CTA band */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl overflow-hidden relative"
                        style={{ background: "linear-gradient(120deg, var(--primary-color), var(--secondary-color))" }}
                        data-aos="fade-up"
                    >
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Loving what you see?</h2>
                        <p className="max-w-xl mx-auto opacity-90 mb-8">
                            Every purchase plants trees and removes plastic from the ocean. Small cart, big impact.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/contact-us"
                                className="inline-flex items-center gap-2 bg-white text-[#2F6A30] font-semibold px-6 py-3 rounded-full hover:bg-[#E6FAEB] transition-colors"
                            >
                                Talk to Us <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/blogs"
                                className="inline-flex items-center gap-2 border border-white/70 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                            >
                                Read Our Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TRUST_ITEMS.map((item, index) => (
                            <div
                                key={item.title}
                                className="card-surface rounded-2xl shadow-md border border-color-border p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                data-aos-once="true"
                            >
                                <span
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0"
                                    style={{ backgroundColor: "var(--primary-color)" }}
                                >
                                    <item.icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-color-text opacity-70">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Products;