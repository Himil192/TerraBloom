// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { useTheme } from '../../theme/ThemeContext';
// import SvgComponent from '../SvgComponent';



// const Navbar = ({ links }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const location = useLocation(); // Get the current location of the link
//     const { isDark, toggleTheme } = useTheme();
//     useEffect(() => {
//         if (isDark) {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//     }, [isDark]);

//     return (
//         <header className="pt-2 pl-2 pr-2">
//             <nav className="  flex items-center justify-between mt-5 mx-auto max-w-screen-xl rounded-full  header fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-black/30   ">
//                 {/* Logo or brand name */}
//                 <div className="text-2xl p-4 font-bold">
//                     <Link to='/'>
//                         <SvgComponent />
//                     </Link>
//                 </div>



//                 {/* Desktop Menu */}
//                 <div className="hidden md:flex p-4 space-x-4">
//                     {links.map((link, index) => {
//                         const isActive = location.pathname === link.href; // Check if link is active by comparing href with the current pathname
//                         return (
//                             <Link
//                                 key={index}
//                                 to={link.href}
//                                 className={`${isActive ? 'text-highlight-color font-semibold  bg-[#A4D79B]' : 'hover:text-highlight-color '} hover:bg-[#A4D79B]    focus:ring-1 focus:ring-highlight-color rounded px-2 py-1 transition-colors duration-200`}
//                             >
//                                 {link.name}
//                             </Link>
//                         );
//                     })}
//                 </div>
//                 <div className="hidden md:flex items-center space-x-4 pr-4">
//                     <button className="btn-primary px-4 py-1 rounded-full">
//                         Login
//                     </button>

//                     {/* 🌞/🌙 Theme Toggle */}
//                     <button
//                         onClick={toggleTheme}
//                         className="text-xl px-3 py-1 rounded-full hover:bg-[#A4D79B] transition-colors"
//                         aria-label="Toggle Theme"
//                     >
//                         {isDark ? '🌙' : '🌞'}
//                     </button>
//                 </div>
//                 {/* Mobile Hamburger Menu */}
//                 <div className="md:hidden flex items-center space-x-2">
//                     {/* Theme Toggle */}
//                     <button
//                         onClick={toggleTheme}
//                         className="text-xl px-2 py-1 rounded-full hover:bg-[#A4D79B] dark:hover:bg-gray-800 transition-colors"
//                         aria-label="Toggle Theme"
//                     >
//                         {isDark ? '🌙' : '🌞'}
//                     </button>

//                     {/* Menu Toggle */}
//                     <button
//                         onClick={() => setIsOpen(!isOpen)}
//                         className="text-black dark:text-white focus:outline-none p-4"
//                         aria-expanded={isOpen ? 'true' : 'false'}
//                         aria-controls="mobile-menu"
//                         aria-label="Toggle Navigation Menu"
//                     >
//                         {isOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>
//                 </div>


//                 {/* Mobile Menu */}
//                 {isOpen && (
//                     <div className="absolute top-16 left-0 right-0 rounded-b-lg  header text-black p-4 md:hidden z-10 shadow-lg">
//                         {links.map((link, index) => {
//                             const isActive = location.pathname === link.href;
//                             return (
//                                 <Link
//                                     key={index}
//                                     to={link.href}
//                                     className={`${isActive ? 'text-highlight-color font-semibold' : 'hover:text-highlight-color'} hover:bg-[#A4D79B]   block py-2 focus:ring-1 focus:ring-highlight-color rounded px-2 transition-colors duration-200`}
//                                     onClick={() => setIsOpen(false)} // Close the menu when a link is clicked
//                                 >
//                                     {link.name}
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {/* Mobile Menu Overlay */}
//                 {isOpen && (
//                     <div
//                         className="fixed inset-0 bg-black opacity-50 md:hidden"
//                         onClick={() => setIsOpen(false)} // Close menu when overlay is clicked
//                         aria-hidden="true"
//                     ></div>
//                 )}
//             </nav>

//         </header>
//     );
// };

// export default Navbar;


//latest code

import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import SvgComponent from '../SvgComponent';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import firebase, { auth } from '../../firebase'; // Adjust the path as needed 

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    if (isLoggedIn) return null; // Show nothing if logged in

    return (

        <header className="pt-2">
            <nav className="fixed top-0 left-0 right-0 z-50 w-auto  ">
                <div className="mx-auto  max-w-screen-xl px-4">
                    {/* Top row: Logo + Desktop Links + Buttons + Hamburger */}
                    <div className="flex items-center justify-between h-16 p-4 mt-5 rounded-full header space-x-4  md:space-x-6">
                        {/* Logo */}
                        <Link to="/">
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
                                        className={`${isActive ? 'text-highlight-color font-semibold bg-[#A4D79B]' : 'hover:text-highlight-color'} hover:bg-[#A4D79B] focus:ring-1 focus:ring-highlight-color rounded px-2 py-1 transition-colors duration-200`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center space-x-4">

                            <button className="btn-primary px-4 py-1 rounded-full" onClick={() => navigate('/login')}>Login/Signup</button>

                            <button
                                onClick={toggleTheme}
                                className="text-xl px-3 py-1 rounded-full hover:bg-[#A4D79B] transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? '🌙' : '🌞'}
                            </button>
                        </div>

                        {/* Mobile Hamburger + Theme Toggle */}
                        <div className="md:hidden flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className="text-xl px-2 py-1 rounded-full hover:bg-[#A4D79B] dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? '🌙' : '🌞'}
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
                            <div className="absolute top-16 left-0 right-0 rounded-b-lg header k p-4 md:hidden z-10 shadow-lg mt-5">
                                {links.map((link, index) => {
                                    const isActive = location.pathname === link.href;
                                    return (
                                        <Link
                                            key={index}
                                            to={link.href}
                                            className={`${isActive ? 'text-highlight-color font-semibold' : 'hover:text-highlight-color'} hover:bg-[#A4D79B] block py-2 focus:ring-1 focus:ring-highlight-color rounded px-2 transition-colors duration-200`}
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
                                        className="w-full bg-highlight-color text-white py-2 rounded-full font-semibold hover:bg-green-600 transition-colors"
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