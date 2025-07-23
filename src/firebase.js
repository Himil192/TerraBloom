// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBX71tJD-MR8RmjPzeOXQg-ehG6erc9MHo",
    authDomain: "terrabloom-8dc91.firebaseapp.com",
    projectId: "terrabloom-8dc91",
    storageBucket: "terrabloom-8dc91.firebasestorage.app",
    messagingSenderId: "26575249592",
    appId: "1:26575249592:web:ef474f2f317cef8254d44d",
    measurementId: "G-L4PV57QJJ0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };
export default app;