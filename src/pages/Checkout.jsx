import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Lock, Loader2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { auth } from "../firebase";
import { useCart, computeShipping } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { showError } from "../utils/toastUtils";

const Checkout = () => {
        const { items, clearCart, subtotal } = useCart();
    const shipping = computeShipping(subtotal);
    const tax = Math.round(subtotal * 0.05); // 5% tax (GST-style)
    const total = subtotal + shipping + tax;
    const navigate = useNavigate();

    const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
    const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u && !form.customerName && u.displayName) {
                setForm((prev) => ({ ...prev, customerName: u.displayName }));
            }
        });
        return () => unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (items.length === 0) {
        return (
            <div className="bg-color-background text-color-text">
                <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-24 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-highlight" />
                    <h1 className="mb-2 text-2xl font-bold">Nothing to check out</h1>
                    <p className="mb-8 opacity-70">Your cart is empty.</p>
                    <Link to="/products" className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold">
                        Browse Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    if (user === undefined) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center pt-24">
                <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-color-background text-color-text">
                <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-24 text-center">
                    <Lock className="mx-auto mb-4 h-14 w-14 text-highlight" />
                    <h1 className="mb-2 text-2xl font-bold">Sign in to checkout</h1>
                    <p className="mb-8 opacity-70">
                        Your cart is saved on this device and will be waiting after you sign in.
                    </p>
                    <Link to="/login" className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold">
                        Go to Login <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    const validate = () => {
        const next = {};
        if (form.customerName.trim().length < 2) next.customerName = "Please enter your full name.";
        const digits = form.phone.replace(/\D/g, "");
        if (digits.length < 8 || digits.length > 15) next.phone = "Enter a valid phone number (8-15 digits).";
        if (form.address.trim().length < 10) next.address = "Please enter a complete delivery address.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // Validation mirrors firestore.rules exactly - the rules remain the
    // authoritative gate even if this client is tampered with.
    const placeOrder = async (e) => {
        e.preventDefault();
        if (!validate() || submitting) return;
        setSubmitting(true);
        try {
            const order = await createOrder({
                userId: user.uid,
                customerEmail: user.email,
                customerName: form.customerName.trim(),
                status: "Processing",
                paymentMethod: "Cash on Delivery",
                items: items.map((i) => ({
                    productId: String(i.productId),
                    title: i.title,
                    price: Number(i.price),
                    qty: Number(i.qty),
                })),
                subtotal: Number(subtotal),
                tax: Number(tax),
                total: Number(total),
                phone: form.phone.trim(),
                address: form.address.trim(),
            });
            clearCart();
            navigate(`/order-success/${order.id}`);
        } catch (error) {
            console.error("Checkout failed:", error);
            showError("Could not place the order. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-color-background text-color-text">
            <div className="mx-auto max-w-screen-xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
                <h1 className="mb-2 text-3xl font-extrabold">Checkout</h1>
                <p className="mb-8 inline-flex items-center gap-2 text-sm opacity-70">
                    <Lock className="h-4 w-4 text-highlight" /> Cash on Delivery &mdash; pay when your order arrives.
                </p>

                <form onSubmit={placeOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3" noValidate>
                    {/* Delivery details */}
                    <div className="card-surface rounded-2xl border p-6 shadow-md lg:col-span-2">
                        <h2 className="mb-5 text-lg font-bold">Delivery Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-1 block text-sm font-semibold">Full Name</label>
                                <input
                                    id="name" type="text" value={form.customerName}
                                    onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                                    className="w-full rounded-xl border border-color-border bg-color-background px-4 py-2.5 text-sm outline-none focus:border-highlight"
                                    placeholder="Your full name"
                                />
                                {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Phone</label>
                                <input
                                    id="phone" type="tel" value={form.phone}
                                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    className="w-full rounded-xl border border-color-border bg-color-background px-4 py-2.5 text-sm outline-none focus:border-highlight"
                                    placeholder="10-digit mobile number"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>
                            <div>
                                <label htmlFor="address" className="mb-1 block text-sm font-semibold">Delivery Address</label>
                                <textarea
                                    id="address" rows={4} value={form.address}
                                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                    className="w-full rounded-xl border border-color-border bg-color-background px-4 py-2.5 text-sm outline-none focus:border-highlight"
                                    placeholder="House no, street, city, state, PIN"
                                />
                                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="card-surface sticky top-28 rounded-2xl border p-6 shadow-md">
                            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
                            <ul className="mb-4 space-y-2 text-sm">
                                {items.map((i) => (
                                    <li key={i.productId} className="flex justify-between gap-3">
                                        <span className="line-clamp-1 opacity-70">{i.title} × {i.qty}</span>
                                        <span className="shrink-0 font-semibold">₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
                                    </li>
                                ))}
                            </ul>
                            <dl className="space-y-2 border-t border-color-border pt-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="opacity-70">Subtotal</dt>
                                    <dd className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</dd>
                                </div>
                                                                <div className="flex justify-between">
                                    <dt className="opacity-70">Shipping</dt>
                                    <dd className="font-semibold">{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="opacity-70">Tax (5%)</dt>
                                    <dd className="font-semibold">₹{tax.toLocaleString("en-IN")}</dd>
                                </div>
                                <div className="flex justify-between border-t border-color-border pt-2 text-base">
                                    <dt className="font-bold">Total (COD)</dt>
                                    <dd className="font-extrabold text-highlight">₹{total.toLocaleString("en-IN")}</dd>
                                </div>
                            </dl>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                                {submitting ? "Placing Order..." : "Place Order"}
                            </button>
                            <p className="mt-3 text-center text-xs opacity-60">No online payment needed.</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;