import { useState } from "react";
import Input from "../../form/input/InputField";
import { Package } from "lucide-react";
import { showError } from "../../utils/toastUtils";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

const inputClass = "glass-field px-3.5 py-2.5 text-sm";

const ProductForm = ({ initial, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        title: initial?.title || "",
        price: initial ? String(initial.price) : "",
        stock: initial ? String(initial.stock ?? 0) : "0",
        rating: initial ? String(initial.rating ?? 4.5) : "4.5",
        image: initial?.image || "",
        description: initial?.description || "",
        status: initial?.status || "active",
    });

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            showError("Product title is required");
            return;
        }
        if (Number(form.price) <= 0) {
            showError("Price must be greater than zero");
            return;
        }
        onSubmit({
            title: form.title,
            price: Number(form.price),
            stock: Number(form.stock),
            rating: Number(form.rating),
            image: form.image,
            description: form.description,
            status: form.status,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title + live preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label htmlFor="pf-title" className={labelClass}>
                            Title
                        </label>
                        <Input
                            id="pf-title"
                            value={form.title}
                            onChange={set("title")}
                            placeholder="e.g. Bamboo Toothbrush"
                        />
                    </div>

                    <div>
                        <label htmlFor="pf-image" className={labelClass}>
                            Image URL
                        </label>
                        <Input
                            id="pf-image"
                            value={form.image}
                            onChange={set("image")}
                            placeholder="/FeatureProducts/BambooBrush.jpg"
                        />
                    </div>
                </div>

                {/* Image preview */}
                <div>
                    <span className={labelClass}>Preview</span>
                    {form.image ? (
                        <img
                            src={form.image}
                            alt="Product preview"
                            className="aspect-square w-full rounded-xl border border-subtle object-cover glass"
                            onError={(e) => { e.currentTarget.style.opacity = "0.25"; }}
                        />
                    ) : (
                        <div className="aspect-square w-full rounded-xl border border-subtle glass flex items-center justify-center">
                            <Package className="w-9 h-9 text-muted" />
                        </div>
                    )}
                </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="pf-price" className={labelClass}>
                        Price (₹)
                    </label>
                    <Input
                        id="pf-price"
                        type="number"
                        min="0"
                        step="1"
                        value={form.price}
                        onChange={set("price")}
                        placeholder="100"
                    />
                </div>
                <div>
                    <label htmlFor="pf-stock" className={labelClass}>
                        Stock
                    </label>
                    <Input
                        id="pf-stock"
                        type="number"
                        min="0"
                        step="1"
                        value={form.stock}
                        onChange={set("stock")}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label htmlFor="pf-rating" className={labelClass}>
                        Rating
                    </label>
                    <Input
                        id="pf-rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={form.rating}
                        onChange={set("rating")}
                        placeholder="4.5"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="pf-status" className={labelClass}>
                    Status
                </label>
                <select
                    id="pf-status"
                    value={form.status}
                    onChange={set("status")}
                    className={inputClass}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div>
                <label htmlFor="pf-description" className={labelClass}>
                    Description
                </label>
                <textarea
                    id="pf-description"
                    rows="3"
                    value={form.description}
                    onChange={set("description")}
                    placeholder="Short eco-friendly description..."
                    className={`${inputClass} resize-none`}
                />
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
                    {initial ? "Save Changes" : "Add Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;