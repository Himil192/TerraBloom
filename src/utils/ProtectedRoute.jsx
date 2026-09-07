// src/utils/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import EcoSpinner from "../component/ui/EcoSpinner";
import { cacheRole } from "./sessionCache";

/**
 * Route guard used by admin/user dashboards.
 *
 * SECURITY NOTES (fail-closed):
 * - The ONLY source of truth for "who am I" is the Firebase Auth session.
 *   localStorage token/role values are NEVER trusted for authorization.
 * - The role used here is fetched FRESH from Firestore on every protected
 *   route load. Missing user doc, missing role, or a network error => DENY.
 * - This guard is UX + defence-in-depth. The real wall is the Firestore
 *   security rules (see /firestore.rules) which are enforced server-side.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchRole = async () => {
            try {
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const fetchedRole = userSnap.data().role;
                        if (typeof fetchedRole === "string" && fetchedRole) {
                            setRole(fetchedRole);
                            cacheRole(fetchedRole); // display cache only
                            return;
                        }
                    }
                    // User doc missing or role missing/invalid => deny (fail-closed)
                    setRole(null);
                } else {
                    setRole(null);
                }
            } catch {
                // Network/permission error => deny rather than allow (fail-closed)
                setRole(null);
            } finally {
                if (!cancelled) setCheckingRole(false);
            }
        };

        fetchRole();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (loading || checkingRole) return <EcoSpinner />;

    // AUTH - must be a genuine Firebase-authenticated session.
    if (!user) return <Navigate to="/login" replace />;

    // AUTHORIZATION (fail-closed) - role must come from Firestore, not storage.
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;