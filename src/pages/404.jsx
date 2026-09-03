import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Home, LifeBuoy } from "lucide-react";

const NotFound = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-[#4A9B4B] via-[#3E7F3F] to-[#1D1F1F] text-white text-center py-16 px-6">
            {/* Decorative leaves */}
            <Leaf className="absolute top-20 left-[10%] w-10 h-10 opacity-20 -rotate-12" />
            <Leaf className="absolute top-32 right-[12%] w-14 h-14 opacity-15 rotate-45" />
            <Leaf className="absolute bottom-24 left-[18%] w-12 h-12 opacity-15 rotate-90" />
            <Leaf className="absolute bottom-16 right-[20%] w-8 h-8 opacity-20 rotate-6" />

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest border border-white/40 rounded-full px-4 py-1.5 mb-6">
                <Leaf className="w-3.5 h-3.5" /> Page Not Found
            </span>

            <h1 className="text-7xl md:text-9xl font-extrabold text-[#FFB829] drop-shadow-lg mb-4 animate-pulse">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
                This page wandered off the path.
            </h2>
            <p className="max-w-md opacity-80 mb-8">
                The page you are looking for does not exist or may have been moved. Let&apos;s get you back to greener pastures.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white text-[#2F6A30] font-semibold px-6 py-3 rounded-full hover:bg-[#E6FAEB] transition-colors"
                >
                    <Home className="w-4 h-4" /> Back to Home
                </Link>
                <Link
                    to="/contact-us"
                    className="inline-flex items-center gap-2 border border-white/50 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
                >
                    <LifeBuoy className="w-4 h-4" /> Contact Support
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
