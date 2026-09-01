import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import BlogCard from '../component/BlogCard';
import { blogs, getCategories } from '../data/blogs';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Aos from 'aos';
import 'aos/dist/aos.css';

const POSTS_PER_PAGE = 10;

const Blog = () => {
    const { isDark } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to first page whenever the filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        Aos.init({
            duration: 800,
            once: false,
            offset: 100,
        });
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const categories = ['All', ...getCategories()];

    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredBlog = blogs.find(blog => blog.featured);
    const regularBlogs = filteredBlogs.filter(blog => !blog.featured);

    const totalPages = Math.max(1, Math.ceil(regularBlogs.length / POSTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const pageBlogs = regularBlogs.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

    // Window of up to 5 page numbers centered on the current page
    const pageNumbers = (() => {
        const start = Math.max(1, safePage - 2);
        const end = Math.min(totalPages, start + 4);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    const pageStart = regularBlogs.length === 0 ? 0 : (safePage - 1) * POSTS_PER_PAGE + 1;
    const pageEnd = Math.min(safePage * POSTS_PER_PAGE, regularBlogs.length);

    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-color-background">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4" data-aos="fade-up">
                        Our <span className="text-highlight">Blog</span>
                    </h1>
                    <p className="text-lg text-color-text opacity-80 max-w-2xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
                        Insights, tips, and stories about sustainable living, eco-friendly products, and making the world a greener place.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative" data-aos="fade-up" data-aos-delay="200">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 rounded-full border border-color-border bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-highlight shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-color-text opacity-50" size={20} />
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'btn-primary text-white shadow-md'
                                    : 'bg-color-background border border-color-border text-color-text hover:opacity-80'
                                    }`}
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle moved into listing toolbar */}
                </div>
            </section>

            {/* Featured Blog */}
            {featuredBlog && selectedCategory === 'All' && !searchTerm && safePage === 1 && (
                <section className="px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <BlogCard blog={featuredBlog} featured />
                    </div>
                </section>
            )}

            {/* Blog Listing */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-7xl mx-auto">
                    {regularBlogs.length === 0 ? (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                            <p className="text-color-text opacity-70">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <p className="text-sm text-color-text opacity-70" data-aos="fade-right">Showing <span className="font-semibold text-highlight">{pageStart}–{pageEnd}</span> of {regularBlogs.length} articles</p>
                            <div className="flex items-center gap-1 bg-color-background border border-color-border rounded-lg p-1" data-aos="fade-left">
                                <button onClick={() => setViewMode('grid')} title="Grid View" className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'btn-primary text-white shadow-sm' : 'text-color-text opacity-60 hover:opacity-100'}`}><LayoutGrid size={18} /></button>
                                <button onClick={() => setViewMode('list')} title="List View" className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'btn-primary text-white shadow-sm' : 'text-color-text opacity-60 hover:opacity-100'}`}><List size={18} /></button>
                            </div>
                        </div>
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'
                            : 'flex flex-col gap-5'
                        }>
                            {pageBlogs.map((blog, index) => (
                                <div
                                    key={blog.id}
                                    data-aos="fade-up"
                                    data-aos-delay={(index % 3) * 100}
                                    className={viewMode === 'list' ? 'w-full' : 'h-full'}
                                >
                                    <BlogCard blog={blog} variant={viewMode} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="flex flex-wrap items-center justify-center gap-2 mt-12" aria-label="Blog pagination">
                                <button onClick={() => setCurrentPage(Math.max(1, safePage - 1))} disabled={safePage === 1} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"><ChevronLeft size={16} /> Prev</button>
                                {pageNumbers.map((num) => (
                                    <button key={num} onClick={() => setCurrentPage(num)} aria-label={`Go to page ${num}`} aria-current={num === safePage ? 'page' : undefined} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${num === safePage ? 'btn-primary text-white shadow-md' : 'bg-color-background border border-color-border text-color-text opacity-70 hover:opacity-100'}`}>{num}</button>
                                ))}
                                <button onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium btn-primary text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">Next <ChevronRight size={16} /></button>
                            </nav>
                        )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Blog;