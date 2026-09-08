import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Eye,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import SearchInput from "../../component/ui/SearchInput";
import GlassSelect from "../../component/ui/GlassSelect";
import {
    getAllOrders,
    updateOrderStatus,
    normalizeOrder,
} from "../../services/orderService";
import { showError, showSuccess } from "../../utils/toastUtils";
import { formatDate as formatDateValue } from "../../utils/dateUtils";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
// Delegate to the shared util: the old local version returned the raw object in
// its catch block, which crashed React for JSON-serialized {seconds, nanoseconds}.
// NOTE: Intl only allows "numeric" | "2-digit" for `day` ("short" throws RangeError).
const formatDate = (d) =>
    formatDateValue(d, { day: "numeric", month: "short", year: "numeric" });

const ORDER_STATUSES = ["Processing", "In Transit", "Delivered", "Cancelled"];

const statusPill = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800 border border-green-200";
        case "In Transit":
            return "bg-blue-100 text-blue-700 border border-blue-200";
        case "Processing":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        case "Cancelled":
            return "bg-red-100 text-red-600 border border-red-200";
        default:
            return "bg-[var(--glass-highlight)] text-secondary border border-subtle";
    }
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                                const list = await getAllOrders();
                if (!cancelled) setOrders(list.map(normalizeOrder));
            } catch (error) {
                console.error("Failed to load orders:", error);
                if (!cancelled) showError("Failed to load orders");
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
                        setOrders((await getAllOrders()).map(normalizeOrder));
        } catch (error) {
            console.error("Failed to refresh orders:", error);
            showError("Failed to refresh orders");
        }
    };

    const changeStatus = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            showSuccess(`Order ${orderId} moved to ${status}`);
            await refresh();
            if (detail?.id === String(orderId)) {
                setDetail((await getAllOrders()).find((o) => o.id === String(orderId)));
            }
        } catch (error) {
            console.error("Failed to update order:", error);
            showError("Failed to update order status.");
        }
    };

    const filtered = orders.filter((order) => {
        const needle = query.trim().toLowerCase();
                const matchesQuery =
            !needle ||
            order.orderNumber?.toLowerCase().includes(needle) ||
            order.customerName?.toLowerCase().includes(needle) ||
            order.customerEmail?.toLowerCase().includes(needle);
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Orders" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-strong">
                        All Orders ({orders.length})
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                        Track and update orders from your storefront.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by order ID or customer..."
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

            {/* TABLE */}
            <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <ShoppingCart className="w-10 h-10 mx-auto text-muted" />
                        <p className="mt-3 text-sm font-medium text-secondary">
                            {orders.length === 0
                                ? "No orders yet."
                                : "No orders match your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead className="glass-th text-left text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Order</th>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5 hidden sm:table-cell">Date</th>
                                <th className="px-5 py-3.5 hidden md:table-cell">Items</th>
                                <th className="px-5 py-3.5 text-right">Total</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-solid border-subtle-t">
                            {filtered.map((order) => (
                                <tr key={order.id} className="glass-tr">
                                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-strong">
                                        #{order.orderNumber}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-strong font-medium">{order.customerName}</p>
                                        <p className="text-xs text-muted">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden sm:table-cell">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden md:table-cell">
                                        {order.items.reduce((sum, i) => sum + i.qty, 0)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold text-strong">
                                        {formatPrice(order.total)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <select
                                            value={order.status}
                                            onChange={(e) => changeStatus(order.id, e.target.value)}
                                            className={`rounded-full text-xs font-semibold border pr-7 py-1 pl-2.5 ${statusPill(
                                                order.status
                                            )} focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] cursor-pointer`}
                                        >
                                            {ORDER_STATUSES.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => setDetail(order)}
                                            title="View order"
                                            aria-label={`View order ${order.orderNumber}`}
                                            className="p-2 rounded-lg text-secondary hover:bg-[var(--glass-highlight)] hover:text-[var(--primary-color)] transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}
            <Modal
                isOpen={detail !== null}
                onClose={() => setDetail(null)}
                className="max-w-lg max-h-[85vh] overflow-y-auto p-6"
            >
                {detail && (
                    <>
                        <div className="flex items-start justify-between pr-14">
                            <div>
                                <h3 className="text-lg font-semibold text-strong">
                                    Order #{detail.orderNumber}
                                </h3>
                                <p className="text-sm text-muted mt-0.5">
                                    {formatDate(detail.createdAt)} · {detail.paymentMethod}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(
                                    detail.status
                                )}`}
                            >
                                {detail.status}
                            </span>
                        </div>

                        <div className="mt-5 glass rounded-xl border border-subtle p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
                                Customer
                            </p>
                            <p className="text-sm font-medium text-strong">{detail.customerName}</p>
                            <p className="text-sm text-secondary">{detail.customerEmail}</p>
                            <p className="text-sm text-secondary mt-1">{detail.address}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
                                Items
                            </p>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-solid border-subtle-t">
                                    {detail.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-2 text-strong">{item.title}</td>
                                            <td className="py-2 text-muted text-right">
                                                {item.qty} × {formatPrice(item.price)}
                                            </td>
                                            <td className="py-2 text-strong font-medium text-right">
                                                {formatPrice(item.qty * item.price)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="py-2.5 text-sm font-semibold text-secondary text-right"
                                        >
                                            Total
                                        </td>
                                        <td className="py-2.5 font-bold text-strong text-right">
                                            {formatPrice(detail.total)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor={`od-status-${detail.id}`}
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
                            >
                                Update Status
                            </label>
                            <select
                                id={`od-status-${detail.id}`}
                                value={detail.status}
                                onChange={(e) => changeStatus(detail.id, e.target.value)}
                                className="glass-field px-3.5 py-2.5 text-sm"
                            >
                                {ORDER_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Orders;