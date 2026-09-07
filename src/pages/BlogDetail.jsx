import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Quote,
    Leaf,
    Loader2,
    Newspaper,
} from "lucide-react";
import { getAllBlogs, getBlogById } from "../services/blogService";
import BlogCard from "../component/BlogCard";

// SECURITY: every block is rendered as a React text node, which is auto-escaped.
// Never render blog content via dangerouslySetInnerHTML - admin-authored or not,
// stored content must never become executable HTML.
const renderBlock = (block, index) => {
    if (block.type === "heading") {
        return (
            <h2 key={index} className="mb-3 mt-8 text-2xl font-bold">
                {block.text}
            </h2>
        );
    }
    if (block.type === "list") {
        return (
            <ul key={index} className="mb-6 space-y-2">
                {(block.items || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <Leaf className="mt-1 h-4 w-4 flex-shrink-0 text-highlight" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        );
    }
    if (block.type === "quote") {
        return (
            <blockquote
                key={index}
                className="card-surface mb-6 rounded-r-2xl border-l-4 border-[#4A9B4B] p-5 italic shadow-sm"
            >
                <Quote className="mb-2 h-5 w-5 text-highlight" />
                {block.text}
            </blockquote>
        );
    }
    // Default: paragraph
    return (
        <p key={index} className="mb-5 leading-relaxed opacity-85">
            {block.text}
        </p>
    );
};

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setPost(null);
            setRelated([]);
            try {
                const data = await getBlogById(id);
                if (cancelled) return;
                setPost(data);
                if (data) document.title = `${data.title} | TerraBloom`;
                const all = await getAllBlogs();
                if (cancelled) return;
                setRelated(
                    all
                        .filter((b) => b.id !== (data && data.id))
                        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                        .slice(0, 3)
                );
            } catch (error) {
                console.error("Error loading blog post:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(
        () => () => {
            document.title = "TerraBloom";
        },
        []
    );

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center pt-24">
                <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-20 text-center">
                <Newspaper className="mx-auto mb-4 h-12 w-12 text-highlight" />
                <h1 className="mb-2 text-2xl font-bold">Article not found</h1>
                <p className="mb-8 opacity-70">It may have been unpublished or the link is outdated.</p>
                <Link
                    to="/blogs"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-color-background text-color-text">
            <article className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
                {/* Breadcrumb */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm opacity-70" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-highlight">Home</Link>
                    <span>/</span>
                    <Link to="/blogs" className="hover:text-highlight">Blog</Link>
                    <span>/</span>
                    <span className="max-w-[16rem] truncate font-semibold text-highlight">{post.title}</span>
                </nav>

                {/* Header */}
                <header className="mb-8 text-center" data-aos="fade-up">
                    <span className="mb-4 inline-block rounded-full border border-color-border bg-color-background px-3 py-1 text-xs font-medium">
                        {post.category}
                    </span>
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm opacity-70">
                        <span className="inline-flex items-center gap-1.5">
                            <User className="h-4 w-4" /> {post.author}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" /> {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> {post.readTime}
                        </span>
                    </div>
                </header>

                {/* Hero image */}
                <div className="card-surface mb-10 overflow-hidden rounded-3xl border shadow-lg" data-aos="fade-up">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="aspect-video w-full object-cover"
                    />
                </div>

                {/* Content blocks */}
                <div data-aos="fade-up">
                    {(post.content || []).map((block, i) => renderBlock(block, i))}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-2 border-t border-color-border pt-6">
                        {post.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="rounded-full border border-color-border bg-color-background px-3 py-1 text-xs font-medium opacity-80"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer CTAs */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        to="/blogs"
                        className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" /> All Articles
                    </Link>
                    <Link
                        to="/products"
                        className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold"
                    >
                        Shop Eco Products
                    </Link>
                </div>
            </article>

            {/* Related */}
            {related.length > 0 && (
                <section className="mx-auto max-w-screen-xl px-4 pb-20">
                    <h2 className="mb-8 text-2xl font-bold">Keep Reading</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((b) => (
                            <BlogCard key={b.id} blog={b} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogDetail;