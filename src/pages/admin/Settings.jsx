import { useEffect, useState } from "react";
import { Store, Save, Database, Loader2, Upload } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import Input from "../../form/input/InputField";
import { getSettings, saveSettings } from "../../services/settingsService";
import { catalogStatus, seedCatalog } from "../../services/seedService";
import { showError, showSuccess } from "../../utils/toastUtils";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

const Settings = () => {
    const [form, setForm] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const saved = await getSettings();
                if (!cancelled) setForm(saved);
            } catch (error) {
                console.error("Failed to load settings:", error);
                if (!cancelled) showError("Failed to load settings");
            }
            try {
                const snapshot = await catalogStatus();
                if (!cancelled) setStatus(snapshot);
            } catch (error) {
                console.error("Failed to load catalog status:", error);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const saved = await saveSettings(form);
            setForm(saved);
            showSuccess("Store settings saved");
        } catch (error) {
            console.error("Failed to save settings:", error);
            showError("Failed to save settings.");
        }
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const result = await seedCatalog();
            showSuccess(
                `Sample data imported: ${result.products} products, ${result.blogs} posts, ${result.orders} orders`
            );
            setStatus(await catalogStatus());
        } catch (error) {
            console.error("Failed to seed catalog:", error);
            showError("Could not import sample data. Check permissions and that collections are empty.");
        } finally {
            setSeeding(false);
        }
    };

    if (!form) {
        return (
            <div className="space-y-6">
                <PageBreadcrumb pageTitle="Settings" />
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-color)]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Settings" />

            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl border border-subtle shadow-sm p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5 text-[var(--primary-color)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-strong">Store Information</h3>
                        <p className="text-sm text-muted mt-0.5">
                            Used across the storefront and admin dashboard.
                        </p>
                    </div>
                </div>

                <div>
                    <label htmlFor="st-storename" className={labelClass}>
                        Store Name
                    </label>
                    <Input
                        id="st-storename"
                        value={form.storeName}
                        onChange={set("storeName")}
                        placeholder="TerraBloom"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="st-email" className={labelClass}>
                            Support Email
                        </label>
                        <Input
                            id="st-email"
                            type="email"
                            value={form.supportEmail}
                            onChange={set("supportEmail")}
                            placeholder="support@terrabloom.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="st-phone" className={labelClass}>
                            Phone
                        </label>
                        <Input
                            id="st-phone"
                            value={form.phone}
                            onChange={set("phone")}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="st-address" className={labelClass}>
                        Store Address
                    </label>
                    <Input
                        id="st-address"
                        value={form.address}
                        onChange={set("address")}
                        placeholder="Green Retail Hub, Bengaluru 560001"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="st-currency" className={labelClass}>
                            Currency Symbol
                        </label>
                        <Input
                            id="st-currency"
                            value={form.currency}
                            onChange={set("currency")}
                            placeholder="₹"
                        />
                    </div>
                    <div>
                        <label htmlFor="st-tax" className={labelClass}>
                            Tax Rate (%)
                        </label>
                        <Input
                            id="st-tax"
                            type="number"
                            min="0"
                            max="100"
                            value={form.taxRate}
                            onChange={set("taxRate")}
                            placeholder="18"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn-glass-solid inline-flex items-center gap-2 text-sm font-semibold"
                    >
                        <Save className="w-4 h-4" />
                        Save Settings
                    </button>
                </div>
            </form>

            {/* Catalog data */}
            <div className="glass-strong rounded-2xl border border-subtle shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                        <Database className="w-5 h-5 text-[var(--primary-color)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-strong">Catalog Data</h3>
                        <p className="text-sm text-muted mt-0.5">
                            Import the built-in sample products, articles and orders into Firestore.
                            Only runs on empty collections, so repeated clicks are safe.
                        </p>
                    </div>
                </div>

                <div className="mt-4 glass rounded-xl border border-subtle p-4 text-sm text-secondary">
                    {status === null ? (
                        <span className="inline-flex items-center gap-2 text-muted">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Checking collections...
                        </span>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {[
                                { key: "products", label: "Products" },
                                { key: "blogs", label: "Articles" },
                                { key: "orders", label: "Orders" },
                            ].map(({ key, label }) => (
                                <li key={key} className="glass-pill bg-[var(--glass-highlight)] text-secondary">
                                    {label}: <span className="text-strong">{status[key] >= 0 ? status[key] : "n/a"}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="mt-4 btn-glass-solid inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {seeding ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Importing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Import Sample Data
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;