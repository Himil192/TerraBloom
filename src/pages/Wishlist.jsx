import { Link } from "react-router-dom";
import { HeartOff, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
    const { items, remove, clear } = useWishlist();
    const { addItem } = useCart();

    const moveToCart = (item) => {
        // Snapshot -> cart: cart re-verifies price/stock against Firestore at
        // checkout, so this snapshot is convenience only (never trusted).
        addItem({ id: item.productId, title: item.title, price: item.price, image: item.image });
        remove(item.productId);
    };

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-screen-xl px-4 pb-20 pt-32 text-center text-color-text">
                <HeartOff className="mx-auto mb-4 h-12 w-12 text-highlight" />
                <h1 className="mb-2 text-2xl font-bold">Your wishlist is empty</h1>
                <p className="mb-8 opacity-70">
                    Tap the heart on any product to save it here for later.
                </p>
                <Link
                    to="/products"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                    <ShoppingBag className="h-4 w-4" /> Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-color-background pb-20 pt-28 text-color-text">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold">My Wishlist</h1>
                        <p className="mt-1 text-sm opacity-70">
                            {items.length} saved {items.length === 1 ? "item" : "items"} · synced to your
                            account when signed in
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={clear}
                        className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Clear all
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="card-surface flex gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
                        >
                            <Link
                                to={`/products/${item.productId}`}
                                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </Link>
                            <div className="flex min-w-0 flex-grow flex-col justify-between">
                                <div>
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="line-clamp-2 font-semibold hover:text-highlight"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="mt-1 font-bold text-highlight">
                                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => moveToCart(item)}
                                        className="btn-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                                    >
                                        <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove(item.productId)}
                                        aria-label={`Remove ${item.title} from wishlist`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-color-border px-3 py-1.5 text-xs font-semibold opacity-70 transition hover:opacity-100"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
