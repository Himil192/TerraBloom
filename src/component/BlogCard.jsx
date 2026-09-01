import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog, featured = false, variant = 'grid' }) => {
    const { id, title, excerpt, image, author, date, readTime, category, tags } = blog;

    const Meta = ({ size = 14, className = '' }) => (
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-color-text opacity-70 ${className}`}>
            <span className="inline-flex items-center gap-1"><User size={size} />{author}</span>
            <span className="inline-flex items-center gap-1"><Calendar size={size} />{date}</span>
            <span className="inline-flex items-center gap-1"><Clock size={size} />{readTime}</span>
        </div>
    );

    if (featured) {
        return (
            <article className="group relative overflow-hidden rounded-2xl bg-color-background shadow-lg border border-color-border transition-all duration-300 hover:shadow-xl h-full" data-aos="fade-up">
                <div className="flex flex-col lg:flex-row">
                    <div className="relative lg:w-1/2 overflow-hidden">
                        <img src={image} alt={title} className="w-full aspect-square lg:aspect-auto lg:h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 btn-primary text-white text-xs font-semibold rounded-full">Featured</span>
                        </div>
                    </div>
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-color-background border border-color-border text-color-text text-xs font-medium rounded-full">{category}</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-color-text mb-3 group-hover:text-highlight transition-colors line-clamp-2">{title}</h2>
                        <p className="text-color-text opacity-80 mb-4 line-clamp-3">{excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-color-text opacity-70 mb-4">
                            <div className="flex items-center gap-1"><User size={14} /><span>{author}</span></div>
                            <div className="flex items-center gap-1"><Calendar size={14} /><span>{date}</span></div>
                            <div className="flex items-center gap-1"><Clock size={14} /><span>{readTime}</span></div>
                        </div>
                        <Link to={`/blogs/${id}`} className="inline-flex items-center gap-2 text-highlight font-semibold hover:opacity-80 transition-colors group/link">
                            Read More <ArrowRight size={18} className="transition-transform group-hover/link:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </article>
        );
    }

    if (variant === 'list') {
        return (
            <article className="group flex h-full flex-row overflow-hidden rounded-2xl bg-color-background shadow-md border border-color-border transition-all duration-300 hover:shadow-lg" data-aos="fade-up">
                {/* Left - Image (fixed square thumb) */}
                <div className="relative w-32 sm:w-44 lg:w-56 flex-shrink-0 overflow-hidden">
                    <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-color-background/90 border border-color-border text-color-text text-xs font-medium rounded-full">{category}</span>
                </div>
                {/* Right - Content */}
                <div className="flex flex-col flex-grow min-w-0 p-4 sm:p-5">
                    <h3 className="text-lg font-bold text-color-text mb-2 group-hover:text-highlight transition-colors line-clamp-2">{title}</h3>
                    <p className="text-color-text opacity-80 text-sm mb-3 line-clamp-2 flex-grow">{excerpt}</p>
                    <Meta size={12} />
                    <Link to={`/blogs/${id}`} className="mt-3 inline-flex items-center gap-2 text-highlight font-semibold text-sm hover:opacity-80 transition-colors group/link">
                        Read Article <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </article>
        );
    }

    return (
        <article className="group flex flex-col h-full overflow-hidden rounded-2xl bg-color-background shadow-md border border-color-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1" data-aos="fade-up">
            <div className="relative overflow-hidden">
                <img src={image} alt={title} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-color-background border border-color-border text-color-text text-xs font-medium rounded-full">{category}</span>
                </div>
            </div>
            <div className="flex flex-col flex-grow p-5">
                <h3 className="text-lg font-bold text-color-text mb-2 group-hover:text-highlight transition-colors line-clamp-2">{title}</h3>
                <p className="text-color-text opacity-80 text-sm mb-4 line-clamp-2 flex-grow">{excerpt}</p>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-color-background border border-color-border text-color-text opacity-70 text-xs rounded-full">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-between text-xs text-color-text opacity-70 pt-4 border-t border-color-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><User size={12} /><span>{author}</span></div>
                        <div className="flex items-center gap-1"><Calendar size={12} /><span>{date}</span></div>
                    </div>
                    <div className="flex items-center gap-1"><Clock size={12} /><span>{readTime}</span></div>
                </div>
                <Link to={`/blogs/${id}`} className="mt-4 inline-flex items-center gap-2 text-highlight font-semibold text-sm hover:opacity-80 transition-colors group/link">
                    Read Article <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;