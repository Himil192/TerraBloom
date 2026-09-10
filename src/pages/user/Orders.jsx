import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { auth } from "../../firebase";
import { getOrdersByUser, normalizeOrder } from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import SearchInput from "../../component/ui/SearchInput";
import GlassSelect from "../../component/ui/GlassSelect";
import OrderCard from "../../component/user/OrderCard";
import { ORDER_STATUSES } from "../../utils/orderStatus";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let cancelled = false;
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                if (!cancelled) {
                    setOrders([]);
                    setLoading(false);
                }
                return;
            }
            try {
                // Scoped server-side to the caller's own uid
                // (firestore.rules: orders read requires userId == auth.uid).
                const rows = await getOrdersByUser(user.uid);
                if (!cancelled) setOrders(rows.map(normalizeOrder));
            } catch (error) {
                console.error("Failed to load orders:", error);
                if (!cancelled) {
                    setOrders([]);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        });
        return () => {
            cancelled = true;
            unsub();
        };
    }, []);

    // Live catalog for order-card thumbnails.
    useEffect(() => {
        let cancelled = false;
        getAllProducts()
            .then((rows) => {
                if (!cancelled) setProducts(rows);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const productById = new Map(
        products.map((p) => [String(p.id), p])
    );

    const filtered = orders.filter((order) => {
        const needle = query.trim().toLowerCase();
        const matchesQuery =
            !needle ||
            order.orderNumber?.toLowerCase().includes(needle) ||
            String(order.id).toLowerCase().includes(needle);
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="My Orders" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                    <p className="text-sm text-muted mt-0.5">
                        Track, view details and leave reviews on delivered orders.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by order number..."
                    className="sm:flex-1 sm:max-w-md"
                />
                <GlassSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    ariaLabel="Filter orders by status"
                    options={[
                        { value: "all", label: "All statuses" },
                        ...ORDER_STATUSES.map((status) => ({
                            value: status,
                            label: status,
                        })),
                    ]}
                    className="sm:w-48"
                />
            </div>

            {/* Order cards */}
            {loading ? (
                <div className="glass-strong rounded-2xl border border-subtle flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-strong rounded-2xl border border-subtle px-6 py-14 text-center">
                    <ShoppingBag className="w-10 h-10 mx-auto text-muted" />
                    <p className="mt-3 text-sm font-medium text-secondary">
                        {orders.length === 0
                            ? loadError
                                ? "Couldn't load your orders."
                                : "No orders yet - your eco journey starts with the first one!"
                            : "No orders match your filters."}
                    </p>
                    {orders.length === 0 && !loadError && (
                        <Link
                            to="/products"
                            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 mt-5 text-sm font-semibold"
                        >
                            Shop Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filtered.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            productById={productById}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;