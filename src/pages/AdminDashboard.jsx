
// import React, { useState, useRef, useEffect } from 'react';
// import Sidebar from '../component/AdminDashboard/Sidebar';
// import Topbar from '../component/AdminDashboard/Topbar';
// import { Outlet } from 'react-router-dom';
// const AdminDashboard = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const sidebarRef = useRef(null);

//     // Close sidebar on outside click (mobile/tablet)
//     useEffect(() => {
//         const handleOutsideClick = (event) => {
//             if (
//                 sidebarOpen &&
//                 sidebarRef.current &&
//                 !sidebarRef.current.contains(event.target)
//             ) {
//                 setSidebarOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleOutsideClick);
//         document.addEventListener('touchstart', handleOutsideClick);

//         return () => {
//             document.removeEventListener('mousedown', handleOutsideClick);
//             document.removeEventListener('touchstart', handleOutsideClick);
//         };
//     }, [sidebarOpen]);

//     return (


//         <div className='flex   relative'>
//             {sidebarOpen && (
//                 <div ref={sidebarRef} className="absolute z-30 md:static md:z-auto">
//                     <Sidebar />
//                 </div>
//             )}

//             <div className='flex flex-col flex-1 overflow-hidden'>
//                 <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//                 <main className="flex-1 bg-gray-100 p-6">
//                     <Outlet /> {/* 👈 This renders nested route content like Profile */}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;




import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../component/AdminDashboard/Sidebar';
import Topbar from '../component/AdminDashboard/Topbar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarRef = useRef(null);

    // Handle outside click to close sidebar (for mobile)
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                sidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
                <div
                    ref={sidebarRef}
                    className=" bg-white border-t border-gray-300 h-full  "
                >
                    <Sidebar />
                </div>
            )}

            {/* Main content area */}
            <div className="flex flex-col flex-1">
                <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Scrollable main */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;


