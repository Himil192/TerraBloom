// import React, { useState } from 'react';
// import Sidebar from '../component/AdminDashboard/Sidebar';
// import Topbar from '../component/AdminDashboard/Topbar';

// const AdminDashboard = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(true); // ← toggle state

//     return (
//         <div className='flex h-screen'>
//             {sidebarOpen && <Sidebar />} {/* ← Conditional rendering */}
//             <div className='flex flex-col flex-1 overflow-hidden'>
//                 <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//                 <main className="flex-1 bg-gray-100 p-6">
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg h-full bg-white"></div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../component/AdminDashboard/Sidebar';
import Topbar from '../component/AdminDashboard/Topbar';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarRef = useRef(null);

    // Close sidebar on outside click (mobile/tablet)
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
        <div className='flex h-screen relative'>
            {/* Sidebar wrapper with ref */}
            {sidebarOpen && (
                <div
                    ref={sidebarRef}
                    className="absolute z-30 md:static md:z-auto"
                >
                    <Sidebar />
                </div>
            )}

            <div className='flex flex-col flex-1 overflow-hidden'>
                <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 bg-gray-100 p-6">

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
