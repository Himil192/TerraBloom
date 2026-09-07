import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Loader2,
    Leaf,
    Truck,
    ShieldCheck,
    ArrowRight,
    Star,
} from "lucide-react";
import { auth, db } from "../firebase";
import { showError, showSuccess } from "../utils/toastUtils";
import SvgComponent from "./SvgComponent";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                // Security: deliberately do NOT persist the raw Firebase ID token
                // in localStorage (XSS exfiltration risk). Firebase Auth manages
                // its own session storage. role/uid below are non-authoritative
                // UI caches only - real authorization happens in Firestore rules.
                localStorage.setItem("role", role);
                localStorage.setItem("uid", user.uid);

                showSuccess("Welcome back!");

                if (role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/user-dashboard");
                }
            } else {
                showError("Account setup incomplete. Please contact support.");
            }
        } catch (error) {
            console.error("Login error:", error);

            if (error.code === "auth/user-not-found") {
                showError("No account found. Please check your email or sign up.");
            } else if (error.code === "auth/wrong-password") {
                showError("Incorrect password. Please try again.");
            } else if (error.code === "auth/invalid-email") {
                showError("Please enter a valid email address.");
            } else {
                showError("No account found. Please check your email or sign up.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#2F7A31] via-[#4A9B4B] to-[#1D1F1F] px-4 py-12 sm:py-16">
            {/* Ambient background */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#88B73B]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#FFB829]/25 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <Leaf className="pointer-events-none absolute left-[12%] top-28 h-10 w-10 rotate-12 text-white/15" />
            <Leaf className="pointer-events-none absolute -rotate-45 bottom-24 right-[10%] h-14 w-14 text-white/10" />

            <div className="glass-card relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-2">
                {/* Brand panel */}
                <div className="hidden flex-col justify-between bg-gradient-to-br from-[#2F7A31] to-[#1D1F1F] p-10 text-white lg:flex">
                    <div>
                        <span className="inline-flex">
                            <SvgComponent />
                        </span>
                        <h2 className="mt-8 text-3xl font-extrabold leading-tight text-white">
                            Live Greener,
                            <br />
                            <span className="text-[#FFB829]">Bloom Brighter.</span>
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-white/85">
                            Join thousands making everyday swaps that plant trees, cut plastic,
                            and keep the planet blooming.
                        </p>
                    </div>

                    <ul className="mt-10 space-y-4 text-sm text-white/90">
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <Leaf className="h-4 w-4" />
                            </span>
                            100% plastic-free products
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <Truck className="h-4 w-4" />
                            </span>
                            Carbon-neutral delivery
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <ShieldCheck className="h-4 w-4" />
                            </span>
                            Secure, protected account
                        </li>
                    </ul>

                    <div className="glass-chip mt-10 w-fit">
                        <Star className="h-3.5 w-3.5 text-[#FFB829]" />
                        4.8/5 from 2,000+ happy customers
                    </div>
                </div>

                {/* Form panel */}
                <div className="p-7 sm:p-10">
                    <div className="mb-6 flex justify-center lg:hidden">
                        <SvgComponent />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-color-text opacity-70">
                        Welcome back
                    </p>
                    <h1 className="mt-2 text-2xl font-extrabold text-color-text sm:text-3xl">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-sm text-color-text opacity-75">
                        Good to see you again &mdash; your plants missed you.
                    </p>

                    <form onSubmit={handleLogin} noValidate className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="login-email"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-color-text opacity-70"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="glass-input glass-input-icon"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="login-password"
                                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-color-text opacity-70"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input glass-input-icon glass-input-eye"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-color-text opacity-60 transition-opacity hover:opacity-100"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-glass-solid w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-color-text opacity-80">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold hover:underline"
                            style={{ color: "var(--primary-color)" }}
                        >
                            Sign up
                        </Link>
                    </p>
                    <p className="mt-3 text-center text-xs text-color-text opacity-60">
                        <Link to="/" className="hover:underline">
                            Back to store
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
