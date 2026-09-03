import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, LogIn } from "lucide-react";

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-color-background text-color-text flex items-center justify-center px-4 py-24">
            <div className="card-surface w-full max-w-md rounded-3xl border border-color-border shadow-xl p-8 sm:p-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
                    Access Denied
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-3">Unauthorized</h1>
                <p className="opacity-80 mb-8">
                    You do not have permission to access this page. If you believe this is a
                    mistake, try signing in with a different account.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </Link>
                    <Link to="/login" className="btn-secondary px-6 py-3 text-sm font-semibold">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
