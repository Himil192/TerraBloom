import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import SvgComponent from '../SvgComponent';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { clearSessionCache } from '../../utils/sessionCache';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = ({ links }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Get the current location of the link
    const { isDark, toggleTheme } = useTheme();
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);


    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dashboardPath, setDashboardPath] = useState('/user-dashboard');
    const { count: cartCount } = useCart();
    const { items: wishlistItems } = useWishlist();
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                // SECURITY: the role is fetched live from Firestore on every auth
                // change and is never read from localStorage (same fail-closed
                // philosophy as ProtectedRoute). It only picks which dashboard
                // link to show - real authorization stays server-side.
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    const role = userDoc.exists() ? userDoc.data().role : '';
                    setDashboardPath(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setDashboardPath('/user-dashboard');
                }
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearSessionCache();
            navigate('/');
        } catch (error) {
            console.error('Logout Error:', error.message);
        }
    };



    return (

        <header>
            <nav className="fixed top-0 left-0 right-0 z-50 w-auto  ">
                <div className="mx-auto  max-w-screen-xl px-4">
                    {/* Top row: Logo + Desktop Links + Buttons + Hamburger */}
                    <div className="header mt-4 flex h-16 items-center justify-between gap-4 rounded-full px-4 sm:px-5 md:mt-5">
                        {/* Logo */}
                        <Link to="/" className="flex h-10 items-center rounded-xl bg-white px-2.5 shadow-sm">
                            <SvgComponent />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-4">
                            {links.map((link, index) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={index}
                                        to={link.href}
                                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-[#4A9B4B] text-white shadow-sm' : 'text-color-text hover:bg-[#A4D79B]/60 hover:text-highlight-color'}`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link to={dashboardPath} className="btn-primary rounded-full px-5 py-1.5 text-sm font-semibold">My Dashboard</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-5 py-1.5 text-sm font-semibold"
                                        aria-label="Log out"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="btn-primary rounded-full px-5 py-1.5 text-sm font-semibold">Login / Signup</Link>
                            )}

                            <Link
                                to="/cart"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-label={`Shopping cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
                            >
                                <ShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4A9B4B] px-1 text-[10px] font-bold text-white">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={toggleTheme}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            <Link
                                to="/wishlist"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}
                            >
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4A9B4B] px-1 text-[10px] font-bold text-white">
                                        {wishlistCount > 9 ? '9+' : wishlistCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Hamburger + Theme Toggle */}
                        <div className="md:hidden flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-expanded={isOpen ? 'true' : 'false'}
                                aria-controls="mobile-menu"
                                aria-label="Toggle Navigation Menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />
                    )}

                    {/* Mobile Menu Panel */}
                    <div
                        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out md:hidden ${
                            isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className="h-full bg-white dark:bg-[#1D1F1F] shadow-xl flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <nav className="space-y-1">
                                    {links.map((link, index) => {
                                        const isActive = location.pathname === link.href;
                                        return (
                                            <Link
                                                key={index}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-[#4A9B4B] text-white'
                                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {link.name}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Wishlist & Cart Quick Links */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
                                    <div className="space-y-1">
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Heart size={18} />
                                                Wishlist
                                            </span>
                                            {wishlistCount > 0 && (
                                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4A9B4B] px-1.5 text-[10px] font-bold text-white">
                                                    {wishlistCount > 9 ? '9+' : wishlistCount}
                                                </span>
                                            )}
                                        </Link>
                                        <Link
                                            to="/cart"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <span className="flex items-center gap-3">
                                                <ShoppingBag size={18} />
                                                Cart
                                            </span>
                                            {cartCount > 0 && (
                                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4A9B4B] px-1.5 text-[10px] font-bold text-white">
                                                    {cartCount > 9 ? '9+' : cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Auth Buttons */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                {isLoggedIn ? (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate(dashboardPath);
                                            }}
                                            className="w-full rounded-xl bg-[#4A9B4B] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d8a3e]"
                                        >
                                            My Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate('/login');
                                        }}
                                        className="w-full rounded-xl bg-[#4A9B4B] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d8a3e]"
                                    >
                                        Login / Signup
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
};






export default Navbar;
