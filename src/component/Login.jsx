import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { auth, db } from "../firebase";
import { showError, showSuccess } from "../utils/toastUtils";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                const token = await user.getIdToken();
                localStorage.setItem("token", token);
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
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-3xl font-semibold text-center text-gray-800">Sign In</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-800"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-3 rounded-lg w-full font-semibold"
                >
                    Login
                </button>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-600 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
