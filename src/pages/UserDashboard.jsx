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
            ? "bg-green-100 text-green-800"
            : status === "In Transit"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800";

    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#4A9B4B]/15 blur-3xl pointer-events-none"></div>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest btn-secondary px-4 py-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Your Eco Hub
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                        {isNewMember ? "Welcome to TerraBloom," : "Welcome back,"}{" "}
                        <span className="text-highlight">{firstName}</span>
                    </h1>
                    <p className="opacity-80 max-w-xl">
                        Track your orders, manage your profile, and continue your sustainable journey.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link
                            to="/wishlist"
                            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                        >
                            <Heart className="h-3.5 w-3.5 text-highlight" />
                            Wishlist ({wishlistItems.length})
                        </Link>
                        {memberSince && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-color-border px-3 py-1 text-xs font-semibold opacity-80">
                                <CalendarDays className="h-3.5 w-3.5 text-highlight" />
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
            <section className="pb-12">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="card-surface flex items-center gap-4 rounded-2xl border border-color-border shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#4A9B4B]/10 flex items-center justify-center shrink-0">
                                    <stat.icon className="w-5 h-5 text-highlight" />
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold leading-none">{stat.value}</p>
                                    <p className="text-sm opacity-70 mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent orders */}
            <section className="pb-12">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <h2 className="text-2xl font-bold">Recent Orders</h2>
                        <Link
                            to="/products"
                            className="text-sm font-semibold text-highlight inline-flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Continue Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="card-surface rounded-2xl border border-color-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#4A9B4B]/5">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">Order</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">Date</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">Total</th>
                                        <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders === null ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 sm:px-6 py-10 text-center">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-highlight" />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 sm:px-6 py-10 text-center">
                                                <Package className="mx-auto mb-2 h-8 w-8 text-highlight" />
                                                <p className="mb-4 opacity-70">
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
                                            <tr key={order.id} className="border-t border-color-border first:border-t-0">
                                                <td className="px-4 sm:px-6 py-4 font-semibold">
                                                    {String(order.id).slice(0, 8).toUpperCase()}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 opacity-80">{fmtDate(order.createdAt)}</td>
                                                <td className="px-4 sm:px-6 py-4 font-medium">
                                                    ₹{(Number(order.total) || 0).toLocaleString("en-IN")}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(order.status)}`}>
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
            <section className="pb-12">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                to={action.href}
                                className="card-surface group rounded-2xl border border-color-border shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#4A9B4B]/10 flex items-center justify-center mb-4">
                                    <action.icon className="w-5 h-5 text-highlight" />
                                </div>
                                <h3 className="font-bold mb-1">{action.title}</h3>
                                <p className="text-sm opacity-70 mb-4">{action.desc}</p>
                                <span className="text-sm font-semibold text-highlight inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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
                        <p className="opacity-90 max-w-lg mx-auto mb-6">
                            New planet-friendly arrivals land every week.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-white text-[#2F6A30] font-semibold px-6 py-3 rounded-full hover:bg-[#E6FAEB] transition-colors"
                        >
                            Browse Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;
