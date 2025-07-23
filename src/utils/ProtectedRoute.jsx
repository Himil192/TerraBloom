// // src/utils/ProtectedRoute.js
// import { Navigate } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../firebase";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//     const [user, loading] = useAuthState(auth);
//     const [role, setRole] = useState(null);
//     const [checkingRole, setCheckingRole] = useState(true);

//     useEffect(() => {
//         const fetchRole = async () => {
//             if (user) {
//                 const userRef = doc(db, "users", user.uid);
//                 const userSnap = await getDoc(userRef);
//                 if (userSnap.exists()) {
//                     setRole(userSnap.data().role);
//                 }
//             }
//             setCheckingRole(false);
//         };
//         fetchRole();
//     }, [user]);

//     if (loading || checkingRole) return <p>Loading...</p>;

//     if (!user) return <Navigate to="/login" replace />;

//     if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//         // Redirect if role is not allowed
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;
// src/utils/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState(localStorage.getItem("role")); // use cached role
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const fetchedRole = userSnap.data().role;
                    setRole(fetchedRole);
                    localStorage.setItem("role", fetchedRole); // keep localStorage updated
                }
            }
            setCheckingRole(false);
        };

        fetchRole();
    }, [user]);

    // ✅ Handle initial state
    const token = localStorage.getItem("token");
    const localRole = localStorage.getItem("role");

    if (loading || checkingRole) return <p>Loading...</p>;

    // ✅ If not logged in by Firebase or token is missing, redirect to login
    if (!user && !token) return <Navigate to="/login" replace />;

    // ✅ If role is not allowed, show unauthorized page
    if (allowedRoles.length > 0 && !allowedRoles.includes(role || localRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
