// utils/signupWithRole.js
import { auth, db } from "../firebase"; // adjust if your path is different
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { showSuccess, showError } from "./toastUtils";

// Add navigate support (you'll need to pass it from Signup.jsx)
export const signUpWithRole = async (email, password, fullName, phone, address, navigate) => {
    try {
        // Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            fullName,
            email,
            phone,
            address,
            role: "user", // default role
            createdAt: new Date(),
        });

        // Optional: confirm role saved
        const snapshot = await getDoc(userRef);
        const role = snapshot.data()?.role;

        showSuccess("Signup successful! Redirecting...");

        // Redirect based on role
        if (role === "admin") {
            navigate("/admin-dashboard");
        } else {
            navigate("/user-dashboard");
        }
    } catch (error) {
        throw error;
    }
};
