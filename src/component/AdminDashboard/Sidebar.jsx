
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as needed
import { ChevronDown } from "lucide-react";

export default function Sidebar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token'); // ✅ Remove login token
            window.location.reload();         // ✅ Refresh to re-evaluate isLoggedIn
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
            <div className="px-4 py-6">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
                    Logo
                </span>

                <ul className="mt-6 space-y-1">
                    <li>
                        <a href="#" className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                            General
                        </a>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span className="text-sm font-medium">Teams</span>
                                <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Banned Users
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Calendar
                                    </a>
                                </li>
                            </ul>
                        </details>
                    </li>

                    <li>
                        <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                            Billing
                        </a>
                    </li>

                    <li>
                        <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                            Invoices
                        </a>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <span className="text-sm font-medium">Account</span>
                                <ChevronDown className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Details
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Security
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>

            {user && (
                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                        <img
                            alt="Profile"
                            src={user.photoURL || "https://via.placeholder.com/40"}
                            className="size-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-xs">
                                <strong className="block font-medium">{user.displayName || "Admin"}</strong>
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
