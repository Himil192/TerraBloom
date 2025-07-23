// // src/utils/loginWithRole.js
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";

// export const loginWithRole = async (email, password) => {
//     // Sign in using Firebase Auth
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Get user document from Firestore
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//         const data = docSnap.data();
//         const role = data.role || "user"; // default fallback role

//         return { user, role };
//     } else {
//         throw new Error("User document not found in Firestore");
//     }
// };


// src/utils/loginWithRole.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const loginWithRole = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        throw new Error("User profile not found in database.");
    }

    const userData = userDoc.data();
    return { user, role: userData.role };
};
