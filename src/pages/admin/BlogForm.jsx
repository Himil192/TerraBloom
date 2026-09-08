import { useState } from "react";
import Input from "../../form/input/InputField";
import { showError } from "../../utils/toastUtils";
import { Plus, Trash2, ArrowUp, ArrowDown, FileText } from "lucide-react";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

const inputClass = "glass-field px-3.5 py-2.5 text-sm";

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
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* FIELDS: title + cover preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                <div className="md:col-span-2 space-y-4">
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
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                <div>
                    <span className={labelClass}>Cover Preview</span>
                    {form.image ? (
                        <img
                            src={form.image}
                            alt="Blog cover preview"
                            className="aspect-square w-full rounded-xl border border-subtle object-cover glass"
                            onError={(e) => { e.currentTarget.style.opacity = "0.25"; }}
                        />
                    ) : (
                        <div className="aspect-square w-full rounded-xl border border-subtle glass flex items-center justify-center">
                            <FileText className="w-9 h-9 text-muted" />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bf-image" className={labelClass}>
                        Cover Image URL
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
            <label className="flex items-center gap-3 cursor-pointer select-none glass rounded-xl border border-subtle p-3">
                <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="w-4.5 h-4.5 rounded accent-[var(--primary-color)]"
                />
                <span className="text-sm font-medium text-secondary">
                    Feature this post on the blog page
                </span>
            </label>

            <div className="glass rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-strong">
                        Content Blocks
                    </p>
                    <button
                        type="button"
                        onClick={addBlock}
                        className="btn-glass-solid inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Block
                    </button>
                </div>
                <div className="mt-3 space-y-3">
                    {blocks.map((block, i) => (
                        <div key={i} className="glass-strong rounded-lg border border-subtle p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={block.type}
                                    onChange={(e) => updateBlock(i, { type: e.target.value })}
                                    className="glass-field w-32 px-2.5 py-1.5 text-xs font-medium"
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
                                        className="p-1.5 rounded-md text-muted hover:bg-[var(--glass-highlight)] hover:text-strong disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(i, 1)}
                                        disabled={i === blocks.length - 1}
                                        className="p-1.5 rounded-md text-muted hover:bg-[var(--glass-highlight)] hover:text-strong disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeBlock(i)}
                                        className="p-1.5 rounded-md text-muted hover:bg-[#B3261E]/10 hover:text-danger"
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
                    className="glass-strong rounded-lg border border-subtle-strong px-4 py-2.5 text-sm font-medium text-secondary hover:bg-[var(--glass-highlight)] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-glass-solid inline-flex items-center justify-center gap-2 text-sm font-semibold"
                >
                    {initial ? "Save Changes" : "Publish Post"}
                </button>
            </div>
        </form>
    );
};

export default BlogForm;