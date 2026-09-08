import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, Loader2, ArrowRight, Home } from "lucide-react";
import { getOrderById } from "../services/orderService";

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const data = await getOrderById(orderId);
                if (!cancelled) setOrder(data);
            } catch {
                if (!cancelled) setOrder(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center pt-24">
                <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            </div>
        );
    }

    return (
        <div className="bg-color-background text-color-text">
            <div className="mx-auto max-w-2xl px-4 pt-32 pb-24 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="mb-2 text-3xl font-extrabold">Order Placed! 🌱</h1>
                <p className="mb-8 opacity-70">
                    Thank you for choosing sustainable. We&apos;ll reach out shortly to confirm your delivery.
                </p>

                <div className="card-surface rounded-2xl border p-6 text-left shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-bold">
                            <Package className="h-4 w-4 text-highlight" /> Order
                        </span>
                        <span className="rounded-full bg-color-background px-3 py-1 font-mono text-xs">
                            {order ? (order.orderNumber || orderId) : orderId}
                        </span>
                    </div>

                    {order ? (
                        <>
                            <ul className="mb-4 divide-y divide-color-border">
                                {(order.items || []).map((item, i) => (
                                    <li key={item.productId || i} className="flex justify-between py-2 text-sm">
                                        <span className="line-clamp-1 pr-3 opacity-80">
                                            {item.title} × {item.qty}
                                        </span>
                                        <span className="shrink-0 font-semibold">
                                            ₹{((item.price || 0) * (item.qty || 0)).toLocaleString("en-IN")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between border-t border-color-border pt-3">
                                <span className="font-bold">Total (COD)</span>
                                <span className="font-extrabold text-highlight">
                                    ₹{(order.total || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                            {order.address && (
                                <p className="mt-4 text-xs opacity-60">
                                    Delivering to: {order.address}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-sm opacity-70">
                            Your order has been received. Sign in with the same account to track it from your dashboard.
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        to="/user-dashboard"
                        className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                    >
                        Track My Orders <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        to="/"
                        className="btn-secondary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                    >
                        <Home className="h-4 w-4" /> Back to Store
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;