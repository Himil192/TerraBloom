import React from 'react';
import Sidebar from '../component/AdminDashboard/Sidebar';
import Topbar from '../component/AdminDashboard/Topbar';

const AdminDashboard = () => {
    return (
        <>
            <div className='flex h-screen'>
                <Sidebar />
                <div className='flex flex-col  flex-1 overflow-hidden'>
                    <Topbar />
                    <main className="flex-1 bg-gray-100 p-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-full bg-white"></div>
                    </main>
                </div>
            </div>

        </>
    );
};

export default AdminDashboard;
