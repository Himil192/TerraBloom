import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Users, Search, UserX } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import EcoSpinner from "../../component/ui/EcoSpinner";
import { db } from "../../firebase";
import { showError } from "../../utils/toastUtils";

const initials = (name) =>
    (name || "U")
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);

const rolePill = (role) =>
    role === "admin"
        ? "bg-[#4A9B4B]/10 text-[#2F6A30]"
        : "bg-blue-100 text-blue-800";

const Customers = () => {
    const [customers, setCustomers] = useState(null);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                if (cancelled) return;
                const rows = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const fullName = data.fullName || data.firstname || "User";
                    return {
                        uid: doc.id,
                        name: `${data.firstname || ""} ${data.lastname || ""}`.trim() || fullName,
                        email: data.email || "",
                        phone: data.phone || "",
                        role: data.role || "user",
                        photoURL: data.photoURL || "",
                        createdAt: data.createdAt,
                    };
                });
                // Newest signups first (admin cares about latest members),
                // alphabetical as a tiebreaker for identical timestamps.
                const joined = (x) => {
                    try {
                        return x.createdAt?.toDate?.() || 0;
                    } catch {
                        return 0;
                    }
                };
                rows.sort(
                    (a, b) =>
                        joined(b) - joined(a) ||
                        (a.name || "").localeCompare(b.name || "")
                );
                setCustomers(rows);
            } catch (err) {
                if (!cancelled) {
                    console.error("Failed to load customers:", err);
                    showError("Could not load customers. Check Firestore permissions.");
                    setCustomers([]);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = (customers || []).filter((customer) => {
        const needle = query.trim().toLowerCase();
        const matchesQuery =
            !needle ||
            customer.name.toLowerCase().includes(needle) ||
            (customer.email || "").toLowerCase().includes(needle);
        const matchesRole =
            roleFilter === "all" || customer.role === roleFilter;
        return matchesQuery && matchesRole;
    });

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Customers" />

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Customers
                        {customers ? (
                            <span className="text-gray-400 font-normal"> ({customers.length})</span>
                        ) : null}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Registered users from Firebase Authentication.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#4A9B4B] focus:ring focus:ring-[#4A9B4B]/20 sm:w-44"
                >
                    <option value="all">All roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* BODY: loading / table / empty */}
            {customers === null ? (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <EcoSpinner />
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="px-6 py-14 text-center">
                        <UserX className="w-10 h-10 mx-auto text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-600">
                            {customers.length === 0
                                ? "No customers found in the database yet."
                                : "No customers match your filters."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5">Phone</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((customer) => (
                                <tr key={customer.uid} className="hover:bg-gray-50">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {customer.photoURL ? (
                                                <img
                                                    src={customer.photoURL}
                                                    alt={customer.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                                                    {initials(customer.name)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {customer.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {customer.phone || "—"}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${rolePill(
                                                customer.role
                                            )}`}
                                        >
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700">
                                        {customer.createdAt
                                            ? new Date(customer.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Customers;