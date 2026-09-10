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
import Avatar from "../common/Avatar";

const baseNav =
    "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer";
const activeNav = "nav-item-active font-semibold";
const inactiveNav = "nav-item";

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
    const [imageUrl, setImageUrl] = useState("");
    const [, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [uid, setUid] = useState(null);
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
        <div className="flex h-full flex-col justify-between border-e border-subtle w-64">
            <div className="px-4 py-6 overflow-y-auto">
                <span className="grid h-12 items-center w-45 place-content-center">
                    <SvgComponent />
                </span>

                <p className="mt-6 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
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
                                <item.icon size={17} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}

                    <div className="mt-6 pt-4 border-t border-subtle">
                        <p className="px-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                            Account
                        </p>
                        <ul className="mt-1 space-y-1">
                            {accountItems.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className={`${baseNav} ${inactiveNav}`}
                                    >
                                        <item.icon size={17} />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className={`${baseNav} text-danger hover:bg-[#B3261E]/10 text-left`}
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </ul>
            </div>

            {user && (
                <div className="sticky inset-x-0 bottom-0 border-t border-subtle">
                    <div className="flex items-center gap-2 p-4 hover:bg-[var(--glass-highlight)] cursor-pointer">
                        <Avatar
                            name={`${formData.firstName} ${formData.lastName}`.trim()}
                            email={formData.email || user.email}
                            seed={uid}
                            src={imageUrl}
                            alt="Profile"
                            className="size-10 ring-2 ring-[var(--glass-border)]"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-xs">
                                <strong className="block font-medium text-strong truncate">
                                    {formData.firstName || formData.lastName || "User"}
                                </strong>
                                <span className="text-muted truncate block">{formData.email || user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}