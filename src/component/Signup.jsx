// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signUpWithRole } from "../utils/signupWithRole";
// import { showSuccess, showError } from "../utils/toastUtils";

// const Signup = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [fullName, setFullName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [address, setAddress] = useState("");
//     const navigate = useNavigate();

//     const validateForm = () => {
//         if (!email || !password || !fullName || !phone || !address) {
//             showError("Please fill in all fields.");
//             return false;
//         }

//         if (!/^\S+@\S+\.\S+$/.test(email)) {
//             showError("Invalid email format.");
//             return false;
//         }

//         if (password.length < 6) {
//             showError("Password must be at least 6 characters.");
//             return false;
//         }

//         if (!/^\d{10}$/.test(phone)) {
//             showError("Phone must be a 10-digit number.");
//             return false;
//         }

//         return true;
//     };

//     const handleSignup = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         try {
//             await signUpWithRole(email, password, fullName, phone, address);
//             showSuccess("Signup successful! 🎉");
//             navigate("/login");
//         } catch (error) {
//             console.error("Signup error:", error);
//             if (error.code === "auth/email-already-in-use") {
//                 showError("This email is already registered.");
//             } else if (error.code === "auth/weak-password") {
//                 showError("Password should be at least 6 characters.");
//             } else if (error.code === "auth/invalid-email") {
//                 showError("Invalid email address.");
//             } else if (error.message.includes("Phone number already registered")) {
//                 showError("Phone number is already in use.");
//             } else if (error.message.includes("Missing or insufficient permissions")) {
//                 showError("Permission denied. Contact admin.");
//             } else {
//                 showError("Signup failed. Please try again.");
//             }
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

//                 <input type="text" placeholder="Full Name" className="w-full mb-3 p-2 border rounded"
//                     value={fullName} onChange={(e) => setFullName(e.target.value)} />

//                 <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded"
//                     value={email} onChange={(e) => setEmail(e.target.value)} />

//                 <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded" autoComplete="current-password"
//                     value={password} onChange={(e) => setPassword(e.target.value)} />

//                 <input type="text" placeholder="Phone Number" className="w-full mb-3 p-2 border rounded"
//                     value={phone} onChange={(e) => setPhone(e.target.value)} />

//                 <input type="text" placeholder="Address" className="w-full mb-3 p-2 border rounded"
//                     value={address} onChange={(e) => setAddress(e.target.value)} />

//                 <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-full w-full">
//                     Create Account
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Signup;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithRole } from "../utils/signupWithRole";
import { showSuccess, showError } from "../utils/toastUtils";
import { Eye, EyeOff } from "lucide-react"; // uses lucide-react icons

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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

        try {
            await signUpWithRole(email, password, fullName, phone, address, navigate);
            showSuccess("Signup successful! 🎉");

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
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-700 transition"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Signup;
