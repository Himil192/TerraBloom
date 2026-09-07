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
    Share2,
    Twitter,
    Facebook,
    MessageCircle,
    Link2,
} from "lucide-react";
import { getAllBlogs, getBlogById } from "../services/blogService";
import { showSuccess, showError } from "../utils/toastUtils";
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

// Thin gradient bar at the very top showing how far the reader has scrolled.
const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const total = doc.scrollHeight - doc.clientHeight;
            setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="fixed left-0 right-0 top-0 z-50 h-1" aria-hidden="true">
            <div
                className="h-full bg-gradient-to-r from-[#4A9B4B] to-[#88B73B] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
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

    const shareUrl = window.location.href;
    const shareText = `${post.title} — TerraBloom`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            showSuccess("Link copied to clipboard");
        } catch {
            showError("Could not copy the link");
        }
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, text: shareText, url: shareUrl });
            } catch {
                /* reader dismissed the share sheet - nothing to do */
            }
        } else {
            copyLink();
        }
    };

    return (
        <div className="bg-color-background text-color-text">
            <ReadingProgress />
            <article className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
                {/* Breadcrumb */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm opacity-70" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-highlight">Home</Link>
                    <span>/</span>
                    <Link to="/blogs" className="hover:text-highlight">Blog</Link>
                    <span>/</span>
                    <span className="max-w-[16rem] truncate font-semibold text-highlight">{post.title}</span>
                </nav>

                {/* Share row - native share sheet with social fallbacks */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm" data-aos="fade-up">
                    <span className="mr-1 font-semibold opacity-70">Share this story:</span>
                    <button
                        type="button"
                        onClick={nativeShare}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-color-border transition hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                        aria-label="Share"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-color-border transition hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                        aria-label="Share on X (Twitter)"
                    >
                        <Twitter className="h-4 w-4" />
                    </a>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-color-border transition hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                        aria-label="Share on Facebook"
                    >
                        <Facebook className="h-4 w-4" />
                    </a>
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-color-border transition hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                        aria-label="Share on WhatsApp"
                    >
                        <MessageCircle className="h-4 w-4" />
                    </a>
                    <button
                        type="button"
                        onClick={copyLink}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-color-border transition hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                        aria-label="Copy link"
                    >
                        <Link2 className="h-4 w-4" />
                    </button>
                </div>

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