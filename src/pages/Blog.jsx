import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import BlogCard from '../component/BlogCard';
import { getAllBlogs } from '../services/blogService';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, SearchX, BookOpen, Tags, RefreshCw, Loader2 } from 'lucide-react';
import Aos from 'aos';
import 'aos/dist/aos.css';

const POSTS_PER_PAGE = 10;

const Blog = () => {
    const { isDark } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const list = await getAllBlogs();
                if (!cancelled) setBlogs(list);
            } catch (error) {
                console.error('Failed to load blogs:', error);
                if (!cancelled) setBlogs([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

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

    const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        const matchesSearch = (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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

    const clearFilters = () => {
        setSelectedCategory('All');
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero */}
            <section className="relative pt-28 pb-10 overflow-hidden">
                <div
                    className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(136,183,59,0.18), transparent 70%)' }}
                />
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">
                        The TerraBloom Journal
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-3 mb-4" data-aos="fade-up" data-aos-delay="100">
                        Stories for a <span className="text-highlight">Greener Life</span>
                    </h1>
                    <p className="text-lg text-color-text opacity-80 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Insights, tips, and stories about sustainable living, eco-friendly products, and making the world a greener place.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold" data-aos="fade-up" data-aos-delay="300">
                        <span className="px-4 py-1.5 rounded-full border border-color-border inline-flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-highlight" />{blogs.length} articles
                        </span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border inline-flex items-center gap-1.5">
                            <Tags className="w-3.5 h-3.5 text-highlight" />{categories.length} topics
                        </span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border">New posts weekly</span>
                    </div>
                </div>
            </section>

            {/* Search + categories toolbar */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-surface rounded-2xl shadow-md border border-color-border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4" data-aos="fade-up">
                        <div className="relative w-full lg:max-w-sm shrink-0">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2.5 pl-10 rounded-full border border-color-border bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-highlight text-sm"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-color-text opacity-50" size={16} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                        selectedCategory === category
                                            ? 'btn-primary text-white shadow-md'
                                            : 'border border-color-border hover:opacity-80'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Blog */}
            {featuredBlog && selectedCategory === 'All' && !searchTerm && safePage === 1 && (
                <section className="pb-12">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">
                            Editor&apos;s Pick
                        </span>
                        <div className="mt-4">
                            <BlogCard blog={featuredBlog} featured />
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Listing */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="card-surface rounded-2xl border border-color-border shadow-md py-16 text-center">
                            <Loader2 className="w-10 h-10 mx-auto text-highlight mb-4 animate-spin" />
                            <p className="text-color-text opacity-70">Loading articles…</p>
                        </div>
                    ) : regularBlogs.length === 0 ? (
                        <div className="card-surface rounded-2xl border border-color-border shadow-md py-16 text-center" data-aos="fade-up">
                            <SearchX className="w-12 h-12 mx-auto text-highlight mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                            <p className="text-color-text opacity-70 mb-6">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={clearFilters}
                                className="btn-primary rounded-full px-7 py-3 text-sm font-semibold inline-flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                                <p className="text-sm text-color-text opacity-70" data-aos="fade-up">
                                    Showing <span className="font-semibold text-highlight">{pageStart}{'\u2013'}{pageEnd}</span> of {regularBlogs.length} articles
                                </p>
                                <div className="flex items-center gap-1 card-surface border border-color-border rounded-full p-1" data-aos="fade-up">
                                    <button onClick={() => setViewMode('grid')} title="Grid View" className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'btn-primary text-white shadow-sm' : 'text-color-text opacity-60 hover:opacity-100'}`}><LayoutGrid size={18} /></button>
                                    <button onClick={() => setViewMode('list')} title="List View" className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'btn-primary text-white shadow-sm' : 'text-color-text opacity-60 hover:opacity-100'}`}><List size={18} /></button>
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
                                    <button onClick={() => setCurrentPage(Math.max(1, safePage - 1))} disabled={safePage === 1} className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium btn-primary text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"><ChevronLeft size={16} /> Prev</button>
                                    {pageNumbers.map((num) => (
                                        <button key={num} onClick={() => setCurrentPage(num)} aria-label={`Go to page ${num}`} aria-current={num === safePage ? 'page' : undefined} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${num === safePage ? 'btn-primary text-white shadow-md' : 'border border-color-border opacity-70 hover:opacity-100'}`}>{num}</button>
                                    ))}
                                    <button onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium btn-primary text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">Next <ChevronRight size={16} /></button>
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