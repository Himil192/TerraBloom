import { useState } from "react";
import Input from "../../form/input/InputField";
import { showError } from "../../utils/toastUtils";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500";

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-brand-500/20";

const BLOCK_TYPES = [
    { value: "paragraph", label: "Paragraph" },
    { value: "heading", label: "Heading" },
    { value: "list", label: "List" },
    { value: "quote", label: "Quote" },
];

const toBlock = (block) =>
    block.type === "list"
        ? { type: "list", itemsText: Array.isArray(block.items) ? block.items.join("\n") : "" }
        : { type: block.type || "paragraph", text: block.text || "" };

const BlogForm = ({ initial, categories = [], onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: initial?.title || "",
        excerpt: initial?.excerpt || "",
        image: initial?.image || "",
        author: initial?.author || "",
        readTime: initial?.readTime || "5 min read",
        category: initial?.category || "",
        featured: Boolean(initial?.featured),
    });
    const [blocks, setBlocks] = useState(
        Array.isArray(initial?.content) && initial.content.length
            ? initial.content.map(toBlock)
            : [{ type: "paragraph", text: "" }]
    );

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const addBlock = () =>
        setBlocks((prev) => [...prev, { type: "paragraph", text: "" }]);

    const removeBlock = (i) =>
        setBlocks((prev) => prev.filter((_, idx) => idx !== i));

    const moveBlock = (i, dir) => {
        const target = i + dir;
        if (target < 0 || target >= blocks.length) return;
        setBlocks((prev) => {
            const next = [...prev];
            const [block] = next.splice(i, 1);
            next.splice(target, 0, block);
            return next;
        });
    };

    const updateBlock = (i, patch) =>
        setBlocks((prev) =>
            prev.map((block, idx) => (idx === i ? { ...block, ...patch } : block))
        );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            showError("Blog title is required");
            return;
        }
        const content = blocks
            .map((block) =>
                block.type === "list"
                    ? {
                        type: "list",
                        items: block.itemsText
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                    }
                    : { type: block.type, text: block.text.trim() }
            )
            .filter((block) =>
                block.type === "list" ? block.items.length > 0 : block.text
            );
        if (content.length === 0) {
            showError("Add at least one content block");
            return;
        }
        onSubmit({
            title: form.title,
            excerpt: form.excerpt,
            image: form.image,
            author: form.author,
            readTime: form.readTime,
            category: form.category,
            featured: form.featured,
            tags: initial?.tags || [],
            content,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* FIELDS: title, excerpt, meta */}
            <div>
                <label htmlFor="bf-title" className={labelClass}>
                    Title
                </label>
                <Input
                    id="bf-title"
                    value={form.title}
                    onChange={set("title")}
                    placeholder="10 Simple Ways to Reduce Plastic..."
                />
            </div>

            <div>
                <label htmlFor="bf-excerpt" className={labelClass}>
                    Excerpt
                </label>
                <textarea
                    id="bf-excerpt"
                    rows="2"
                    value={form.excerpt}
                    onChange={set("excerpt")}
                    placeholder="Short summary shown on blog cards..."
                    className={inputClass}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bf-image" className={labelClass}>
                        Image URL
                    </label>
                    <Input
                        id="bf-image"
                        value={form.image}
                        onChange={set("image")}
                        placeholder="/carousel/Product1.png"
                    />
                </div>
                <div>
                    <label htmlFor="bf-category" className={labelClass}>
                        Category
                    </label>
                    <input
                        id="bf-category"
                        list="category-suggestions"
                        value={form.category}
                        onChange={set("category")}
                        placeholder="Sustainability"
                        className={inputClass}
                    />
                    <datalist id="category-suggestions">
                        {categories.map((category) => (
                            <option key={category} value={category} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="bf-author" className={labelClass}>
                        Author
                    </label>
                    <Input
                        id="bf-author"
                        value={form.author}
                        onChange={set("author")}
                        placeholder="TerraBloom Team"
                    />
                </div>
                <div>
                    <label htmlFor="bf-readtime" className={labelClass}>
                        Read Time
                    </label>
                    <Input
                        id="bf-readtime"
                        value={form.readTime}
                        onChange={set("readTime")}
                        placeholder="5 min read"
                    />
                </div>
            </div>

            {/* FEATURED + BLOCKS */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="w-4.5 h-4.5 rounded border-gray-300 text-[#4A9B4B] focus:ring-[#4A9B4B]"
                />
                <span className="text-sm font-medium text-gray-700">
                    Feature this post on the blog page
                </span>
            </label>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                        Content Blocks
                    </p>
                    <button
                        type="button"
                        onClick={addBlock}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#4A9B4B]/30 bg-[#4A9B4B]/5 px-3 py-1.5 text-xs font-semibold text-[#2F6A30] hover:bg-[#4A9B4B]/10 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Block
                    </button>
                </div>
                <div className="mt-3 space-y-3">
                    {blocks.map((block, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={block.type}
                                    onChange={(e) => updateBlock(i, { type: e.target.value })}
                                    className="w-32 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#4A9B4B]"
                                >
                                    {BLOCK_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex items-center gap-1 ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(i, -1)}
                                        disabled={i === 0}
                                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(i, 1)}
                                        disabled={i === blocks.length - 1}
                                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeBlock(i)}
                                        className="p-1.5 rounded-md text-gray-400 hover:bg-red-100 hover:text-red-600"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            {block.type === "list" ? (
                                <textarea
                                    value={block.itemsText}
                                    onChange={(e) => updateBlock(i, { itemsText: e.target.value })}
                                    rows="3"
                                    placeholder="One item per line"
                                    className={`${inputClass} mt-2`}
                                />
                            ) : (
                                <textarea
                                    value={block.text}
                                    onChange={(e) => updateBlock(i, { text: e.target.value })}
                                    rows="2"
                                    placeholder={
                                        block.type === "heading"
                                            ? "Heading text"
                                            : block.type === "quote"
                                                ? "Quote text"
                                                : "Paragraph text"
                                    }
                                    className={`${inputClass} mt-2`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-[#4A9B4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2F6A30] transition-colors"
                >
                    {initial ? "Save Changes" : "Publish Post"}
                </button>
            </div>
        </form>
    );
};

export default BlogForm;