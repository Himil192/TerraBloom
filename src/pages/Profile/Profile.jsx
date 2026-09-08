import React from "react";
import { Sparkles } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import UserAddressCard from "../../component/Profile/UserAddressCard";
import UserInfoCard from "../../component/Profile/UserInfoCard";
import UserMetaCard from "../../component/Profile/UserMetaCard";

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
                    <div className="flex items-center gap-3 mb-6">
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
