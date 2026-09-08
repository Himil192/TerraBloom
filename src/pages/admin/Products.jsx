import { useEffect, useState } from "react";
import {
    Package,
    Plus,
    PenLine,
    Trash2,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import ProductForm from "./ProductForm";
import SearchInput from "../../component/ui/SearchInput";
import GlassSelect from "../../component/ui/GlassSelect";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../services/productService";
import { showError, showSuccess } from "../../utils/toastUtils";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const statusPill = (status) =>
    status === "inactive"
        ? "bg-[var(--glass-highlight)] text-secondary border border-subtle"
        : "bg-green-100 text-green-800 border border-green-200";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const list = await getAllProducts();
                if (!cancelled) setProducts(list);
            } catch (error) {
                console.error("Failed to load products:", error);
                if (!cancelled) showError("Failed to load products");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const refresh = async () => {
        try {
            setProducts(await getAllProducts());
        } catch (error) {
            console.error("Failed to refresh products:", error);
            showError("Failed to refresh products");
        }
    };

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setFormOpen(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                await updateProduct(editing.id, data);
                showSuccess("Product updated");
            } else {
                await createProduct(data);
                showSuccess("Product added");
            }
            await refresh();
            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save product:", error);
            showError("Failed to save product. Check your permissions.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProduct(deleting.id);
            showSuccess("Product deleted");
            await refresh();
            setDeleting(null);
        } catch (error) {
            console.error("Failed to delete product:", error);
            showError("Failed to delete product.");
        }
    };

    const filtered = products.filter((product) => {
        const matchesQuery =
            !query.trim() ||
            product.title.toLowerCase().includes(query.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (product.status || "active") === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Products" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-strong">
                        Catalog ({products.length})
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                        Manage the eco products shown in your store.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="btn-glass-solid inline-flex items-center gap-2 text-sm font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="sm:flex-1 sm:max-w-md"
                />
                <GlassSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    ariaLabel="Filter products by status"
                    options={[
                        { value: "all", label: "All statuses" },
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                    ]}
                    className="sm:w-44"
                />
            </div>

            {/* PART2: Table */}
            <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <Package className="w-10 h-10 mx-auto text-muted" />
                        <p className="mt-3 text-sm font-medium text-secondary">
                            {products.length === 0
                                ? "No products yet. Add your first one!"
                                : "No products match your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead className="glass-th text-left text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Product</th>
                                <th className="px-5 py-3.5">Price</th>
                                <th className="px-5 py-3.5 hidden sm:table-cell">Rating</th>
                                <th className="px-5 py-3.5 hidden md:table-cell">Stock</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-solid border-subtle-t">
                            {filtered.map((product) => (
                                <tr key={product.id} className="glass-tr">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-10 h-10 rounded-lg object-cover border border-subtle"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-strong truncate">
                                                    {product.title}
                                                </p>
                                                <p className="text-xs text-muted truncate max-w-[220px]">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-strong">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden sm:table-cell">
                                        {product.rating}
                                    </td>
                                    <td
                                        className={`px-5 py-3.5 hidden md:table-cell ${
                                            Number(product.stock) <= 5
                                                ? "text-danger font-semibold"
                                                : "text-secondary"
                                        }`}
                                    >
                                        {Number(product.stock)} in stock
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusPill(
                                                product.status || "active"
                                            )}`}
                                        >
                                            {product.status || "active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEdit(product)}
                                                title="Edit product"
                                                aria-label={`Edit ${product.title}`}
                                                className="p-2 rounded-lg text-secondary hover:bg-[var(--glass-highlight)] hover:text-[var(--primary-color)] transition-colors"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleting(product)}
                                                title="Delete product"
                                                aria-label={`Delete ${product.title}`}
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

            {/* PART3: Modals */}
            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                className="max-w-lg max-h-[85vh] overflow-y-auto p-6"
            >
                <h3 className="text-lg font-semibold text-strong mb-1">
                    {editing ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-sm text-muted mb-5">
                    {editing
                        ? "Update the details for this product."
                        : "Fill in the details to list a new eco product."}
                </p>
                <ProductForm
                    initial={editing}
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
                    Delete product?
                </h3>
                <p className="text-sm text-secondary mt-2">
                    "{deleting?.title}" will be permanently removed from the
                    catalog. This cannot be undone.
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

export default Products;