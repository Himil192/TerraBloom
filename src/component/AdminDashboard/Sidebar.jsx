
// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../../firebase"; // Adjust path as needed
// import { ChevronDown } from "lucide-react";

// export default function Sidebar() {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, currentUser => {
//             setUser(currentUser);
//         });

//         return () => unsubscribe();
//     }, []);
//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             localStorage.removeItem('token'); // ✅ Remove login token
//             window.location.reload();         // ✅ Refresh to re-evaluate isLoggedIn
//         } catch (error) {
//             console.error("Logout Error:", error.message);
//         }
//     };

//     return (
//         <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
//             <div className="px-4 py-6">
//                 <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
//                     Logo
//                 </span>

//                 <ul className="mt-6 space-y-1">
//                     <li>
//                         <a href="#" className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
//                             General
//                         </a>
//                     </li>

//                     <li>
//                         <details className="group [&_summary::-webkit-details-marker]:hidden">
//                             <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                 <span className="text-sm font-medium">Teams</span>
//                                 <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
//                             </summary>

//                             <ul className="mt-2 space-y-1 px-4">
//                                 <li>
//                                     <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                         Banned Users
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                         Calendar
//                                     </a>
//                                 </li>
//                             </ul>
//                         </details>
//                     </li>

//                     <li>
//                         <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                             Billing
//                         </a>
//                     </li>

//                     <li>
//                         <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                             Invoices
//                         </a>
//                     </li>

//                     <li>
//                         <details className="group [&_summary::-webkit-details-marker]:hidden">
//                             <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                 <span className="text-sm font-medium">Account</span>
//                                 <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
//                             </summary>

//                             <ul className="mt-2 space-y-1 px-4">
//                                 <li>
//                                     <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                         Details
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
//                                         Security
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//                                     >
//                                         Logout
//                                     </button>
//                                 </li>
//                             </ul>
//                         </details>
//                     </li>
//                 </ul>
//             </div>

//             {user && (
//                 <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
//                     <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
//                         <img
//                             alt="Profile"
//                             src={user.photoURL || "https://via.placeholder.com/40"}
//                             className="size-10 rounded-full object-cover"
//                         />
//                         <div>
//                             <p className="text-xs">
//                                 <strong className="block font-medium">{user.displayName || "Admin"}</strong>
//                                 <span>{user.email}</span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
    ChevronDown,
    Home,
    Users,
    Calendar,
    CreditCard,
    FileText,
    Settings,
    Lock,
    LogOut,
    UserX,
} from "lucide-react";
import SvgComponent from "../SvgComponent";

export default function Sidebar() {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, currentUser => {
    //         setUser(currentUser);
    //     });

    //     return () => unsubscribe();
    // }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const firestoreData = userDocSnap.data();
                        setUser({
                            ...currentUser,
                            fullName: firestoreData.fullName || currentUser.displayName || "Admin",
                        });
                    } else {
                        setUser({
                            ...currentUser,
                            fullName: currentUser.displayName || "Admin",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching Firestore user data:", error);
                    setUser({
                        ...currentUser,
                        fullName: currentUser.displayName || "Admin",
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("token");
            window.location.reload();
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
            <div className="px-4 py-6">
                <span className="grid h-12 items-center w-45 place-content-center     ">
                    <SvgComponent />

                </span>

                <ul className="mt-6 space-y-1">
                    <li>
                        <a
                            href="#"
                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            <Home size={16} />
                            General
                        </a>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <Users size={16} />
                                    Teams
                                </span>
                                <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                    >
                                        <UserX size={16} />
                                        Banned Users
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                    >
                                        <Calendar size={16} />
                                        Calendar
                                    </a>
                                </li>
                            </ul>
                        </details>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        >
                            <CreditCard size={16} />
                            Billing
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        >
                            <FileText size={16} />
                            Invoices
                        </a>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                    <Settings size={16} />
                                    Account
                                </span>
                                <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                    >
                                        <Settings size={16} />
                                        Details
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                    >
                                        <Lock size={16} />
                                        Security
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>

            {user && (
                // <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                //     <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                //         <img
                //             alt="Profile"
                //             src={user.photoURL || "https://via.placeholder.com/40"}
                //             className="size-10 rounded-full object-cover"
                //         />
                //         <div>
                //             <p className="text-xs">
                //                 <strong className="block font-medium">
                //                     {user.displayName || "Admin"}
                //                 </strong>
                //                 <span>{user.email}</span>
                //             </p>
                //         </div>
                //     </div>
                // </div>
                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                        {user.photoURL ? (
                            <img
                                alt="Profile"
                                src={user.photoURL}
                                className="size-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="size-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-sm uppercase">
                                {(user.fullName || user.displayName || "User")
                                    .split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                            </div>
                        )}

                        <div>
                            <p className="text-xs">
                                <strong className="block font-medium">
                                    {user.fullName || user.displayName || "User"}
                                </strong>
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>


            )}
        </div>
    );
}
