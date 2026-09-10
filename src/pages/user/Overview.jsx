import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
    ArrowRight,
    BookOpen,
    Heart,
    Leaf,
    LifeBuoy,
    Loader2,
    Package,
    Recycle,
    ShoppingBag,
    Sparkles,
    Truck,
    UserCog,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { getOrdersByUser, normalizeOrder } from "../../services/orderService";
import { getAllProducts } from "../../services/productService";
import { useWishlist } from "../../context/WishlistContext";
import { formatDate, toJsDate } from "../../utils/dateUtils";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import OrderCard from "../../component/user/OrderCard";
import formatPrice from "../../utils/formatPrice";

const Overview = () => {
    const { items: wishlistItems } = useWishlist();
    // Real orders from Firestore - scoped server-side to the signed-in user
    // (firestore.rules: orders read requires userId == auth.uid).
    const [orders, setOrders] = useState(null); // null = loading
    const [loadError, setLoadError] = useState(false);
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let cancelled = false;
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                if (!cancelled) {
                    setOrders([]);
                    setProfile(null);
                }
                return;
            }
            try {
                // Own profile doc - firestore.rules allow reading only your own
                // user document, so this can never expose another member's data.
                const profileSnap = await getDoc(doc(db, "users", user.uid));
                if (!cancelled) {
                    setProfile(profileSnap.exists() ? profileSnap.data() : null);
                }
                const rows = await getOrdersByUser(user.uid);
                if (!cancelled) setOrders(rows.map(normalizeOrder));
            } catch (error) {
                console.error("Error loading orders:", error);
                if (!cancelled) {
                    setOrders([]);
                    setLoadError(true);
                }
            }
        });
        return () => {
            cancelled = true;
            unsub();
        };
    }, []);

    // Live product catalog - powers the order card thumbnails.
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

    const createdAt = toJsDate(profile?.createdAt);
    const firstName =
        (profile?.fullName || "").trim().split(/\s+/)[0] ||
        (profile?.email || "").split("@")[0] ||
        "Eco Friend";
    const isNewMember =
        Boolean(createdAt) &&
        Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

    const totalSpent = (orders || []).reduce(
        (sum, o) => sum + (o.status === "Cancelled" ? 0 : Number(o.total) || 0),
        0
    );

    const stats = [
        { label: "Total Orders", value: orders ? String(orders.length) : "…", icon: ShoppingBag },
        { label: "In Transit", value: orders ? String(orders.filter((o) => o.status === "In Transit").length) : "…", icon: Truck },
        { label: "Delivered", value: orders ? String(orders.filter((o) => o.status === "Delivered").length) : "…", icon: Leaf },
        { label: "Total Spent", value: orders ? formatPrice(totalSpent) : "…", icon: Package },
        { label: "Trees Funded", value: orders ? (Math.floor(totalSpent / 500) || 0).toLocaleString("en-IN") : "…", icon: Recycle },
    ];

    const quickActions = [
        { title: "Shop New Arrivals", desc: "Fresh eco-essentials for everyday living.", href: "/products", icon: Sparkles },
        { title: "Read the Journal", desc: "Tips and stories for a greener life.", href: "/blogs", icon: BookOpen },
        { title: "Get Support", desc: "Real humans reply within 24 hours.", href: "/contact-us", icon: LifeBuoy },
        { title: "Manage Profile", desc: "Update your name, phone and address.", href: "/user-dashboard/profile", icon: UserCog },
    ];

    const recentOrders = orders === null ? [] : orders.slice(0, 3);

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Overview" />

            {/* Welcome hero */}
            <section className="relative overflow-hidden rounded-3xl glass-strong border border-subtle p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-strong">
                            {isNewMember ? "Welcome to TerraBloom," : "Welcome back,"}{" "}
                            <span className="text-[var(--primary-color)]">{firstName}</span>
                        </h1>
                        <p className="text-secondary mt-1 max-w-xl">
                            Track your orders, leave reviews, and keep making eco-friendly swaps.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/wishlist"
                            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                        >
                            <Heart className="h-3.5 w-3.5 text-[var(--primary-color)]" />
                            Wishlist ({wishlistItems.length})
                        </Link>
                        {createdAt && (
                            <span className="glass inline-flex items-center gap-1.5 rounded-full border border-subtle px-3 py-1 text-xs font-semibold text-secondary">
                                Member since{" "}
                                {formatDate(profile.createdAt, { month: "short", year: "numeric" })}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="glass flex items-center gap-4 rounded-2xl border border-subtle shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                                <stat.icon className="w-5 h-5 text-[var(--primary-color)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-extrabold leading-none text-strong">{stat.value}</p>
                                <p className="text-sm text-muted mt-1 truncate">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent orders */}
            <section>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-strong">Recent Orders</h2>
                    <Link
                        to="/user-dashboard/orders"
                        className="text-sm font-semibold text-[var(--primary-color)] inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View all orders <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {orders === null ? (
                    <div className="glass-strong rounded-2xl border border-subtle p-10 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--primary-color)]" />
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="glass-strong rounded-2xl border border-subtle p-10 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted" />
                        <p className="mb-1 font-semibold text-strong">
                            {loadError
                                ? "Couldn't load your orders."
                                : "No orders yet - your eco journey starts with the first one!"}
                        </p>
                        <p className="text-sm text-muted mb-5">
                            {loadError
                                ? "Please try again in a moment."
                                : "When you shop, your orders will show up here."}
                        </p>
                        <Link
                            to="/products"
                            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
                        >
                            Shop Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {recentOrders.map((order) => (
                            <OrderCard key={order.id} order={order} productById={productById} />
                        ))}
                    </div>
                )}
            </section>

            {/* Quick actions */}
            <section>
                <h2 className="text-xl font-bold text-strong mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            to={action.href}
                            className="glass group rounded-2xl border border-subtle shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center mb-4">
                                <action.icon className="w-5 h-5 text-[var(--primary-color)]" />
                            </div>
                            <h3 className="font-bold text-strong mb-1">{action.title}</h3>
                            <p className="text-sm text-muted mb-4">{action.desc}</p>
                            <span className="text-sm font-semibold text-[var(--primary-color)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                Go <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA band */}
            <section className="pt-2">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A9B4B] to-[#88B73B] text-white p-8 sm:p-10 text-center">
                    <Leaf className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12 pointer-events-none" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                        Ready for your next eco-swap?
                    </h2>
                    <p className="text-white/90 max-w-lg mx-auto mb-6">
                        New planet-friendly arrivals land every week.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 btn-glass-light font-semibold"
                    >
                        Browse Products <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Overview;