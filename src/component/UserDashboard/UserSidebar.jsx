import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Heart,
    LayoutDashboard,
    LogOut,
    ShoppingCart,
    UserCog,
} from "lucide-react";
import { auth, db } from "../../firebase";
import SvgComponent from "../SvgComponent";
import { clearSessionCache } from "../../utils/sessionCache";
import { showError } from "../../utils/toastUtils";
import Avatar from "../common/Avatar";

const baseNav =
    "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer";
const activeNav = "nav-item-active font-semibold";
const inactiveNav = "nav-item";

const navItems = [
    { to: "/user-dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/user-dashboard/orders", label: "My Orders", icon: ShoppingCart, end: true },
];

const accountItems = [
    { to: "/user-dashboard/profile", label: "Profile & Address", icon: UserCog, end: true },
    { to: "/wishlist", label: "Wishlist", icon: Heart, end: true },
];

export default function UserSidebar() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                return;
            }
            setUser(currentUser);
            try {
                const snap = await getDoc(doc(db, "users", currentUser.uid));
                const data = snap.exists() ? snap.data() : {};
                const fullName = data.fullName || currentUser.displayName || "";
                const parts = fullName.trim().split(/\s+/);
                setFormData({
                    firstName: parts[0] || data.firstname || "",
                    lastName:
                        data.lastname || parts.slice(1).join(" ") || "",
                    email: data.email || currentUser.email || "",
                });
                setImageUrl(data.photoURL || "");
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearSessionCache();
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error.message);
            showError("Could not sign you out. Please try again.");
        }
    };

    return (
        <div className="flex h-full flex-col justify-between border-e border-subtle w-64">
            <div className="px-4 py-6 overflow-y-auto">
                <span className="grid h-12 items-center w-45 place-content-center">
                    <SvgComponent />
                </span>

                <p className="mt-6 px-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Eco Hub
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
                </ul>

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
            </div>
{user && (
                <div className="sticky inset-x-0 bottom-0 border-t border-subtle">
                    <div className="flex items-center gap-2 p-4 hover:bg-[var(--glass-highlight)] cursor-pointer">
                        <Avatar
                            name={`${formData.firstName} ${formData.lastName}`.trim()}
                            email={formData.email || user.email}
                            src={imageUrl}
                            className="size-10 ring-2 ring-[var(--glass-border)]"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-xs">
                                <strong className="block font-medium text-strong truncate">
                                    {(formData.firstName || formData.lastName || "User").trim()}
                                </strong>
                                <span className="text-muted truncate block">
                                    {formData.email || user.email}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}