import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
    LayoutDashboard,
    Package,
    FileText,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    ClipboardList,
} from "lucide-react";
import SvgComponent from "../SvgComponent";
import { Link, NavLink } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { showError } from "../../utils/toastUtils";
import { clearSessionCache } from "../../utils/sessionCache";

const baseNav =
    "flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer";
const activeNav = "bg-[#4A9B4B]/10 text-[#2F6A30] font-semibold";
const inactiveNav = "text-gray-500 hover:bg-gray-100 hover:text-gray-700";

const navItems = [
    { to: "/admin-dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin-dashboard/products", label: "Products", icon: Package },
    { to: "/admin-dashboard/blogs", label: "Blog Articles", icon: FileText },
    { to: "/admin-dashboard/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin-dashboard/customers", label: "Customers", icon: Users },
];

const accountItems = [
    { to: "/admin-dashboard/profile", label: "Account Settings", icon: Settings, end: true },
    { to: "/admin-dashboard/settings", label: "Store Settings", icon: ClipboardList, end: true },
];

export default function Sidebar() {
    const [imageUrl, setImageUrl] = useState("/images/user/owner.jpg");
    const [, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [, setUid] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profilePicture: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const uid = user.uid;
                setUid(uid);

                try {
                    const docRef = doc(db, "users", uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        setFormData({
                            firstName: data.firstname || "",
                            lastName: data.lastname || "",
                            email: user.email || "",
                            profilePicture: data.photoURL || "",
                            role: data.role || "",
                        });
                        setImageUrl(data.photoURL || "");
                    }
                } catch (error) {
                    showError("Failed to fetch user data");
                    console.error("Error fetching user data:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearSessionCache();
            window.location.reload();
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <div className="flex h-full flex-col justify-between border-e border-gray-100 bg-white w-64">
            <div className="px-4 py-6 overflow-y-auto">
                <span className="grid h-12 items-center w-45 place-content-center">
                    <SvgComponent />
                </span>

                <p className="mt-6 px-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Manage Store
                </p>
                <ul className="mt-2 space-y-1">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `${baseNav} ${isActive ? activeNav : inactiveNav}`
                                }
                            >
                                <item.icon size={16} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="px-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                            Account
                        </p>
                        <ul className="mt-1 space-y-1">
                            {accountItems.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className={`${baseNav} ${inactiveNav}`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className={`${baseNav} ${inactiveNav} text-left`}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </ul>
            </div>

            {user && (
                <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                        {imageUrl ? (
                            <img
                                alt="Profile"
                                src={imageUrl}
                                className="size-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="size-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-sm uppercase">
                                {(formData.firstName || "U")
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
                                    {formData.firstName || formData.lastName || "User"}
                                </strong>
                                <span>{formData.email || user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}