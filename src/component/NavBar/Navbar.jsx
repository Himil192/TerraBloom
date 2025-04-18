import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ links }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Get the current location of the link

    return (
        <nav className="relative flex items-center justify-between mt-5 mx-auto max-w-screen-xl rounded-full bg-white text-black">
            {/* Logo or brand name */}
            <div className="text-2xl p-4 font-bold">
                <Link to='/'>TeraBloom</Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex p-4 space-x-4">
                {links.map((link, index) => {
                    const isActive = location.pathname === link.href; // Check if link is active by comparing href with the current pathname
                    return (
                        <Link
                            key={index}
                            to={link.href}
                            className={`${isActive ? 'text-highlight-color font-semibold' : 'hover:text-highlight-color'}   focus:ring-2 focus:ring-highlight-color rounded px-2 py-1 transition-colors duration-200`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-black focus:outline-none p-4"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    aria-label="Toggle Navigation Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 rounded-b-lg  bg-white text-black p-4 md:hidden z-10 shadow-lg">
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={index}
                                to={link.href}
                                className={`${isActive ? 'text-highlight-color font-semibold' : 'hover:text-highlight-color'} block py-2 focus:ring-2 focus:ring-highlight-color rounded px-2 transition-colors duration-200`}
                                onClick={() => setIsOpen(false)} // Close the menu when a link is clicked
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden"
                    onClick={() => setIsOpen(false)} // Close menu when overlay is clicked
                    aria-hidden="true"
                ></div>
            )}
        </nav>
    );
};

export default Navbar;
