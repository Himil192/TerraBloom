import { useEffect, useState } from "react";
import {
    FileText,
    Plus,
    PenLine,
    Trash2,
    Star,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import SearchInput from "../../component/ui/SearchInput";
import GlassSelect from "../../component/ui/GlassSelect";
import BlogForm from "./BlogForm";
import {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../../services/blogService";
import { showError, showSuccess } from "../../utils/toastUtils";
import { formatDate } from "../../utils/dateUtils";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const list = await getAllBlogs();
                if (!cancelled) setBlogs(list);
            } catch (error) {
                console.error("Failed to load blogs:", error);
                if (!cancelled) showError("Failed to load blog articles");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const categories = [...new Set(blogs.map((blog) => blog.category))].sort();

    const refresh = async () => {
        try {
            setBlogs(await getAllBlogs());
        } catch (error) {
            console.error("Failed to refresh blogs:", error);
            showError("Failed to refresh blog articles");
        }
    };

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (blog) => {
        setEditing(blog);
        setFormOpen(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                await updateBlog(editing.id, data);
                showSuccess("Blog post updated");
            } else {
                await createBlog(data);
                showSuccess("Blog post published");
            }
            await refresh();
            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save blog:", error);
            showError("Failed to save article. Check your permissions.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBlog(deleting.id);
            showSuccess("Blog post deleted");
            await refresh();
            setDeleting(null);
        } catch (error) {
            console.error("Failed to delete blog:", error);
            showError("Failed to delete article.");
        }
    };

    const toggleFeatured = async (blog) => {
        try {
            await updateBlog(blog.id, { featured: !blog.featured });
            showSuccess(blog.featured ? "Removed from featured" : "Marked as featured");
            await refresh();
        } catch (error) {
            console.error("Failed to toggle featured:", error);
            showError("Failed to update featured status.");
        }
    };

    const filtered = blogs.filter((blog) => {
        const matchesQuery =
            !query.trim() ||
            blog.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" || blog.category === categoryFilter;
        return matchesQuery && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Blog Articles" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-strong">
                        Articles ({blogs.length})
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                        Manage the journal posts shown in your store.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="btn-glass-solid inline-flex items-center gap-2 text-sm font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    Write Post
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="sm:flex-1 sm:max-w-md"
                />
                <GlassSelect
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    ariaLabel="Filter blogs by category"
                    options={[
                        { value: "all", label: "All categories" },
                        ...categories.map((category) => ({
                            value: category,
                            label: category,
                        })),
                    ]}
                    className="sm:w-48"
                />
            </div>

            {/* TABLE */}
            <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <FileText className="w-10 h-10 mx-auto text-muted" />
                        <p className="mt-3 text-sm font-medium text-secondary">
                            {blogs.length === 0
                                ? "No articles yet. Write your first post!"
                                : "No articles match your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="min-w-[720px] w-full text-sm">
                        <thead className="glass-th text-left text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Article</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5 hidden sm:table-cell">Author</th>
                                <th className="px-5 py-3.5 hidden md:table-cell">Date</th>
                                <th className="px-5 py-3.5">Featured</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-solid border-subtle-t">
                            {filtered.map((blog) => (
                                <tr key={blog.id} className="glass-tr">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-10 h-10 rounded-lg object-cover border border-subtle"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-strong truncate max-w-[260px]">
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-muted truncate max-w-[260px]">
                                                    {blog.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center rounded-full bg-[var(--glass-highlight)] px-2.5 py-1 text-xs font-semibold text-[var(--primary-color)]">
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden sm:table-cell">
                                        {blog.author}
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden md:table-cell">
                                        {formatDate(blog.date)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => toggleFeatured(blog)}
                                            title={blog.featured ? "Unfeature this post" : "Feature this post"}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                                                blog.featured
                                                    ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                                                    : "bg-[var(--glass-highlight)] text-secondary border border-subtle hover:bg-amber-100 hover:text-amber-700"
                                            }`}
                                        >
                                            <Star
                                                className={`w-3.5 h-3.5 ${
                                                    blog.featured ? "text-amber-500" : "text-secondary"
                                                }`}
                                            />
                                            {blog.featured ? "Featured" : "Feature"}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEdit(blog)}
                                                title="Edit post"
                                                aria-label={`Edit ${blog.title}`}
                                                className="p-2 rounded-lg text-secondary hover:bg-[var(--glass-highlight)] hover:text-[var(--primary-color)] transition-colors"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleting(blog)}
                                                title="Delete post"
                                                aria-label={`Delete ${blog.title}`}
                                                className="p-2 rounded-lg text-muted hover:bg-[#B3261E]/10 hover:text-danger transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                className="max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            >
                <h3 className="text-lg font-semibold text-strong mb-1">
                    {editing ? "Edit Article" : "Write Article"}
                </h3>
                <p className="text-sm text-muted mb-5">
                    {editing
                        ? "Update the details and content for this post."
                        : "Compose a new journal post with content blocks."}
                </p>
                <BlogForm
                    initial={editing}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={() => setFormOpen(false)}
                />
            </Modal>

            {/* Delete confirmation */}
            <Modal
                isOpen={deleting !== null}
                onClose={() => setDeleting(null)}
                showCloseButton={false}
                className="max-w-md p-6"
            >
                <h3 className="text-lg font-semibold text-strong">
                    Delete article?
                </h3>
                <p className="text-sm text-secondary mt-2">
                    "{deleting?.title}" will be permanently removed from the blog.
                    This cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={() => setDeleting(null)}
                        className="glass-strong rounded-lg border border-subtle-strong px-4 py-2.5 text-sm font-medium text-secondary hover:bg-[var(--glass-highlight)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Blogs;