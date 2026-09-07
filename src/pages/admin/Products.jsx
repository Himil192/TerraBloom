import { useEffect, useState } from "react";
import {
    Package,
    Plus,
    Search,
    PenLine,
    Trash2,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import ProductForm from "./ProductForm";
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
        ? "bg-gray-100 text-gray-600"
        : "bg-green-100 text-green-800";

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
                    <h3 className="text-lg font-semibold text-gray-900">
                        Catalog ({products.length})
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage the eco products shown in your store.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#4A9B4B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2F6A30] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20 sm:w-44"
                >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* PART2: Table */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#4A9B4B]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <Package className="w-10 h-10 mx-auto text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {products.length === 0
                                ? "No products yet. Add your first one!"
                                : "No products match your filters."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-5 py-3.5">Product</th>
                                <th className="px-5 py-3.5">Price</th>
                                <th className="px-5 py-3.5">Rating</th>
                                <th className="px-5 py-3.5">Stock</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {product.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-[220px]">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {product.rating}
                                    </td>
                                    <td
                                        className={`px-5 py-3.5 ${
                                            Number(product.stock) <= 5
                                                ? "text-red-600 font-semibold"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {Number(product.stock)} in stock
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(
                                                product.status || "active"
                                            )}`}
                                        >
                                            {product.status || "active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => openEdit(product)}
                                                title="Edit product"
                                                className="p-2 rounded-lg text-gray-500 hover:bg-[#4A9B4B]/10 hover:text-[#2F6A30] transition-colors"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleting(product)}
                                                title="Delete product"
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

            {/* PART3: Modals */}
            <Modal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                className="max-w-lg max-h-[85vh] overflow-y-auto p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {editing ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-sm text-gray-500 mb-5">
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
                <h3 className="text-lg font-semibold text-gray-900">
                    Delete product?
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                    "{deleting?.title}" will be permanently removed from the
                    catalog. This cannot be undone.
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

export default Products;