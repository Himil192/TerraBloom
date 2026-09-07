import { useState } from "react";
import { Store, Save } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import Input from "../../form/input/InputField";
import { getSettings, saveSettings } from "../../services/settingsService";
import { showSuccess } from "../../utils/toastUtils";

const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500";

const Settings = () => {
    const [form, setForm] = useState(getSettings());

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        saveSettings(form);
        showSuccess("Store settings saved (this session)");
    };

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Settings" />

            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-[#4A9B4B]/10 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5 text-[#4A9B4B]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Store Information</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
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
                        className="inline-flex items-center gap-2 rounded-lg bg-[#4A9B4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2F6A30] transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;