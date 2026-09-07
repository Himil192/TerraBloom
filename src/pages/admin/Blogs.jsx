import { useState } from "react";
import {
    FileText,
    Plus,
    Search,
    PenLine,
    Trash2,
    Star,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import BlogForm from "./BlogForm";
import {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../../services/blogService";
import { showSuccess } from "../../utils/toastUtils";

const Blogs = () => {
    const [blogs, setBlogs] = useState(getAllBlogs());
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const categories = [...new Set(getAllBlogs().map((blog) => blog.category))].sort();

    const refresh = () => setBlogs(getAllBlogs());

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (blog) => {
        setEditing(blog);
        setFormOpen(true);
    };

    const handleSubmit = (data) => {
        if (editing) {
            updateBlog(editing.id, data);
            showSuccess("Blog post updated");
        } else {
            createBlog(data);
            showSuccess("Blog post published");
        }
        refresh();
        setFormOpen(false);
    };

    const handleDelete = () => {
        deleteBlog(deleting.id);
        showSuccess("Blog post deleted");
        refresh();
        setDeleting(null);
    };

    const toggleFeatured = (blog) => {
        updateBlog(blog.id, { featured: !blog.featured });
        showSuccess(blog.featured ? "Removed from featured" : "Marked as featured");
        refresh();
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
                    <h3 className="text-lg font-semibold text-gray-900">
                        Articles ({blogs.length})
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage the journal posts shown in your store.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#4A9B4B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2F6A30] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Write Post
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20 sm:w-48"
                >
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <FileText className="w-10 h-10 mx-auto text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {blogs.length === 0
                                ? "No articles yet. Write your first post!"
                                : "No articles match your filters."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-5 py-3.5">Article</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5">Author</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Featured</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate max-w-[260px]">
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-[260px]">
                                                    {blog.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-block rounded-full bg-[#4A9B4B]/10 px-2.5 py-1 text-xs font-semibold text-[#2F6A30]">
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {blog.author}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {blog.date}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => toggleFeatured(blog)}
                                            title={blog.featured ? "Unfeature this post" : "Feature this post"}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                                                blog.featured
                                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                    : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                                            }`}
                                        >
                                            <Star
                                                className={`w-3.5 h-3.5 ${
                                                    blog.featured ? "text-amber-500" : "text-gray-400"
                                                }`}
                                            />
                                            {blog.featured ? "Featured" : "Feature"}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => openEdit(blog)}
                                                title="Edit post"
                                                className="p-2 rounded-lg text-gray-500 hover:bg-[#4A9B4B]/10 hover:text-[#2F6A30] transition-colors"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleting(blog)}
                                                title="Delete post"
                                                className="p-2 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                className="max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {editing ? "Edit Article" : "Write Article"}
                </h3>
                <p className="text-sm text-gray-500 mb-5">
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
                <h3 className="text-lg font-semibold text-gray-900">
                    Delete article?
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                    "{deleting?.title}" will be permanently removed from the blog.
                    This cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={() => setDeleting(null)}
                        className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
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