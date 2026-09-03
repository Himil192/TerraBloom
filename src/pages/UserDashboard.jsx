import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Link } from "react-router-dom";
import {
    Package,
    Clock,
    ShoppingBag,
    Leaf,
    ArrowRight,
    Sparkles,
    BookOpen,
    LifeBuoy,
} from "lucide-react";

const UserDashboard = () => {
    const { isDark } = useTheme();
    const [recentOrders] = useState([
        { id: "ORD-1001", date: "Sep 1, 2026", total: "\u20B91,299", status: "Delivered" },
        { id: "ORD-1002", date: "Aug 28, 2026", total: "\u20B9750", status: "In Transit" },
        { id: "ORD-1003", date: "Aug 20, 2026", total: "\u20B9320", status: "Processing" },
    ]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const stats = [
        { label: "Total Orders", value: "3", icon: ShoppingBag },
        { label: "In Transit", value: "1", icon: Clock },
        { label: "Saved Items", value: "5", icon: Leaf },
        { label: "Reviews", value: "2", icon: Package },
    ];

    const quickActions = [
        { title: "Shop New Arrivals", desc: "Fresh eco-essentials for everyday living.", href: "/products", icon: Sparkles },
        { title: "Read the Journal", desc: "Tips and stories for a greener life.", href: "/blogs", icon: BookOpen },
        { title: "Get Support", desc: "Real humans reply within 24 hours.", href: "/contact-us", icon: LifeBuoy },
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
                        Welcome back, <span className="text-highlight">Eco Friend</span>
                    </h1>
                    <p className="opacity-80 max-w-xl">
                        Track your orders, manage your profile, and continue your sustainable journey.
                    </p>
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
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-color-border first:border-t-0">
                                            <td className="px-4 sm:px-6 py-4 font-semibold">{order.id}</td>
                                            <td className="px-4 sm:px-6 py-4 opacity-80">{order.date}</td>
                                            <td className="px-4 sm:px-6 py-4 font-medium">{order.total}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusPill(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
            <section className="pb-20">
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
