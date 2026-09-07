import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart, computeShipping } from "../context/CartContext";

const Cart = () => {
    const { items, removeItem, setQty, clearCart, subtotal, count } = useCart();
    const shipping = computeShipping(subtotal);
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="bg-color-background text-color-text">
                <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-24 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-highlight" />
                    <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
                    <p className="mb-8 opacity-70">Add some eco-goodness to get started.</p>
                    <Link
                        to="/products"
                        className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                    >
                        Browse Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-color-background text-color-text">
            <div className="mx-auto max-w-screen-xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-3xl font-extrabold">
                        Your Cart{" "}
                        <span className="text-lg font-medium opacity-60">
                            ({count} item{count === 1 ? "" : "s"})
                        </span>
                    </h1>
                    <button
                        type="button"
                        onClick={clearCart}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
                    >
                        <Trash2 className="h-4 w-4" /> Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Items */}
                    <div className="space-y-4 lg:col-span-2">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="card-surface flex items-center gap-4 rounded-2xl border p-4 shadow-sm"
                            >
                                <Link to={`/products/${item.productId}`} className="shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-20 w-20 rounded-xl object-cover"
                                    />
                                </Link>
                                <div className="min-w-0 flex-grow">
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="line-clamp-1 font-semibold hover:text-highlight"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="mt-0.5 text-sm opacity-70">
                                        ₹{item.price.toLocaleString("en-IN")} each
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setQty(item.productId, item.qty - 1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-color-border hover:bg-color-background"
                                            aria-label={`Decrease quantity of ${item.title}`}
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQty(item.productId, item.qty + 1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-color-border hover:bg-color-background"
                                            aria-label={`Increase quantity of ${item.title}`}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p className="font-bold text-highlight">
                                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.productId)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="card-surface sticky top-28 rounded-2xl border p-6 shadow-md">
                            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="opacity-70">Subtotal</dt>
                                    <dd className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="opacity-70">Shipping</dt>
                                    <dd className="font-semibold">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `₹${shipping}`
                                        )}
                                    </dd>
                                </div>
                                <div className="mt-3 flex justify-between border-t border-color-border pt-3 text-base">
                                    <dt className="font-bold">Total</dt>
                                    <dd className="font-extrabold text-highlight">
                                        ₹{total.toLocaleString("en-IN")}
                                    </dd>
                                </div>
                            </dl>
                            {shipping > 0 && (
                                <p className="mt-3 rounded-xl bg-color-background p-3 text-xs opacity-70">
                                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free shipping.
                                </p>
                            )}
                            <Link
                                to="/checkout"
                                className="btn-primary mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                            >
                                Proceed to Checkout <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/products"
                                className="mt-3 block text-center text-sm font-semibold text-highlight hover:underline"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;