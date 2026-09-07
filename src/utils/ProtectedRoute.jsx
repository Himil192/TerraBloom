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
    // The uid the currently-held role was fetched FOR. Authorization may only
    // be evaluated when resolvedFor === user.uid - otherwise a role fetched
    // for a previous/absent session could be applied to the current one.
    const [resolvedFor, setResolvedFor] = useState(null);

    useEffect(() => {
        // While Firebase restores the session (hard refresh) user is null.
        // We deliberately WAIT here (spinner) instead of deciding - deciding
        // now would poison the state for the authenticated render that follows.
        if (!user) return undefined;

        let cancelled = false;

        const finish = (fetchedRole) => {
            setRole(typeof fetchedRole === "string" && fetchedRole ? fetchedRole : null);
            setResolvedFor(user.uid);
            setCheckingRole(false);
        };

        const fetchRole = async (attempt = 0) => {
            try {
                const userSnap = await getDoc(doc(db, "users", user.uid));
                if (cancelled) return;
                const fetchedRole = userSnap.exists() ? userSnap.data().role : null;
                if (typeof fetchedRole === "string" && fetchedRole) {
                    setRole(fetchedRole);
                    cacheRole(fetchedRole); // display cache only
                }
                finish(fetchedRole); // missing doc/role => null => deny (fail-closed)
            } catch {
                if (cancelled) return;
                // Transient token/network timing: retry ONCE, still fail-closed.
                if (attempt < 1) {
                    setTimeout(() => {
                        if (!cancelled) fetchRole(attempt + 1);
                    }, 700);
                    return;
                }
                finish(null); // network/permission error => deny rather than allow
            }
        };

        fetchRole();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (loading || checkingRole || (user && user.uid !== resolvedFor)) {
        return <EcoSpinner />;
    }

    // AUTH - must be a genuine Firebase-authenticated session.
    if (!user) return <Navigate to="/login" replace />;

    // AUTHORIZATION (fail-closed) - role must come from Firestore, not storage.
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;