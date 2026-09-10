import { Sparkles } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import UserAddressCard from "../../component/Profile/UserAddressCard";
import UserInfoCard from "../../component/Profile/UserInfoCard";
import UserMetaCard from "../../component/Profile/UserMetaCard";
import useUserProfile from "../../Hooks/useUserProfile";

/**
 * Slim completeness meter for the page header: photo + name + phone + address.
 * Shares the same useUserProfile hook as the cards below.
 */
function ProfileCompleteness() {
    const { data, loading } = useUserProfile();
    if (loading || !data) return null;

    const checks = [
        { label: "a profile photo", done: Boolean(data.photoURL) },
        {
            label: "your name",
            done: Boolean((data.firstname || "").trim() && (data.lastname || "").trim()),
        },
        { label: "a phone number", done: Boolean((data.phone || "").trim()) },
        { label: "an address", done: Boolean((data.addressline1 || "").trim()) },
    ];
    const done = checks.filter((c) => c.done).length;
    const pct = Math.round((done / checks.length) * 100);
    const missing = checks.filter((c) => !c.done).map((c) => c.label);

    return (
        <div className="w-full max-w-xs lg:w-64">
            <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold text-strong">{pct}% complete</span>
                {missing.length > 0 && (
                    <span className="truncate text-muted">Add {missing.join(", ")}</span>
                )}
            </div>
            <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--glass-highlight)]"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Profile completeness"
            >
                <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

const Profile = () => {
    return (
        <div className="min-h-screen bg-dashboard text-strong relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -left-10 h-64 w-64 rounded-full bg-[#4A9B4B]/12 blur-3xl" />
                <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-[#FFB829]/8 blur-3xl" />
            </div>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 relative">
                <PageBreadcrumb pageTitle="Profile" />
                <div className="glass-strong rounded-2xl border border-subtle shadow-sm p-5 lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-[var(--primary-color)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-strong">Account Overview</h3>
                                <p className="text-sm text-muted">
                                    Manage your personal info, address, and profile photo.
                                </p>
                            </div>
                        </div>
                        <ProfileCompleteness />
                    </div>
                    <div className="space-y-6">
                        <UserMetaCard />
                        <UserInfoCard />
                        <UserAddressCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

