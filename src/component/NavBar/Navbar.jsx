import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import SvgComponent from '../SvgComponent';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { clearSessionCache } from '../../utils/sessionCache';

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

                            <button
                                onClick={toggleTheme}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#A4D79B]"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
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

                    {/* Mobile Menu (below the top row) */}
                    {isOpen && (
                        <>
                            <div className="absolute left-4 right-4 top-24 z-10 rounded-2xl border border-black/5 bg-white p-4 shadow-2xl md:hidden dark:border-white/10 dark:bg-[#262927]">
                                {links.map((link, index) => {
                                    const isActive = location.pathname === link.href;
                                    return (
                                        <Link
                                            key={index}
                                            to={link.href}
                                            className={`${isActive ? 'bg-[#4A9B4B] font-semibold text-white' : 'text-color-text hover:bg-[#A4D79B]/60'} block rounded-full px-3 py-2 text-sm transition-colors duration-200`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                })}

                                {/* Auth Buttons for Mobile */}
                                <div className="mt-4">
                                    {isLoggedIn ? (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false); // Close menu
                                                    navigate(dashboardPath);
                                                }}
                                                className="btn-primary w-full rounded-full py-2.5 text-sm font-semibold"
                                            >
                                                My Dashboard
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false); // Close menu
                                                    handleLogout();
                                                }}
                                                className="btn-secondary inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsOpen(false); // Close menu
                                                navigate('/login');
                                            }}
                                            className="btn-primary w-full rounded-full py-2.5 text-sm font-semibold"
                                        >
                                            Login / Signup
                                        </button>
                                    )}
                                </div>
                            </div>


                            {/* Mobile Menu Overlay */}
                            <div
                                className="fixed inset-0 bg-black opacity-50 md:hidden"
                                onClick={() => setIsOpen(false)}
                                aria-hidden="true"
                            ></div>
                        </>
                    )}

                </div>
            </nav>
        </header>
    );
};






export default Navbar;
