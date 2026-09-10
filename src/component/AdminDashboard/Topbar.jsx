

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
    Sun,
    Moon,
    Package,
    FileText,
    Leaf,
    ShoppingCart,
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showError } from "../../utils/toastUtils";
import { clearSessionCache } from "../../utils/sessionCache";
import { useTheme } from "../../theme/ThemeContext";
import Avatar from "../common/Avatar";

// Firebase singletons — module scope keeps references stable across renders
const auth = getAuth(app);
const db = getFirestore(app);

// Onboarding notifications for the admin bell menu. Clicking one marks it read
// and jumps to the relevant page. (Swap this array for a Firestore onSnapshot
// feed when real-time alerts are needed.)
const NOTIFICATIONS = [
    {
        id: "store-setup",
        icon: Settings,
        title: "Complete store setup",
        desc: "Store name, support email and tax rate.",
        to: "/admin-dashboard/settings",
        unread: true,
    },
    {
        id: "first-product",
        icon: Package,
        title: "Add your first product",
        desc: "List an eco product in your catalog.",
        to: "/admin-dashboard/products",
        unread: true,
    },
    {
        id: "first-post",
        icon: FileText,
        title: "Write a blog post",
        desc: "Share tips in the TerraBloom journal.",
        to: "/admin-dashboard/blogs",
        unread: false,
    },
    {
        id: "review-orders",
        icon: ShoppingCart,
        title: "Review your orders",
        desc: "Track incoming orders and update status.",
        to: "/admin-dashboard/orders",
        unread: false,
    },
];

export default function Topbar({ toggleSidebar, sidebarOpen }) {
    const { isDark, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [adminEmail, setAdminEmail] = useState("Loading...");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [imageUrl, setImageUrl] = useState("");
    const [, setUserData] = useState(null);

    const [notifOpen, setNotifOpen] = useState(false);
    const [dismissed, setDismissed] = useState([]);
    const notifRef = useRef(null);

    const [uid, setUid] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profilePicture: "",

    });

    const visibleNotifications = NOTIFICATIONS.filter(
        (n) => !dismissed.includes(n.id)
    );
    const unreadCount = visibleNotifications.filter((n) => n.unread).length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setUid(user.uid);

                try {
                    const docRef = doc(db, "users", user.uid);
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
                        setAdminEmail(data.email || user.email);
                    } else {
                        setAdminEmail(user.email || "");
                    }
                } catch (error) {
                    showError("Failed to fetch user data");
                    console.error("Error fetching user data:", error);
                    setAdminEmail(user.email || "");
                }
            } else {
                setUser(null);
                setUid(null);
                setAdminEmail("guest@example.com");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            setDropdownOpen(false);
            setNotifOpen(false);
            await signOut(auth);
            clearSessionCache();
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <header className="glass-nav flex items-center justify-between px-4 py-3 border-b border-subtle text-[15px] font-[500] relative z-20">
            {/* Left: Sidebar toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    data-sidebar-toggle="true"
                    aria-label="Toggle sidebar"
                    aria-expanded={sidebarOpen}
                    className="p-2 text-secondary border border-subtle cursor-pointer hover:text-[var(--primary-color)] hover:bg-[var(--glass-highlight)] rounded-md transition"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Right: Notification + User */}
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        type="button"
                        onClick={() => setNotifOpen((o) => !o)}
                        aria-label="Notifications"
                        aria-expanded={notifOpen}
                        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-secondary transition-colors hover:bg-[var(--glass-highlight)] hover:text-[var(--primary-color)]"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="glass-strong absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-subtle-strong shadow-lg animate-fadeIn">
                            <div className="flex items-center justify-between border-b border-subtle px-3.5 py-2.5">
                                <p className="text-sm font-semibold text-strong">
                                    Notifications
                                </p>
                                {visibleNotifications.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDismissed(
                                                NOTIFICATIONS.map((n) => n.id)
                                            )
                                        }
                                        className="cursor-pointer text-xs text-muted transition-colors hover:text-[var(--primary-color)]"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {visibleNotifications.length === 0 ? (
                                <div className="flex flex-col items-center gap-1.5 px-4 py-8 text-center">
                                    <Leaf className="h-6 w-6 text-[var(--primary-color)]" />
                                    <p className="text-sm font-medium text-strong">You're all set!</p>
                                    <p className="text-xs text-muted">New alerts will show up here.</p>
                                </div>
                            ) : (
                                <ul className="py-1.5">
                                    {visibleNotifications.map((n) => (
                                        <li key={n.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDismissed((prev) => [
                                                        ...prev,
                                                        n.id,
                                                    ]);
                                                    setNotifOpen(false);
                                                    navigate(n.to);
                                                }}
                                                className="flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--glass-highlight)]"
                                            >
                                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--glass-highlight)] text-[var(--primary-color)]">
                                                    <n.icon className="h-4 w-4" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center gap-2">
                                                        <span className="truncate text-sm font-medium text-strong">
                                                            {n.title}
                                                        </span>
                                                        {n.unread && (
                                                            <span
                                                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-color)]"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </span>
                                                    <span className="block truncate text-xs text-muted">
                                                        {n.desc}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Dark / light theme toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={
                        isDark ? "Switch to light mode" : "Switch to dark mode"
                    }
                    title={
                        isDark ? "Switch to light mode" : "Switch to dark mode"
                    }
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-secondary transition-colors hover:bg-[var(--glass-highlight)] hover:text-[var(--primary-color)]"
                >
                    {isDark ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </button>

                {/* Desktop View: Avatar + Name */}
                <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    onKeyDown={(e) => e.key === "Enter" && setDropdownOpen((prev) => !prev)}
                    className="hidden sm:flex items-center gap-3 cursor-pointer group"
                >
                    {/* User Avatar with status indicator */}
                    <div className="relative">
                        <Avatar
                            name={`${formData.firstName} ${formData.lastName}`.trim()}
                            email={formData.email}
                            seed={uid}
                            src={imageUrl}
                            alt="Profile"
                            className="w-10 h-10 ring-2 ring-[var(--glass-border)] group-hover:ring-[var(--primary-color)] transition-all duration-200"
                        />
                        {/* Online status indicator */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#262927] rounded-full"></span>
                    </div>
                    {/* User Info */}
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-semibold text-strong leading-tight">
                            {formData.firstName || "User"} {formData.lastName || ""}
                        </span>
                        <span className="text-xs text-muted leading-tight">
                            {formData.role === 'admin' ? 'Administrator' : 'Member'}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted group-hover:text-[var(--primary-color)] transition-colors duration-200" />
                </div>

                {/* Mobile: More menu */}
                <button
                    tabIndex={0}
                    aria-label="More menu"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="sm:hidden p-2 rounded-full hover:bg-[var(--glass-highlight)]"
                >
                    <MoreVertical className="w-5 h-5 text-secondary" />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-14 w-64 glass-strong border border-subtle-strong rounded-2xl shadow-xl z-50 p-4 animate-fadeIn">
                        {/* User info header */}
                        <div className="flex items-center gap-3 pb-3 border-b border-subtle">
                            <Avatar
                                name={`${formData.firstName} ${formData.lastName}`.trim()}
                                email={formData.email}
                                seed={uid}
                                src={imageUrl}
                                alt="Profile"
                                className="w-12 h-12 ring-2 ring-[var(--glass-border)]"
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-semibold text-strong truncate">
                                    {formData.firstName || "Admin"} {formData.lastName || ""}
                                </span>
                                <span className="text-xs text-muted truncate">
                                    {adminEmail || "example@email.com"}
                                </span>
                            </div>
                        </div>

                        <ul className="flex flex-col text-sm text-secondary mt-2">
                            <li
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--glass-highlight)] hover:text-strong cursor-pointer transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/admin-dashboard/profile");
                                }}
                            >
                                <UserCircle className="w-4 h-4" />
                                Profile
                            </li>
                            <li
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--glass-highlight)] hover:text-strong cursor-pointer transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/admin-dashboard/settings");
                                }}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </li>
                            {user ? (
                                <li
                                    className="flex items-center gap-3 px-3 py-2.5 text-danger hover:bg-[#B3261E]/10 rounded-xl cursor-pointer transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </li>
                            ) : (
                                <li
                                    className="flex items-center gap-3 px-3 py-2.5 text-[var(--primary-color)] hover:bg-[var(--glass-highlight)] rounded-xl cursor-pointer transition-colors"
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
