import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Users, UserX } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import EcoSpinner from "../../component/ui/EcoSpinner";
import SearchInput from "../../component/ui/SearchInput";
import GlassSelect from "../../component/ui/GlassSelect";
import { db } from "../../firebase";
import { showError } from "../../utils/toastUtils";
import { formatDate } from "../../utils/dateUtils";
import Avatar from "../../component/common/Avatar";

const rolePill = (role) =>
    role === "admin"
        ? "bg-[var(--glass-highlight)] text-[var(--primary-color)] border border-[var(--primary-color)]/30"
        : "bg-blue-100 text-blue-700 border border-blue-200";

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
                    <h3 className="text-lg font-semibold text-strong">
                        Customers
                        {customers ? (
                            <span className="text-muted font-normal"> ({customers.length})</span>
                        ) : null}
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                        Registered users from Firebase Authentication.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="sm:flex-1 sm:max-w-md"
                />
                <GlassSelect
                    value={roleFilter}
                    onChange={setRoleFilter}
                    ariaLabel="Filter customers by role"
                    options={[
                        { value: "all", label: "All roles" },
                        { value: "user", label: "User" },
                        { value: "admin", label: "Admin" },
                    ]}
                    className="sm:w-44"
                />
            </div>

            {/* BODY: loading / table / empty */}
            {customers === null ? (
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <EcoSpinner />
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm">
                    <div className="px-6 py-14 text-center">
                        <UserX className="w-10 h-10 mx-auto text-muted" />
                        <p className="mt-3 text-sm font-medium text-secondary">
                            {customers.length === 0
                                ? "No customers found in the database yet."
                                : "No customers match your filters."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-[720px] w-full text-sm">
                        <thead className="glass-th text-left text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5 hidden sm:table-cell">Phone</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5 hidden md:table-cell">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-solid border-subtle-t">
                            {filtered.map((customer) => (
                                <tr key={customer.uid} className="glass-tr">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={customer.name}
                                                email={customer.email}
                                                seed={customer.uid}
                                                src={customer.photoURL}
                                                alt={customer.name}
                                                className="w-9 h-9 border border-subtle"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-strong truncate">
                                                    {customer.name}
                                                </p>
                                                <p className="text-xs text-muted truncate">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden sm:table-cell">
                                        {customer.phone || "—"}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${rolePill(
                                                customer.role
                                            )}`}
                                        >
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-secondary hidden md:table-cell">
                                        {formatDate(
                                            customer.createdAt,
                                            { year: "numeric", month: "short", day: "numeric" },
                                            "en-US"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;