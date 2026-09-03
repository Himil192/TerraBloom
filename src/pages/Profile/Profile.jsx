import React from "react";
import { Sparkles } from "lucide-react";
import PageBreadcrumb from "../../component/common/PageBreadCrumb";
import UserAddressCard from "../../component/Profile/UserAddressCard";
import UserInfoCard from "../../component/Profile/UserInfoCard";
import UserMetaCard from "../../component/Profile/UserMetaCard";

const Profile = () => {
    return (
        <div className="min-h-screen bg-color-background text-color-text">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                <PageBreadcrumb pageTitle="Profile" />
                <div className="card-surface rounded-2xl border border-color-border shadow-sm p-5 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#4A9B4B]/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-highlight" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Account Overview</h3>
                            <p className="text-sm opacity-70">
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
