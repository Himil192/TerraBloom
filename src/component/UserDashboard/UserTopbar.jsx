import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Heart,
    LogIn,
    LogOut,
    Menu,
    Moon,
    MoreVertical,
    Sun,
    UserCog,
} from "lucide-react";
import { auth, db } from "../../firebase";
import { clearSessionCache } from "../../utils/sessionCache";
import { useTheme } from "../../theme/ThemeContext";
import Avatar from "../common/Avatar";

export default function UserTopbar({ toggleSidebar, sidebarOpen }) {
    const { isDark, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close the profile dropdown when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setUserName("User");
                setUserEmail("");
                return;
            }
            setUser(currentUser);
            try {
                const snap = await getDoc(doc(db, "users", currentUser.uid));
                const data = snap.exists() ? snap.data() : {};
                setUserName(
                    data.fullName ||
                        currentUser.displayName ||
                        currentUser.email?.split("@")[0] ||
                        "User"
                );
                setUserEmail(data.email || currentUser.email || "");
                setImageUrl(data.photoURL || "");
            } catch {
                setUserName(
                    currentUser.displayName ||
                        currentUser.email?.split("@")[0] ||
                        "User"
                );
                setUserEmail(currentUser.email || "");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            setDropdownOpen(false);
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

            {/* Right: Theme toggle + Profile */}
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                {/* Dark / light theme toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={
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

                {/* Desktop: user chip */}
                <div
                    className="hidden sm:flex items-center gap-3 cursor-pointer group"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                >
                    <div className="relative">
                        <Avatar
                            name={userName}
                            email={userEmail}
                            src={imageUrl}
                            className="w-10 h-10 ring-2 ring-[var(--glass-border)] group-hover:ring-[var(--primary-color)] transition-all duration-200"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#262927] rounded-full"></span>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-semibold text-strong leading-tight">
                            {userName}
                        </span>
                        <span className="text-xs text-muted leading-tight">
                            Member
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
                        <div className="flex items-center gap-3 pb-3 border-b border-subtle">
                            <Avatar
                                name={userName}
                                email={userEmail}
                                src={imageUrl}
                                className="w-12 h-12 ring-2 ring-[var(--glass-border)]"
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-semibold text-strong truncate">
                                    {userName}
                                </span>
                                <span className="text-xs text-muted truncate">
                                    {userEmail || "member@terrabloom.in"}
                                </span>
                            </div>
                        </div>

                        <ul className="flex flex-col text-sm text-secondary mt-2">
                            <li
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--glass-highlight)] hover:text-strong cursor-pointer transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/user-dashboard/profile");
                                }}
                            >
                                <UserCog className="w-4 h-4" />
                                My Profile
                            </li>
                            <li
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--glass-highlight)] hover:text-strong cursor-pointer transition-colors"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/wishlist");
                                }}
                            >
                                <Heart className="w-4 h-4" />
                                Wishlist
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