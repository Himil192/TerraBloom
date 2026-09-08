import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getOrdersByUser } from "../services/orderService";
import { useWishlist } from "../context/WishlistContext";
import {
    Heart,
    Package,
    Clock,
    ShoppingBag,
    Leaf,
    ArrowRight,
    Sparkles,
    BookOpen,
    LifeBuoy,
    Loader2,
    UserCog,
    CalendarDays,
} from "lucide-react";

const UserDashboard = () => {
    const { isDark } = useTheme();
    const { items: wishlistItems } = useWishlist();
    // Real orders from Firestore - scoped server-side to the signed-in user
    // (firestore.rules: orders read requires userId == auth.uid).
    const [orders, setOrders] = useState(null); // null = loading
    const [loadError, setLoadError] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

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
                if (!cancelled) setProfile(profileSnap.exists() ? profileSnap.data() : null);
                const rows = await getOrdersByUser(user.uid);
                if (!cancelled) setOrders(rows);
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

    const fmtDate = (value) => {
        try {
            const d = value?.toDate?.() || (value ? new Date(value) : null);
            return d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
        } catch {
            return "—";
        }
    };

    const toJsDate = (value) => {
        try {
            return value?.toDate?.() || (value ? new Date(value) : null);
        } catch {
            return null;
        }
    };

    const memberSince = profile ? toJsDate(profile.createdAt) : null;
    const firstName =
        (profile?.fullName || "").trim().split(/\s+/)[0] ||
        (profile?.email || "").split("@")[0] ||
        "Eco Friend";
    const createdAt = memberSince ? toJsDate(profile.createdAt) : null;
    const isNewMember =
        Boolean(createdAt) &&
        Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

    const totalSpent = (orders || []).reduce(
        (sum, o) => sum + (o.status === "Cancelled" ? 0 : Number(o.total) || 0),
        0
    );

    const stats = [
        { label: "Total Orders", value: orders ? String(orders.length) : "…", icon: ShoppingBag },
        { label: "In Transit", value: orders ? String(orders.filter((o) => o.status === "In Transit").length) : "…", icon: Clock },
        { label: "Delivered", value: orders ? String(orders.filter((o) => o.status === "Delivered").length) : "…", icon: Leaf },
        { label: "Total Spent", value: orders ? `₹${totalSpent.toLocaleString("en-IN")}` : "…", icon: Package },
    ];

    const quickActions = [
        { title: "Shop New Arrivals", desc: "Fresh eco-essentials for everyday living.", href: "/products", icon: Sparkles },
        { title: "Read the Journal", desc: "Tips and stories for a greener life.", href: "/blogs", icon: BookOpen },
        { title: "Get Support", desc: "Real humans reply within 24 hours.", href: "/contact-us", icon: LifeBuoy },
        { title: "Manage Profile", desc: "Update your name, phone and address.", href: "/user-dashboard/profile", icon: UserCog },
    ];

    const statusPill = (status) =>
        status === "Delivered"
            ? "bg-green-100 text-green-800 border border-green-200"
            : status === "In Transit"
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "bg-yellow-100 text-yellow-800 border border-yellow-200";

    return (
        <div className="min-h-screen bg-dashboard text-strong relative overflow-hidden">
            {/* Decorative blurred shapes behind the glass panels */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#4A9B4B]/15 blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-[#FFB829]/10 blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-[#88B73B]/12 blur-3xl" />
            </div>
            <div className="relative">
            {/* Hero */}
            <section className="relative pt-24 pb-8 overflow-hidden">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest btn-secondary px-4 py-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Your Eco Hub
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-strong">
                        {isNewMember ? "Welcome to TerraBloom," : "Welcome back,"}{" "}
                        <span className="text-[var(--primary-color)]">{firstName}</span>
                    </h1>
                    <p className="text-secondary max-w-xl">
                        Track your orders, manage your profile, and continue your sustainable journey.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link
                            to="/wishlist"
                            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                        >
                            <Heart className="h-3.5 w-3.5 text-[var(--primary-color)]" />
                            Wishlist ({wishlistItems.length})
                        </Link>
                        {memberSince && (
                            <span className="glass inline-flex items-center gap-1.5 rounded-full border border-subtle px-3 py-1 text-xs font-semibold text-secondary">
                                <CalendarDays className="h-3.5 w-3.5 text-[var(--primary-color)]" />
                                Member since{" "}
                                {memberSince.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                            </span>
                        )}
                        <Link
                            to="/user-dashboard/profile"
                            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                        >
                            <UserCog className="h-3.5 w-3.5" /> Manage Profile
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                </div>
            </section>

            {/* Recent orders */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-strong">Recent Orders</h2>
                        <Link
                            to="/products"
                            className="text-sm font-semibold text-[var(--primary-color)] inline-flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Continue Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[640px] w-full text-sm">
                                <thead className="glass-th text-left text-xs font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3.5">Order</th>
                                        <th className="px-4 sm:px-6 py-3.5 hidden sm:table-cell">Date</th>
                                        <th className="px-4 sm:px-6 py-3.5">Total</th>
                                        <th className="px-4 sm:px-6 py-3.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders === null ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 sm:px-6 py-10 text-center">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--primary-color)]" />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 sm:px-6 py-10 text-center">
                                                <Package className="mx-auto mb-2 h-8 w-8 text-muted" />
                                                <p className="mb-4 text-secondary">
                                                    {loadError
                                                        ? "Couldn't load your orders right now."
                                                        : "No orders yet - your eco journey starts with the first one!"}
                                                </p>
                                                <Link
                                                    to="/products"
                                                    className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
                                                >
                                                    Shop Now <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="glass-tr border-t border-subtle first:border-t-0">
                                                <td className="px-4 sm:px-6 py-4 font-semibold text-strong">
                                                    {order.orderNumber || String(order.id).slice(0, 8).toUpperCase()}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-muted hidden sm:table-cell">{fmtDate(order.createdAt)}</td>
                                                <td className="px-4 sm:px-6 py-4 font-medium text-strong">
                                                    ₹{(Number(order.total) || 0).toLocaleString("en-IN")}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick actions */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-strong mb-6">Quick Actions</h2>
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
                </div>
            </section>

            {/* CTA band */}
            <section className="pt-8 pb-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A9B4B] to-[#88B73B] text-white p-8 sm:p-10 text-center">
                        <Leaf className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12 pointer-events-none" />
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Ready for your next eco-swap?</h2>
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
                </div>
            </section>
            </div>
        </div>
    );
};

export default UserDashboard;
