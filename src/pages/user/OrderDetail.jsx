import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
    ArrowLeft,
    BadgeCheck,
    Check,
    CheckCircle2,
    Eye,
    Loader2,
    MapPin,
    Package,
    PenLine,
    Phone,
    ShoppingCart,
    Trash2,
    Truck,
    X,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { getOrderById, normalizeOrder } from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import { getReviews, deleteReview } from "../../services/reviewService";
import { useCart, computeShipping } from "../../context/CartContext";
import { showSuccess, showError } from "../../utils/toastUtils";
import { formatDate } from "../../utils/dateUtils";
import formatPrice from "../../utils/formatPrice";
import { orderStatusPill } from "../../utils/orderStatus";
import OrderReviewForm from "../../component/user/OrderReviewForm";

const STATUS_STEPS = [
    { key: "Processing", label: "Order received & confirmed", icon: Package },
    { key: "In Transit", label: "On its way to you", icon: Truck },
    { key: "Delivered", label: "Delivered - enjoy it! 🌱", icon: CheckCircle2 },
];

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("Eco Shopper");
    const [products, setProducts] = useState([]);
    const [reviewsByProduct, setReviewsByProduct] = useState({});
    const [reviewTarget, setReviewTarget] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    // Identify the signed-in user + display name (needed when writing reviews).
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                return;
            }
            setUser(currentUser);
            let name =
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "Eco Shopper";
            try {
                const snap = await getDoc(doc(db, "users", currentUser.uid));
                const data = snap.exists() ? snap.data() : {};
                if (data.fullName) name = data.fullName;
            } catch {
                /* keep the fallback name */
            }
            setUserName(name);
        });
        return () => unsubscribe();
    }, []);

    // Load the order only once we know the user - the server rules already
    // forbid reading another user's order, and we double check client-side so
    // a foreign id can never render.
    useEffect(() => {
        if (!user) return undefined;
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setOrder(null);
            setNotFound(false);
            try {
                const data = await getOrderById(orderId);
                if (cancelled) return;
                const normalized = data ? normalizeOrder(data) : null;
                if (!normalized || String(normalized.userId) !== String(user.uid)) {
                    setNotFound(true);
                    return;
                }
                setOrder(normalized);
            } catch (error) {
                console.error("Failed to load order:", error);
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [user, orderId]);

    // Catalog (thumbnails + buy-again) and each item's reviews (review state).
    useEffect(() => {
        if (!order) return undefined;
        let cancelled = false;
        const load = async () => {
            try {
                const all = await getAllProducts();
                if (!cancelled) setProducts(all);
            } catch {
                /* thumbnails are a nice-to-have */
            }
            const uniqueIds = [
                ...new Set(
                    (order.items || [])
                        .map((i) => String(i.productId))
                        .filter(Boolean)
                ),
            ];
            const entries = await Promise.all(
                uniqueIds.map(async (pid) => {
                    try {
                        return [pid, await getReviews(pid)];
                    } catch {
                        return [pid, []];
                    }
                })
            );
            if (!cancelled) setReviewsByProduct(Object.fromEntries(entries));
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [order]);

    const productById = new Map(products.map((p) => [String(p.id), p]));

    const subtotal =
        order?.subtotal !== undefined
            ? Number(order.subtotal)
            : (order?.items || []).reduce(
                  (sum, i) => sum + Number(i.price || 0) * Number(i.qty || 0),
                  0
              );
    const tax =
        order?.tax !== undefined ? Number(order.tax) : Math.round(subtotal * 0.05);
    const shipping =
        order?.total !== undefined
            ? Math.max(0, Number(order.total) - subtotal - tax)
            : computeShipping(subtotal);
    const total =
        order?.total !== undefined ? Number(order.total) : subtotal + shipping + tax;

    const isCancelled = order?.status === "Cancelled";
    const currentIndex = STATUS_STEPS.findIndex(
        (s) => s.key === order?.status
    );
    const itemCount = (order?.items || []).reduce(
        (n, i) => n + Number(i.qty || 0),
        0
    );

    const refreshReviews = async (productId) => {
        const pid = String(productId);
        try {
            const rows = await getReviews(pid);
            setReviewsByProduct((prev) => ({ ...prev, [pid]: rows }));
        } catch {
            /* keep current */
        }
    };

    const buyAgain = (product, qty) => {
        addItem(product, Number(qty) || 1);
        showSuccess(`${product.title} added to your cart`);
    };

    const reorderAll = () => {
        let added = 0;
        let skipped = 0;
        (order?.items || []).forEach((item) => {
            const product = productById.get(String(item.productId));
            if (product) {
                addItem(product, Number(item.qty) || 1);
                added += 1;
            } else {
                skipped += 1;
            }
        });
        if (added) {
            showSuccess(
                `${added} item${added > 1 ? "s" : ""} added to your cart`
            );
            navigate("/cart");
        }
        if (skipped) {
            showError(
                `${skipped} product${skipped > 1 ? "s were" : " was"} no longer available`
            );
        }
    };

    const removeReview = async (productId) => {
        const pid = String(productId);
        setRemovingId(pid);
        try {
            const myReview = (reviewsByProduct[pid] || []).find(
                (r) => r.uid === user?.uid
            );
            if (myReview) await deleteReview(pid, myReview.id);
            await refreshReviews(pid);
            showSuccess("Review deleted.");
        } catch {
            showError("Could not delete your review. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    const handleReviewSaved = async (productId) => {
        setReviewTarget(null);
        if (productId) await refreshReviews(productId);
    };

    const reviewTargetProduct = reviewTarget
        ? { id: reviewTarget.productId, title: reviewTarget.title }
        : null;
    const reviewTargetExisting = reviewTarget
        ? (reviewsByProduct[reviewTarget.productId] || []).find(
              (r) => r.uid === user?.uid
          )
        : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
            </div>
        );
    }

    if (notFound || !order) {
        return (
            <div className="glass-strong rounded-2xl border border-subtle px-6 py-16 text-center">
                <Package className="w-10 h-10 mx-auto text-muted" />
                <p className="mt-3 mb-1 font-semibold text-strong">
                    Order not found
                </p>
                <p className="text-sm text-muted mb-6">
                    This order doesn't exist or isn't linked to your account.
                </p>
                <Link
                    to="/user-dashboard/orders"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to My Orders
                </Link>
            </div>
        );
    }

    const orderNumber =
        order.orderNumber || String(orderId).slice(0, 8).toUpperCase();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Link
                        to="/user-dashboard/orders"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-[var(--primary-color)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> My Orders
                    </Link>
                    <h2 className="mt-2 text-2xl font-bold text-strong">
                        Order #{orderNumber}
                    </h2>
                    <p className="text-sm text-muted mt-1">
                        Placed on {formatDate(order.createdAt)} · {itemCount} item
                        {itemCount === 1 ? "" : "s"}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${orderStatusPill(order.status)}`}
                    >
                        {order.status}
                    </span>
                    <button
                        onClick={reorderAll}
                        className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
                    >
                        <ShoppingCart className="h-3.5 w-3.5" /> Reorder All
                    </button>
                </div>
            </div>

            {isCancelled && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                    <X className="h-4 w-4 shrink-0" /> This order was cancelled.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Status timeline */}
                    <div className="glass-strong rounded-2xl border border-subtle p-5">
                        <h3 className="font-bold text-strong mb-5">Order Status</h3>
                        <ol className="space-y-6">
                            {STATUS_STEPS.map((step, i) => {
                                const doneCount = isCancelled
                                    ? 0
                                    : Math.max(0, currentIndex);
                                const done = i < doneCount;
                                const current = !isCancelled && i === doneCount;
                                return (
                                    <li key={step.key} className="flex items-center gap-3">
                                        <span
                                            className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                                                done || current
                                                    ? "bg-[var(--primary-color)] text-white"
                                                    : "bg-[var(--glass-highlight)] text-muted"
                                            } ${current ? "ring-2 ring-[var(--primary-color)]" : ""}`}
                                        >
                                            {done ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <step.icon className="h-4 w-4" />
                                            )}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-strong">
                                                {step.key}
                                            </p>
                                            <p className="text-xs text-muted">{step.label}</p>
                                        </div>
                                        {current && (
                                            <span className="ml-auto text-xs font-semibold text-[var(--primary-color)]">
                                                In progress
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="text-lg font-bold text-strong mb-4">Items</h3>
                        <ul className="space-y-4">
                            {(order.items || []).map((item, idx) => {
                                const pid = String(item.productId);
                                const product = productById.get(pid);
                                const myReview = (reviewsByProduct[pid] || []).find(
                                    (r) => r.uid === user?.uid
                                );
                                return (
                                    <li
                                        key={pid || idx}
                                        className="card-surface rounded-2xl border p-5"
                                    >
                                        <div className="flex items-start gap-4">
                                            {product?.image ? (
                                                <img
                                                    alt={item.title}
                                                    src={product.image}
                                                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-[var(--glass-border)] shrink-0"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-[var(--glass-highlight)] shrink-0">
                                                    <Package className="h-7 w-7 text-muted" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                {product ? (
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="font-semibold text-strong hover:underline"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ) : (
                                                    <span className="font-semibold text-strong">
                                                        {item.title}
                                                    </span>
                                                )}
                                                <p className="text-sm text-secondary">
                                                    {item.qty} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-strong shrink-0">
                                                {formatPrice(
                                                    Number(item.qty) * Number(item.price)
                                                )}
                                            </p>
                                        </div>

                                        {/* Per-item actions */}
                                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-subtle pt-4">
                                            {product && (
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> View Product
                                                </Link>
                                            )}
                                            {product && (
                                                <button
                                                    onClick={() => buyAgain(product, item.qty)}
                                                    className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                                                >
                                                    <ShoppingCart className="h-3.5 w-3.5" /> Buy Again
                                                </button>
                                            )}
                                            {!isCancelled && order.status === "Delivered" ? (
                                                myReview ? (
                                                    <>
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                                                            <BadgeCheck className="h-3.5 w-3.5" />
                                                            Reviewed {Math.round(Number(myReview.rating) || 0)}/5
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                setReviewTarget({
                                                                    productId: pid,
                                                                    title: item.title,
                                                                })
                                                            }
                                                            className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                                                        >
                                                            <PenLine className="h-3.5 w-3.5" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => removeReview(pid)}
                                                            disabled={removingId === pid}
                                                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-[#B3261E]/10 transition-colors disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            {removingId === pid ? "Removing..." : "Delete"}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            setReviewTarget({
                                                                productId: pid,
                                                                title: item.title,
                                                            })
                                                        }
                                                        className="btn-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                                                    >
                                                        <PenLine className="h-3.5 w-3.5" /> Write a Review
                                                    </button>
                                                )
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                                                    <PenLine className="h-3.5 w-3.5" />
                                                    {isCancelled
                                                        ? "Order cancelled"
                                                        : "Reviews open once delivered"}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Right rail: summary + delivery */}
                <div className="space-y-6">
                    {/* Order summary */}
                    <div className="glass-strong rounded-2xl border border-subtle p-5">
                        <h3 className="font-bold text-strong mb-4">Order Summary</h3>
                        <dl className="space-y-2.5 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted">Subtotal</dt>
                                <dd className="font-medium text-strong">{formatPrice(subtotal)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">Shipping</dt>
                                <dd className="font-medium text-strong">
                                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted">Tax</dt>
                                <dd className="font-medium text-strong">{formatPrice(tax)}</dd>
                            </div>
                            <div className="flex justify-between border-t border-subtle pt-3">
                                <dt className="font-bold text-strong">Total</dt>
                                <dd className="font-extrabold text-[var(--primary-color)]">
                                    {formatPrice(total)}
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--glass-highlight)] px-3 py-1 text-xs font-semibold text-secondary">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--primary-color)]" />
                            {order.paymentMethod || "Cash on Delivery"}
                        </p>
                    </div>

                    {/* Delivery */}
                    <div className="glass-strong rounded-2xl border border-subtle p-5">
                        <h3 className="font-bold text-strong mb-4">Delivery</h3>
                        <p className="font-semibold text-strong">{order.customerName}</p>
                        {order.address && (
                            <p className="mt-2 flex items-start gap-2 text-sm text-secondary">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--primary-color)]" />
                                <span>{order.address}</span>
                            </p>
                        )}
                        {order.phone && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-secondary">
                                <Phone className="w-4 h-4 shrink-0 text-[var(--primary-color)]" />
                                {order.phone}
                            </p>
                        )}
                        {order.customerEmail && (
                            <p className="mt-2 text-sm text-muted">{order.customerEmail}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Review modal */}
            {reviewTarget && user && (
                <OrderReviewForm
                    product={reviewTargetProduct}
                    existingReview={reviewTargetExisting}
                    uid={user.uid}
                    userName={userName}
                    verified
                    onClose={() => setReviewTarget(null)}
                    onSaved={handleReviewSaved}
                />
            )}
        </div>
    );
}

export default OrderDetail;