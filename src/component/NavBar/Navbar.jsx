import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import SvgComponent from '../SvgComponent';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; 

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
    const [, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);



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

                            <Link to="/login" className="btn-primary rounded-full px-5 py-1.5 text-sm font-semibold">Login / Signup</Link>

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
                                className="text-black dark:text-white focus:outline-none p-4"
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

                                {/* Login/Signup Button for Mobile */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            setIsOpen(false); // Close menu
                                            navigate('/login');
                                        }}
                                        className="btn-primary w-full rounded-full py-2.5 text-sm font-semibold"
                                    >
                                        Login / Signup
                                    </button>
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
