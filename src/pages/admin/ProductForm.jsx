import { useState } from "react";
import Input from "../../form/input/InputField";
import { showError } from "../../utils/toastUtils";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500";

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-brand-500/20";

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
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-3 gap-4">
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
                    className={inputClass}
                />
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
                    {initial ? "Save Changes" : "Add Product"}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;