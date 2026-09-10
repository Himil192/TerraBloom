import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "../component/UserDashboard/UserSidebar";
import UserTopbar from "../component/UserDashboard/UserTopbar";

// User dashboard shell - mirrors the admin shell so users get the same
// left-sidebar + topbar + <Outlet /> navigation model. Each section
// (Overview / My Orders / Profile) is a nested route rendered below.
const UserDashboard = () => {
    // Start open on desktop, closed on mobile (where the sidebar overlays the screen)
    const [sidebarOpen, setSidebarOpen] = useState(
        () => typeof window !== "undefined" && window.innerWidth >= 768
    );
    const sidebarRef = useRef(null);
    const mainRef = useRef(null);
    const location = useLocation();

    // Scroll the content area back to the top when navigating between
    // dashboard sections (the page scrolls inside <main>, not the window).
    useEffect(() => {
        mainRef.current?.scrollTo?.({ top: 0 });
    }, [location.pathname]);

    // Handle outside click to close sidebar (for mobile)
    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Ignore clicks on the topbar hamburger - it manages the state itself
            // (without this, mousedown would close the sidebar and the click
            // handler would immediately reopen it, making the button feel dead)
            if (
                event.target instanceof Element &&
                event.target.closest("[data-sidebar-toggle]")
            ) {
                return;
            }
            if (
                sidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - off-canvas on mobile, inline on md+ */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-40 w-64 glass-nav border-r border-subtle transition-all duration-300 ease-in-out md:relative md:transform-none ${
                    sidebarOpen
                        ? "translate-x-0 md:ml-0"
                        : "-translate-x-full md:translate-x-0 md:-ml-64"
                }`}
            >
                <UserSidebar />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <UserTopbar
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                {/* Scrollable main with frosted-glass backdrop */}
                <main
                    ref={mainRef}
                    className="isolate flex-1 overflow-y-auto bg-dashboard relative p-4 sm:p-5 lg:p-8"
                >
                    {/* Decorative blurred shapes that glow through the glass panels */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-[#4A9B4B]/15 blur-2xl" />
                        <div className="absolute top-1/4 -right-10 h-80 w-80 rounded-full bg-[#FFB829]/10 blur-2xl" />
                        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#88B73B]/12 blur-2xl" />
                        <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[#A2C73E]/10 blur-2xl" />
                    </div>

                    <div className="relative">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;