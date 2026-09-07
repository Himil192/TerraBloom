import { useEffect, useState } from "react";
import {
    ShoppingCart,
    Search,
    Eye,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import {
    getAllOrders,
    updateOrderStatus,
} from "../../services/orderService";
import { showError, showSuccess } from "../../utils/toastUtils";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const ORDER_STATUSES = ["Processing", "In Transit", "Delivered", "Cancelled"];

const statusPill = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800";
        case "In Transit":
            return "bg-blue-100 text-blue-800";
        case "Processing":
            return "bg-yellow-100 text-yellow-800";
        case "Cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-600";
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
                if (!cancelled) setOrders(list);
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
            setOrders(await getAllOrders());
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
            order.id.toLowerCase().includes(needle) ||
            order.customer.toLowerCase().includes(needle);
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
                    <h3 className="text-lg font-semibold text-gray-900">
                        All Orders ({orders.length})
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Track and update orders from your storefront.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by order ID or customer..."
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20 sm:w-48"
                >
                    <option value="all">All statuses</option>
                    {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#4A9B4B]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                        <ShoppingCart className="w-10 h-10 mx-auto text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {orders.length === 0
                                ? "No orders yet."
                                : "No orders match your filters."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-5 py-3.5">Order</th>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Items</th>
                                <th className="px-5 py-3.5 text-right">Total</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                                        #{order.id}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-gray-900 font-medium">{order.customer}</p>
                                        <p className="text-xs text-gray-500">{order.email}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {order.date}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {order.items.reduce((sum, i) => sum + i.qty, 0)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                                        {formatPrice(order.total)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <select
                                            value={order.status}
                                            onChange={(e) => changeStatus(order.id, e.target.value)}
                                            className={`rounded-full text-xs font-semibold border-0 bg-transparent pr-7 py-1 pl-2.5 ${statusPill(
                                                order.status
                                            )} focus:outline-none focus:ring-1 focus:ring-[#4A9B4B] cursor-pointer`}
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
                                            className="p-2 rounded-lg text-gray-500 hover:bg-[#4A9B4B]/10 hover:text-[#2F6A30] transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Order #{detail.id}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {detail.date} · {detail.payment}
                                </p>
                            </div>
                            <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(
                                    detail.status
                                )}`}
                            >
                                {detail.status}
                            </span>
                        </div>

                        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                                Customer
                            </p>
                            <p className="text-sm font-medium text-gray-900">{detail.customer}</p>
                            <p className="text-sm text-gray-600">{detail.email}</p>
                            <p className="text-sm text-gray-600 mt-1">{detail.address}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                                Items
                            </p>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">
                                    {detail.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-2 text-gray-800">{item.title}</td>
                                            <td className="py-2 text-gray-500 text-right">
                                                {item.qty} × {formatPrice(item.price)}
                                            </td>
                                            <td className="py-2 text-gray-800 font-medium text-right">
                                                {formatPrice(item.qty * item.price)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="py-2.5 text-sm font-semibold text-gray-700 text-right"
                                        >
                                            Total
                                        </td>
                                        <td className="py-2.5 font-bold text-gray-900 text-right">
                                            {formatPrice(detail.total)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor={`od-status-${detail.id}`}
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                Update Status
                            </label>
                            <select
                                id={`od-status-${detail.id}`}
                                value={detail.status}
                                onChange={(e) => changeStatus(detail.id, e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20"
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