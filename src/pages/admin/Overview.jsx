import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    FileText,
    ShoppingBag,
    IndianRupee,
    Plus,
    PenLine,
    ArrowRight,
    Sparkles,
    Loader2,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { getAllProducts } from "../../services/productService";
import { getAllBlogs } from "../../services/blogService";
import { getAllOrders } from "../../services/orderService";
import { showError } from "../../utils/toastUtils";

const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// Sample sales figures until the storefront checkout sends live orders.
const salesSeries = {
    monthly: [42, 38, 55, 47, 62, 58, 71, 66, 82, 74, 90, 86],
    quarterly: [128, 156, 195, 182, 226, 249],
    annually: [512, 604, 719, 786, 842, 921, 998],
};

const rangeTabs = [
    { key: "monthly", label: "Monthly" },
    { key: "quarterly", label: "Quarterly" },
    { key: "annually", label: "Annually" },
];

const Overview = () => {
    const [range, setRange] = useState("monthly");
    const [products, setProducts] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [productList, blogList, orderList] = await Promise.all([
                    getAllProducts(),
                    getAllBlogs(),
                    getAllOrders(),
                ]);
                if (!cancelled) {
                    setProducts(productList);
                    setBlogs(blogList);
                    setOrders(orderList);
                }
            } catch (error) {
                console.error("Failed to load overview:", error);
                if (!cancelled) showError("Failed to load dashboard data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const recentProducts = products.slice(-6).reverse();
    const recentBlogs = blogs.slice(-5).reverse();
    const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

    const revenue = orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const stats = [
        { label: "Products", value: String(products.length), icon: Package, to: "/admin-dashboard/products" },
        { label: "Blog Posts", value: String(blogs.length), icon: FileText, to: "/admin-dashboard/blogs" },
        { label: "Orders", value: String(orders.length), icon: ShoppingBag, to: "/admin-dashboard/orders" },
        { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee, to: "/admin-dashboard/orders" },
    ];

    const catalogEmpty = products.length === 0 && blogs.length === 0;

    const series = salesSeries[range];
    const max = Math.max(...series);

    const quickActions = [
        { title: "Add Product", desc: "List a new eco product in your catalog.", to: "/admin-dashboard/products", icon: Plus },
        { title: "Write a Blog Post", desc: "Share a journal entry with your readers.", to: "/admin-dashboard/blogs", icon: PenLine },
    ];

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Overview" />

            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#4A9B4B]" />
                    </div>
                </div>
            ) : (
                <>
            {catalogEmpty && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-[#4A9B4B]/30 bg-[#4A9B4B]/5 p-4 sm:p-5">
                    <Package className="w-6 h-6 text-[#4A9B4B] shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                            Your catalog is empty
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                            Import the built-in sample products and articles, or add your own.
                        </p>
                    </div>
                    <Link
                        to="/admin-dashboard/settings"
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#4A9B4B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2F6A30] transition-colors"
                    >
                        Import Sample Data
                    </Link>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {stats.map((stat) => {
                    const Card = ({ children }) =>
                        stat.to ? (
                            <Link
                                to={stat.to}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                {children}
                            </Link>
                        ) : (
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{children}</div>
                        );

                    return (
                        <Card key={stat.label}>
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-[#4A9B4B]/10 flex items-center justify-center shrink-0">
                                    <stat.icon className="w-5 h-5 text-[#4A9B4B]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-500 truncate">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* PART2: Sales chart + quick actions */}
            {/* Sales chart + quick actions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
                <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Sales Overview</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Orders across the store (sample data)</p>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
                            {rangeTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setRange(tab.key)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                        range === tab.key
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end gap-1.5 sm:gap-2 h-44">
                        {series.map((value, i) => (
                            <div
                                key={i}
                                title={`${value} orders`}
                                className="flex-1 rounded-t-lg bg-[#4A9B4B]/75 hover:bg-[#4A9B4B] transition-colors"
                                style={{ height: `${Math.round((value / max) * 100)}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
                    <div className="mt-4 space-y-3 flex-1">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                to={action.to}
                                className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-[#4A9B4B]/5 hover:border-[#4A9B4B]/30 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg bg-[#4A9B4B]/10 flex items-center justify-center shrink-0">
                                    <action.icon className="w-4.5 h-4.5 text-[#4A9B4B]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2F6A30] transition-colors">
                                        {action.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-1 group-hover:text-[#4A9B4B] group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Top Rated</p>
                        <ul className="space-y-2.5">
                            {topRated.map((product) => (
                                <li key={product.id} className="flex items-center gap-3">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-8 h-8 rounded-md object-cover border border-gray-100"
                                    />
                                    <span className="flex-1 text-sm text-gray-700 truncate">{product.title}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                                        <Sparkles className="w-3 h-3" />
                                        {product.rating}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* PART3: Recent products + latest posts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">Recent Products</h3>
                        <Link
                            to="/admin-dashboard/products"
                            className="text-sm font-semibold text-[#4A9B4B] hover:text-[#2F6A30] transition-colors inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {recentProducts.map((product) => (
                            <li key={product.id} className="flex items-center gap-3 px-5 sm:px-6 py-3">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{product.description}</p>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(product.price)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">Latest Blog Posts</h3>
                        <Link
                            to="/admin-dashboard/blogs"
                            className="text-sm font-semibold text-[#4A9B4B] hover:text-[#2F6A30] transition-colors inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {recentBlogs.map((blog) => (
                            <li key={blog.id} className="flex items-start gap-3 px-5 sm:px-6 py-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {blog.category} · {blog.date}
                                    </p>
                                </div>
                                {blog.featured && (
                                    <span className="shrink-0 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                        Featured
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default Overview;