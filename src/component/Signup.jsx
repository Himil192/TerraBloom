import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithRole } from "../utils/signupWithRole";
import { showSuccess, showError } from "../utils/toastUtils";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    MapPin,
    Leaf,
    Truck,
    ShieldCheck,
    Star,
    Loader2,
    ArrowRight,
} from "lucide-react";
import SvgComponent from "./SvgComponent";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password || !confirmPassword || !fullName || !phone || !address) {
            showError("Please fill in all fields.");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError("Invalid email format.");
            return false;
        }
        if (password.length < 6) {
            showError("Password must be at least 6 characters.");
            return false;
        }
        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            showError("Phone must be a 10-digit number.");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await signUpWithRole(email, password, fullName, phone, address, navigate);
            showSuccess("Signup successful!");
        } catch (error) {
            console.error("Signup error:", error);
            if (error.code === "auth/email-already-in-use") {
                showError("This email is already registered.");
            } else if (error.code === "auth/weak-password") {
                showError("Password should be at least 6 characters.");
            } else if (error.code === "auth/invalid-email") {
                showError("Invalid email address.");
            } else if (error.message.includes("Phone number already registered")) {
                showError("Phone number is already in use.");
            } else if (error.message.includes("Missing or insufficient permissions")) {
                showError("Permission denied. Contact admin.");
            } else {
                showError("Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#2F7A31] via-[#4A9B4B] to-[#1D1F1F] px-4 py-12 sm:py-16">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#88B73B]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#FFB829]/25 blur-3xl" />
            <div className="pointer-events-none absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <Leaf className="pointer-events-none absolute right-[12%] top-24 h-10 w-10 -rotate-12 text-white/15" />
            <Leaf className="pointer-events-none absolute bottom-20 left-[8%] h-14 w-14 rotate-45 text-white/10" />

            <div className="glass-card relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2rem] lg:grid-cols-2">
                <div className="hidden flex-col justify-between bg-gradient-to-br from-[#2F7A31] to-[#1D1F1F] p-10 text-white lg:flex">
                    <div>
                        <span className="inline-flex">
                            <SvgComponent />
                        </span>
                        <h2 className="mt-8 text-3xl font-extrabold leading-tight text-white">
                            Grow with us,
                            <br />
                            <span className="text-[#FFB829]">one swap at a time.</span>
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-white/85">
                            Create your account and start a habit that plants trees,
                            removes plastic, and keeps the planet blooming.
                        </p>
                    </div>
                    <ul className="mt-10 space-y-4 text-sm text-white/90">
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <Truck className="h-4 w-4" />
                            </span>
                            Free eco delivery over {"\u20B9"}499
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <Leaf className="h-4 w-4" />
                            </span>
                            1% of every order gives back
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                                <ShieldCheck className="h-4 w-4" />
                            </span>
                            Your data stays private
                        </li>
                    </ul>
                    <div className="glass-chip mt-10 w-fit">
                        <Star className="h-3.5 w-3.5 text-[#FFB829]" />
                        10,000+ happy plant parents
                    </div>
                </div>

                <div className="p-7 sm:p-10">
                    <div className="mb-6 flex justify-center lg:hidden">
                        <SvgComponent />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-color-text opacity-70">Join the movement</p>
                    <h1 className="mt-2 text-2xl font-extrabold text-color-text sm:text-3xl">Create your account</h1>
                    <p className="mt-2 text-sm text-color-text opacity-75">Thirty seconds now, a greener habit forever.</p>

                    <form onSubmit={handleSignup} noValidate className="mt-8 space-y-4">
                        <div className="relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type="text" placeholder="Full Name" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass-input glass-input-icon" />
                        </div>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type="email" placeholder="Email address" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input glass-input-icon" />
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type={showPassword ? "text" : "password"} placeholder="Password (min 6 characters)" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input glass-input-icon glass-input-eye" />
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-color-text opacity-60 transition-opacity hover:opacity-100" aria-label={showPassword ? "Hide passwords" : "Show passwords"} tabIndex={-1}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="glass-input glass-input-icon" />
                        </div>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type="tel" placeholder="Phone Number (10 digits)" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="glass-input glass-input-icon" />
                        </div>
                        <div className="relative">
                            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-color-text opacity-50" />
                            <input type="text" placeholder="Delivery Address" autoComplete="street-address" required value={address} onChange={(e) => setAddress(e.target.value)} className="glass-input glass-input-icon" />
                        </div>

                        <button type="submit" disabled={loading} className="btn-glass-solid w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-color-text opacity-80">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--primary-color)" }}>
                            Sign in
                        </Link>
                    </p>
                    <p className="mt-3 text-center text-xs text-color-text opacity-60">
                        <Link to="/" className="hover:underline">Back to store</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
