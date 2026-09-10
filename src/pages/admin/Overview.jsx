import { useEffect, useMemo, useState } from "react";
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
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    Users,
    Clock,
    Download,
    ExternalLink,
    AlertTriangle,
    Check,
    PackageX,
} from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import { Modal } from "../../component/ui/model";
import { getAllProducts } from "../../services/productService";
import { getAllBlogs } from "../../services/blogService";
import { getAllOrders, normalizeOrder } from "../../services/orderService";
import { showError } from "../../utils/toastUtils";
import { formatDate, toJsDate } from "../../utils/dateUtils";
import formatPrice from "../../utils/formatPrice";

const RANGES = [
    { key: "12m", label: "12M" },
    { key: "30d", label: "30D" },
    { key: "7d", label: "7D" },
];

const METRICS = [
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "revenue", label: "Revenue", icon: IndianRupee },
    { key: "customers", label: "Customers", icon: Users },
];

const exportToCSV = (buckets, metric, compareMode, previousBuckets, uniqueCustomers) => {
    const rows = buckets.map((b) => {
        const row = { Period: b.label };
        if (metric === "customers") {
            row.Current = uniqueCustomers;
        } else {
            row.Current = metric === "revenue" ? formatPrice(b.revenue) : b.orders;
        }
        if (compareMode && previousBuckets) {
            const pb = previousBuckets[buckets.indexOf(b)];
            if (metric === "customers") {
                row.Previous = uniqueCustomers;
            } else {
                row.Previous = metric === "revenue" ? formatPrice(pb.revenue) : pb.orders;
            }
        }
        return row;
    });
    const headers = Object.keys(rows[0] || {});
    const csv = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => `"${r[h] || ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overview-${metric}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

const Overview = () => {
    const [range, setRange] = useState("12m");
    const [metric, setMetric] = useState("orders");
    const [compareMode, setCompareMode] = useState(false);
    const [hovered, setHovered] = useState(null);
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
                    setOrders(orderList.map(normalizeOrder));
                }
            } catch (error) {
                console.error("Failed to load overview:", error);
                if (!cancelled) showError("Failed to load dashboard data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

        const recentProducts = products.slice(-6).reverse();
    const recentBlogs = blogs.slice(-5).reverse();
    const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

    const paidOrders = useMemo(
      () => orders.filter((order) => order.status !== "Cancelled"),
      [orders]
    );
    const revenue = paidOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

            const uniqueCustomers = useMemo(() => {
        const set = new Set();
        orders.forEach((o) => {
            const c = o.customerEmail || o.customerName || o.userId;
            if (c) set.add(String(c).toLowerCase());
        });
        return set.size;
    }, [orders]);

    const stats = [
        { label: "Products", value: String(products.length), icon: Package, to: "/admin-dashboard/products" },
        { label: "Blog Posts", value: String(blogs.length), icon: FileText, to: "/admin-dashboard/blogs" },
        { label: "Orders", value: String(orders.length), icon: ShoppingBag, to: "/admin-dashboard/orders" },
        { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee, to: "/admin-dashboard/orders" },
    ];

    const catalogEmpty = products.length === 0 && blogs.length === 0;

    // ---- Real chart data derived from live orders ----
    const series = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const buckets = [];

        if (range === "12m") {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                buckets.push({
                    key: `${d.getFullYear()}-${d.getMonth()}`,
                    label: d.toLocaleDateString("en-IN", { month: "short" }),
                    full: d.toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                    }),
                    orders: 0,
                    revenue: 0,
                });
            }
        } else {
            const days = range === "30d" ? 30 : 7;
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(startOfToday);
                d.setDate(d.getDate() - i);
                buckets.push({
                    key: d.toDateString(),
                    label:
                        range === "7d"
                            ? d.toLocaleDateString("en-IN", { weekday: "short" })
                            : String(d.getDate()),
                    full: d.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                    }),
                    orders: 0,
                    revenue: 0,
                });
            }
        }

        const indexOfKey = new Map(buckets.map((b, i) => [b.key, i]));
        paidOrders.forEach((order) => {
            const d = toJsDate(order.createdAt);
            if (!d) return;
            const key =
                range === "12m"
                    ? `${d.getFullYear()}-${d.getMonth()}`
                    : new Date(
                          d.getFullYear(),
                          d.getMonth(),
                          d.getDate()
                      ).toDateString();
            const bucket = buckets[indexOfKey.get(key)];
            if (bucket) {
                bucket.orders += 1;
                bucket.revenue += Number(order.total) || 0;
            }
        });

                return buckets;
    }, [paidOrders, range]);

    const previousSeries = useMemo(() => {
        if (!compareMode) return null;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const buckets = [];

        if (range === "12m") {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
                buckets.push({
                    key: `${d.getFullYear()}-${d.getMonth()}`,
                    label: d.toLocaleDateString("en-IN", { month: "short" }),
                    full: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
                    orders: 0,
                    revenue: 0,
                });
            }
        } else {
            const days = range === "30d" ? 30 : 7;
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(startOfToday);
                d.setDate(d.getDate() - i - days);
                buckets.push({
                    key: d.toDateString(),
                    label: range === "7d" ? d.toLocaleDateString("en-IN", { weekday: "short" }) : String(d.getDate()),
                    full: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                    orders: 0,
                    revenue: 0,
                });
            }
        }

        const indexOfKey = new Map(buckets.map((b, i) => [b.key, i]));
        paidOrders.forEach((order) => {
            const d = toJsDate(order.createdAt);
            if (!d) return;
            const key = range === "12m"
                ? `${d.getFullYear()}-${d.getMonth()}`
                : new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
            const bucket = buckets[indexOfKey.get(key)];
            if (bucket) {
                bucket.orders += 1;
                bucket.revenue += Number(order.total) || 0;
            }
        });
        return buckets;
    }, [paidOrders, range, compareMode]);

    const values = series.map((b) =>
        metric === "revenue" ? b.revenue : b.orders
    );
    const totalValue = values.reduce((sum, v) => sum + v, 0);
    const avgValue = totalValue / series.length;
    const rangeOrders = series.reduce((s, b) => s + b.orders, 0);
    const rangeRevenue = series.reduce((s, b) => s + b.revenue, 0);

    // Round the axis max up to a clean number so gridlines read nicely
    const niceMax = (() => {
        const max = Math.max(...values, 1);
        const pow = Math.pow(10, Math.floor(Math.log10(max)));
        const unit = pow / 2;
        return Math.max(unit, Math.ceil(max / unit) * unit);
    })();

    const formatAxis = (v) => {
        if (metric !== "revenue") return String(Math.round(v));
        if (v >= 100000) return `₹${Math.round(v / 1000)}k`;
        if (v >= 1000) return `₹${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
        return `₹${Math.round(v)}`;
    };

    const currBucket = series[series.length - 1];
    const prevBucket = series.length > 1 ? series[series.length - 2] : null;
    const growthPct =
        !prevBucket || (prevBucket[metric] === 0 && currBucket[metric] === 0)
            ? 0
            : prevBucket[metric] > 0
            ? Math.round(
                  ((currBucket[metric] - prevBucket[metric]) /
                      prevBucket[metric]) *
                      100
              )
            : 100;

    useEffect(() => {
        setHovered(null);
    }, [range, metric]);

    const quickActions = [
        { title: "Add Product", desc: "List a new eco product in your catalog.", to: "/admin-dashboard/products", icon: Plus },
        { title: "Write a Blog Post", desc: "Share a journal entry with your readers.", to: "/admin-dashboard/blogs", icon: PenLine },
    ];

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Overview" />

            {loading ? (
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                    </div>
                </div>
            ) : (
                <>
            {catalogEmpty && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 glass rounded-2xl border border-[var(--primary-color)]/30 p-4 sm:p-5">
                    <Package className="w-6 h-6 text-[var(--primary-color)] shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-strong">
                            Your catalog is empty
                        </p>
                        <p className="text-sm text-secondary mt-0.5">
                            Import the built-in sample products and articles, or add your own.
                        </p>
                    </div>
                    <Link
                        to="/admin-dashboard/settings"
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-color)] hover:brightness-110 transition-all"
                    >
                        Import Sample Data
                    </Link>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {stats.map((stat) => {
                    const Card = ({ children }) =>
                        stat.to ? (
                            <Link
                                to={stat.to}
                                className="glass group rounded-2xl border border-subtle p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                {children}
                            </Link>
                        ) : (
                            <div className="glass rounded-2xl border border-subtle p-5 shadow-sm">{children}</div>
                        );

                    return (
                        <Card key={stat.label}>
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                                    <stat.icon className="w-5 h-5 text-[var(--primary-color)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-muted text-sm truncate">{stat.label}</p>
                                    <p className="text-strong text-2xl font-bold truncate">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* PART2: Sales chart + quick actions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
                <div className="xl:col-span-2 glass-strong rounded-2xl border border-subtle shadow-sm p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-semibold text-strong">Sales Overview</h3>
                            <p className="text-sm text-muted mt-0.5">
                                {range === "12m" ? "Last 12 months" : range === "30d" ? "Last 30 days" : "Last 7 days"} · live from your orders
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-0.5 rounded-lg bg-[var(--glass-highlight)] p-0.5">
                                {METRICS.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => setMetric(m.key)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                            metric === m.key
                                                ? "glass-strong text-strong shadow-sm"
                                                : "text-muted hover:text-strong"
                                        }`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCompareMode(!compareMode)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                    compareMode
                                        ? "glass-strong text-strong shadow-sm"
                                        : "text-muted hover:text-strong"
                                }`}
                                aria-pressed={compareMode}
                            >
                                Compare
                                {compareMode && ' (prev period)'}
                            </button>
                            <button
                                onClick={() => exportToCSV(series, metric, compareMode, compareMode ? previousSeries : null, uniqueCustomers)}
                                className="p-1.5 text-muted hover:text-strong transition-colors rounded-md hover:bg-[var(--glass-highlight)]"
                                aria-label="Export chart data as CSV"
                                title="Export CSV"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-0.5 rounded-lg bg-[var(--glass-highlight)] p-0.5">
                                {RANGES.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setRange(tab.key)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                            range === tab.key
                                                ? "glass-strong text-strong shadow-sm"
                                                : "text-muted hover:text-strong"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Range stats */}
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="min-w-0">
                            <p className="text-xs text-muted truncate">
                                Total {metric === "revenue" ? "revenue" : metric === "customers" ? "customers" : "orders"}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-strong truncate">
                                {metric === "revenue" ? formatPrice(rangeRevenue) : rangeOrders}
                            </p>
                        </div>
                        <div className="min-w-0 border-l border-subtle pl-3">
                            <p className="text-xs text-muted truncate">
                                Avg / {range === "12m" ? "month" : "day"}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-strong truncate">
                                {metric === "revenue"
                                    ? formatPrice(Math.round(avgValue))
                                    : Number.isInteger(avgValue)
                                    ? avgValue
                                    : avgValue.toFixed(1)}
                            </p>
                        </div>
                        <div className="min-w-0 border-l border-subtle pl-3">
                            <p className="text-xs text-muted truncate">Trend</p>
                            <p
                                className={`inline-flex items-center gap-1 text-sm font-bold ${
                                    growthPct > 0
                                        ? "text-green-600"
                                        : growthPct < 0
                                        ? "text-danger"
                                        : "text-muted"
                                }`}
                            >
                                {growthPct > 0 ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : growthPct < 0 ? (
                                    <TrendingDown className="h-4 w-4" />
                                ) : (
                                    <Minus className="h-4 w-4" />
                                )}
                                {growthPct > 0 ? "+" : ""}
                                {growthPct}%
                            </p>
                            <p className="text-[10px] text-muted">
                                vs prev {range === "12m" ? "month" : "day"}
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative mt-6">
                        <div className="relative h-48 sm:h-56">
                            {/* Gridlines + y-axis labels */}
                            {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                                <div
                                    key={ratio}
                                    className="absolute left-0 right-0 flex items-center gap-2"
                                    style={{ bottom: `${ratio * 100}%` }}
                                >
                                    <span className="w-10 shrink-0 text-right text-[10px] text-muted">
                                        {formatAxis(niceMax * ratio)}
                                    </span>
                                    <span className="h-px flex-1 bg-[var(--border-subtle)]" />
                                </div>
                            ))}

                            {/* Average line */}
                            {avgValue > 0 && (
                                <div
                                    className="absolute left-12 right-1 border-t border-dashed border-[var(--accent-color)]"
                                    style={{ bottom: `${(avgValue / niceMax) * 100}%` }}
                                >
                                    <span className="absolute -top-4 right-0 rounded bg-[var(--accent-color)]/10 px-1.5 text-[10px] font-semibold text-[var(--accent-color)]">
                                        avg
                                    </span>
                                </div>
                            )}

                            {/* Bars */}
                            <div
                                key={`${metric}-${range}-barcontainer`}
                                className="absolute bottom-0 left-12 right-1 top-0 flex items-end gap-1 sm:gap-1.5"
                            >
                                {compareMode && previousSeries && (
                                    previousSeries.map((bucket, i) => {
                                        const prevValue = metric === "revenue" ? bucket.revenue : metric === "customers" ? uniqueCustomers : bucket.orders;
                                        const pct = prevValue > 0 ? Math.max(3, (prevValue / niceMax) * 100) : 0;
                                        return (
                                            <div
                                                key={`prev-${bucket.key}`}
                                                className="relative flex-1 flex items-end justify-center"
                                            >
                                                <span
                                                    className="w-full max-w-6 rounded-t-[6px] bg-slate-400/20 dark:bg-slate-500/20 animate-barGrow"
                                                    style={{ height: `${pct}%`, animationDelay: `${i * 25}ms` }}
                                                />
                                            </div>
                                        );
                                    })
                                )}
                                {series.map((bucket, i) => {
                                    const value = values[i];
                                    const pct =
                                        value > 0
                                            ? Math.max(3, (value / niceMax) * 100)
                                            : 0;
                                    const isHovered = hovered === i;
                                    return (
                                        <button
                                            key={bucket.key}
                                            type="button"
                                            aria-label={`${bucket.full}: ${bucket.orders} orders · ${formatPrice(bucket.revenue)}`}
                                            onMouseEnter={() => setHovered(i)}
                                            onMouseLeave={() =>
                                                setHovered((h) => (h === i ? null : h))
                                            }
                                            onFocus={() => setHovered(i)}
                                            onBlur={() =>
                                                setHovered((h) => (h === i ? null : h))
                                            }
                                            onClick={() =>
                                                setHovered((h) => (h === i ? null : i))
                                            }
                                            className="group relative flex h-full min-w-0 flex-1 cursor-pointer items-end justify-center rounded-t-md outline-none"
                                        >
                                            <span
                                                className={`pointer-events-none absolute inset-x-0 bottom-0 top-0 rounded-t-md ${
                                                    isHovered
                                                        ? "bg-[var(--glass-highlight)]"
                                                        : ""
                                                }`}
                                            />
                                            <span
                                                className={`w-full max-w-6 rounded-t-[6px] animate-barGrow bg-gradient-to-t from-[var(--primary-color)]/55 to-[var(--primary-color)] group-hover:brightness-110 ${
                                                    isHovered
                                                        ? "from-[var(--primary-color)] to-[var(--accent-color)]"
                                                        : ""
                                                }`}
                                                style={{
                                                    height: `${pct}%`,
                                                    animationDelay: `${i * 25}ms`,
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tooltip */}
                            {hovered !== null && series[hovered] && (
                                <div
                                    className="glass-modal pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-subtle-strong px-3 py-2 shadow-lg"
                                    style={{
                                        left: `${Math.min(
                                            88,
                                            Math.max(12, ((hovered + 0.5) / series.length) * 100)
                                        )}%`,
                                        top: 0,
                                    }}
                                >
                                    <p className="text-xs font-semibold text-strong">
                                        {series[hovered].full}
                                    </p>
                                    <p className="text-xs text-secondary">
                                        {series[hovered].orders} orders ·{" "}
                                        {formatPrice(series[hovered].revenue)}
                                    </p>
                                </div>
                            )}

                            {orders.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="glass-strong rounded-lg px-4 py-2 text-xs text-secondary">
                                        No orders yet — the chart fills up as customers check out.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* X-axis labels */}
                        <div className="ml-12 mr-1 mt-2 flex gap-1 sm:gap-1.5">
                            {series.map((bucket, i) => (
                                <span
                                    key={bucket.key}
                                    className={`min-w-0 flex-1 truncate text-center text-[10px] ${
                                        hovered === i ? "font-semibold text-strong" : "text-muted"
                                    }`}
                                >
                                    {range === "30d" && i % 5 !== 4 && i !== series.length - 1
                                        ? ""
                                        : bucket.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-strong rounded-2xl border border-subtle shadow-sm p-5 sm:p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-strong">Quick Actions</h3>
                    <div className="mt-4 space-y-3 flex-1">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                to={action.to}
                                className="group flex items-start gap-3 rounded-xl border border-subtle glass p-4 hover:bg-[var(--glass-highlight)] hover:border-[var(--primary-color)]/30 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                                    <action.icon className="w-4.5 h-4.5 text-[var(--primary-color)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-strong group-hover:text-[var(--primary-color)] transition-colors">
                                        {action.title}
                                    </p>
                                    <p className="text-xs text-muted mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted ml-auto mt-1 group-hover:text-[var(--primary-color)] group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-subtle">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Top Rated</p>
                        <ul className="space-y-2.5">
                            {topRated.map((product) => (
                                <li key={product.id} className="flex items-center gap-3">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-8 h-8 rounded-md object-cover border border-subtle"
                                    />
                                    <span className="flex-1 text-sm text-secondary truncate">{product.title}</span>
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
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-subtle">
                        <h3 className="text-base font-semibold text-strong">Recent Products</h3>
                        <Link
                            to="/admin-dashboard/products"
                            className="text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--primary-color)] hover:brightness-90 transition-all inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-solid border-subtle-t">
                        {recentProducts.map((product) => (
                            <li key={product.id} className="flex items-center gap-3 px-5 sm:px-6 py-3 hover:bg-[var(--glass-highlight)] transition-colors">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-subtle"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-strong truncate">{product.title}</p>
                                    <p className="text-xs text-muted truncate">{product.description}</p>
                                </div>
                                <span className="text-sm font-semibold text-secondary shrink-0">{formatPrice(product.price)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-subtle">
                        <h3 className="text-base font-semibold text-strong">Latest Blog Posts</h3>
                        <Link
                            to="/admin-dashboard/blogs"
                            className="text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--primary-color)] hover:brightness-90 transition-all inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-solid border-subtle-t">
                        {recentBlogs.map((blog) => (
                            <li key={blog.id} className="flex items-start gap-3 px-5 sm:px-6 py-3 hover:bg-[var(--glass-highlight)] transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-strong truncate">{blog.title}</p>
                                    <p className="text-xs text-muted mt-0.5">
                                        {blog.category} · {formatDate(blog.date)}
                                    </p>
                                </div>
                                {blog.featured && (
                                    <span className="shrink-0 glass-pill bg-amber-100 text-amber-700">
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