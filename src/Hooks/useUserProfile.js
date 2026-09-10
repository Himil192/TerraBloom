import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { showError, showSuccess } from "../utils/toastUtils";

/**
 * Shared profile-data hook for the Profile page cards.
 *
 * Loads users/{uid} for the signed-in account (no stale localStorage uid),
 * exposes retry on failure, and saveFields() which patches the doc, merges
 * the result into local state immediately (UI reflects the change without a
 * re-read) and toasts the outcome. Firestore rules still enforce that a user
 * can only update their OWN doc and that `role` never changes.
 */
export default function useUserProfile() {
    const [data, setData] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [uid, setUid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setError(null);

            if (!user) {
                setAuthUser(null);
                setUid(null);
                setData(null);
                setLoading(false);
                return;
            }

            setAuthUser(user);
            setUid(user.uid);
            setLoading(true);

            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                setData(snap.exists() ? snap.data() : null);
                if (!snap.exists()) {
                    setError("We couldn't find your profile document.");
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError("Failed to load your profile.");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [reloadKey]);

    const retry = useCallback(() => setReloadKey((k) => k + 1), []);

    /**
     * Patch the signed-in user's doc with the given fields.
     * @param {object} partial field:value pairs (Firestore keys, e.g. `firstname`)
     * @param {string} label human name of the section, for the toast
     * @returns {boolean} true when the write succeeded
     */
    const saveFields = useCallback(
        async (partial, label = "Profile") => {
            if (!uid) return false;

            try {
                await updateDoc(doc(db, "users", uid), partial);
                setData((prev) => ({ ...(prev || {}), ...partial }));
                showSuccess(`${label} updated successfully.`);
                return true;
            } catch (err) {
                console.error(`Failed to update ${label}:`, err);
                showError(`Couldn't save your ${label.toLowerCase()}. Please try again.`);
                return false;
            }
        },
        [uid]
    );

    return { data, authUser, uid, loading, error, retry, saveFields };
}
