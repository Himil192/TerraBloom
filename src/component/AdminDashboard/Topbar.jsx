

// import { useEffect, useRef, useState } from "react";
// import {
//     Bell,
//     ChevronDown,
//     Menu,
//     MoreVertical,
//     UserCircle,
//     Settings,
//     LogOut,
//     LogIn,
// } from "lucide-react";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import app from "../../firebase";
// import { useNavigate } from "react-router-dom";

// export default function Topbar({ toggleSidebar }) {
//     const [user, setUser] = useState(null);
//     const [adminName, setAdminName] = useState("Loading...");
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const navigate = useNavigate();
//     const dropdownRef = useRef(null);

//     const auth = getAuth(app);
//     const db = getFirestore(app);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//                 setDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//             if (currentUser) {
//                 setUser(currentUser);
//                 try {
//                     const userDoc = await getDoc(doc(db, "users", currentUser.uid));
//                     setAdminName(
//                         userDoc.exists() ? userDoc.data().name || currentUser.email : currentUser.email
//                     );
//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                     setAdminName(currentUser.email);
//                 }
//             } else {
//                 setUser(null);
//                 setAdminName("Guest");
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             navigate("/login");
//         } catch (error) {
//             console.error("Logout Error:", error);
//         }
//     };

//     return (
//         <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
//             {/* Left: Sidebar toggle */}
//             <div className="flex items-center gap-4">
//                 <button
//                     onClick={toggleSidebar}
//                     className="p-2 text-gray-600 hover:text-highlight-color cursor-pointer"
//                     aria-label="Toggle sidebar"
//                 >
//                     <Menu className="w-6 h-6" />
//                 </button>
//             </div>

//             {/* Right: Notification + Avatar/Menu */}
//             <div className="flex items-center gap-4 relative" ref={dropdownRef}>
//                 {/* Bell with tooltip */}
//                 <div className="relative group cursor-pointer">
//                     <Bell className="text-gray-600 hover:text-highlight-color" />
//                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded px-2 py-1 pointer-events-none z-50">
//                         Notifications
//                     </span>
//                 </div>

//                 {/* Desktop View */}
//                 <div
//                     tabIndex={0}
//                     role="button"
//                     onClick={() => setDropdownOpen((prev) => !prev)}
//                     onKeyDown={(e) => e.key === "Enter" && setDropdownOpen((prev) => !prev)}
//                     className="hidden sm:flex items-center space-x-2 cursor-pointer outline-none"
//                 >
//                     <img
//                         src={user?.photoURL || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"}
//                         alt="User avatar"
//                         className="w-8 h-8 rounded-full border object-cover"
//                     />
//                     <span className="font-medium text-gray-700 truncate max-w-[100px] hidden md:block">
//                         {adminName}
//                     </span>
//                     <ChevronDown className="w-4 h-4 text-gray-600" />
//                 </div>

//                 {/* Mobile View: 3-dots */}
//                 <button
//                     tabIndex={0}
//                     aria-label="More menu"
//                     onClick={() => setDropdownOpen((prev) => !prev)}
//                     className="sm:hidden p-2 rounded-full hover:bg-gray-100"
//                 >
//                     <MoreVertical className="w-5 h-5 text-gray-700" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                     <div className="absolute right-0 top-12 w-60 bg-white border rounded-lg shadow-lg z-50 p-4 space-y-2 sm:w-48 animate-fadeIn">
//                         {/* User Info (Mobile only) */}
//                         <div className="flex items-center gap-3 sm:hidden">
//                             <img
//                                 src={user?.photoURL || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"}
//                                 alt="User avatar"
//                                 className="w-10 h-10 rounded-full border object-cover"
//                             />
//                             <div className="text-sm font-medium text-gray-800">{adminName}</div>
//                         </div>

//                         <hr className="border-t sm:hidden" />

//                         {/* Menu Items */}
//                         <ul className="flex flex-col text-gray-700 text-sm">
//                             <li
//                                 className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
//                                 onClick={() => navigate("/profile")}
//                             >
//                                 <UserCircle className="w-4 h-4" />
//                                 Profile
//                             </li>
//                             <li
//                                 className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
//                                 onClick={() => navigate("/settings")}
//                             >
//                                 <Settings className="w-4 h-4" />
//                                 Settings
//                             </li>
//                             {user ? (
//                                 <li
//                                     className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-100 rounded cursor-pointer"
//                                     onClick={handleLogout}
//                                 >
//                                     <LogOut className="w-4 h-4" />
//                                     Logout
//                                 </li>
//                             ) : (
//                                 <li
//                                     className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-100 rounded cursor-pointer"
//                                     onClick={() => navigate("/login")}
//                                 >
//                                     <LogIn className="w-4 h-4" />
//                                     Login
//                                 </li>
//                             )}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }




import { useEffect, useRef, useState } from "react";
import {
    Bell,
    ChevronDown,
    Menu,
    MoreVertical,
    UserCircle,
    Settings,
    LogOut,
    LogIn,
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Topbar({ toggleSidebar }) {
    const [user, setUser] = useState(null);
    const [adminName, setAdminName] = useState("Loading...");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [adminEmail, setAdminEmail] = useState("Loading...");
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setAdminName(data.fullName || currentUser.displayName || "Admin");
                        setAdminEmail(data.email || currentUser.email);
                    } else {
                        // fallback if Firestore doc not found
                        setAdminName(currentUser.displayName || "Admin");
                        setAdminEmail(currentUser.email);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setAdminName(currentUser.displayName || "Admin");
                    setAdminEmail(currentUser.email);
                }
            } else {
                setUser(null);
                setAdminName("Guest");
                setAdminEmail("guest@example.com");
            }
        });

        return () => unsubscribe();
    }, []);



    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white   shadow-sm text-[15px] font-[500]">
            {/* Left: Sidebar toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-600   hover:text-highlight-color hover:bg-gray-100   rounded-md transition"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                {/* Bell icon with tooltip */}
                <div className="relative group cursor-pointer">
                    <Bell className="w-5 h-5 text-gray-600   hover:text-highlight-color transition" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs rounded px-2 py-1 pointer-events-none z-50">
                        Notifications
                    </span>
                </div>

                {/* Desktop View: Avatar + Name */}
                <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    onKeyDown={(e) => e.key === "Enter" && setDropdownOpen((prev) => !prev)}
                    className="hidden sm:flex items-center space-x-2 cursor-pointer"
                >
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="User avatar"
                            className="w-9 h-9 rounded-full border object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-sm uppercase  ">
                            {(adminName || user?.displayName || "User")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                        </div>
                    )}
                    <span className="text-gray-700   truncate max-w-[100px] hidden md:block text-sm">
                        {adminName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600  " />
                </div>

                {/* Mobile: More menu */}
                <button
                    tabIndex={0}
                    aria-label="More menu"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="sm:hidden p-2 rounded-full hover:bg-gray-100  "
                >
                    <MoreVertical className="w-5 h-5 text-gray-700  " />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-64 sm:w-52 bg-white   border border-gray-200   rounded-xl shadow-lg z-50 p-3 animate-fadeIn">
                        {/* Mobile user info */}

                        <div className="flex items-center gap-3 sm:hidden mb-4">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={adminName || "User Avatar"}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />
                            ) : (
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold text-sm uppercase">
                                    {(adminName || user?.displayName || "User")
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .toUpperCase()
                                        .substring(0, 2)}
                                </div>
                            )}

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">
                                    {adminName || "Admin"}
                                </span>
                                <span className="text-xs text-gray-600 truncate max-w-[200px]">
                                    {adminEmail || "example@email.com"}
                                </span>
                            </div>
                        </div>
                        <hr className="sm:hidden my-3 border-t border-gray-300" />


                        <ul className="flex flex-col text-sm text-gray-700  ">
                            <li
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100  cursor-pointer"
                                onClick={() => navigate("/profile")}
                            >
                                <UserCircle className="w-4 h-4" />
                                Profile
                            </li>
                            <li
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100  cursor-pointer"
                                onClick={() => navigate("/settings")}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </li>
                            {user ? (
                                <li
                                    className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </li>
                            ) : (
                                <li
                                    className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md cursor-pointer"
                                    onClick={() => navigate("/login")}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}
