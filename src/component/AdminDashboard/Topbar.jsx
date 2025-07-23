import { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const [user, setUser] = useState(null);
    const [adminName, setAdminName] = useState("Loading...");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setAdminName(userDoc.data().name || currentUser.email);
                    } else {
                        setAdminName(currentUser.email);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setAdminName(currentUser.email);
                }
            } else {
                setUser(null);
                setAdminName("Guest");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <input
                type="text"
                placeholder="Search"
                className="border rounded px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-highlight-color"
            />

            <div className="flex items-center space-x-4 relative">
                <Bell className="text-gray-600 hover:text-highlight-color cursor-pointer" />

                {/* User Dropdown */}
                <div
                    className="flex items-center space-x-2 cursor-pointer relative"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img
                        src={
                            user?.photoURL ||
                            "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
                        }
                        alt="User"
                        className="w-8 h-8 rounded-full border"
                    />
                    <span className="font-medium text-gray-700">{adminName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-48 z-50">
                        <ul className="flex flex-col py-2 text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            {user ? (
                                <li
                                    className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            ) : (
                                <li
                                    className="px-4 py-2 text-green-500 hover:bg-green-100 cursor-pointer"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
