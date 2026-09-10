import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

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

/**
 * Shared order preview card - used by the Overview ("recent orders") and the
 * My Orders list. Links straight to /user-dashboard/orders/:id where the user
 * can view the full breakdown, reorder and leave reviews.
 *
 * @param {object} order        normalized order (see orderService.normalizeOrder)
 * @param {Map|null} productById id(String) -> live product doc, for thumbnails
 */
const OrderCard = ({ order, productById }) => {
    const orderNumber =
        order.orderNumber || String(order.id).slice(0, 8).toUpperCase();
    const items = order.items || [];
    const itemCount = items.reduce((n, i) => n + Number(i.qty || 0), 0);
    const firstItem = items[0];
    const firstProduct = firstItem
        ? productById?.get(String(firstItem.productId))
        : null;

    return (
        <Link
            to={`/user-dashboard/orders/${order.id}`}
            className="glass group rounded-2xl border border-subtle shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-strong">#{orderNumber}</span>
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(order.status)}`}
                >
                    {order.status}
                </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
                {firstProduct?.image ? (
                    <img
                        alt={firstItem.title}
                        src={firstProduct.image}
                        className="h-12 w-12 rounded-lg object-cover ring-2 ring-[var(--glass-border)]"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--glass-highlight)] ring-2 ring-[var(--glass-border)] shrink-0">
                        <Package className="h-6 w-6 text-muted" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-strong truncate">
                        {firstItem?.title || "Order"}
                        {items.length > 1 && (
                            <span className="text-muted"> +{items.length - 1} more</span>
                        )}
                    </p>
                    <p className="text-sm text-muted truncate">
                        {formatDate(order.createdAt)} · {itemCount} item
                        {itemCount === 1 ? "" : "s"}
                    </p>
                </div>

                <p className="font-bold text-strong shrink-0">
                    {formatPrice(order.total)}
                </p>
            </div>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-color)] group-hover:gap-2 transition-all">
                View details <ArrowRight className="w-4 h-4" />
            </span>
        </Link>
    );
};

export default OrderCard;