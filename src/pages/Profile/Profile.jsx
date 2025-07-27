import React from 'react';
import PageBreadcrumb from '../../component/common/PageBreadCrumb';
import UserAddressCard from '../../component/Profile/UserAddressCard';
import UserInfoCard from '../../component/Profile/UserInfoCard';


const Profile = () => {
    return (

        <>
            <PageBreadcrumb pageTitle="Profile" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5  lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 ">
                    Profile
                </h3>
                <div className="space-y-6">
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </div>
        </>
    );
};

export default Profile;
