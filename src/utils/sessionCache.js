// src/utils/sessionCache.js
// -----------------------------------------------------------------------------
// Non-authoritative client-side session cache (role/uid/token).
//
// SECURITY NOTE:
// Nothing stored here is EVER a source of truth for authentication or
// authorization. Firebase Auth owns the real session and Firestore security
// rules (firestore.rules) own the real authorization. These values only power
// small UI conveniences (avatars, display names). The raw Firebase ID token is
// deliberately NOT cached here - keeping it out of localStorage removes an
// XSS-exfiltration attack surface.
// -----------------------------------------------------------------------------

const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const UID_KEY = "uid";
// Shopping state is device-local; wiping it on logout keeps a shared/borrowed
// computer from showing the previous user's cart, wishlist and history.
const CART_KEY = "terrabloom_cart_v1";
const WISHLIST_KEY = "terrabloom_wishlist_v1";
const RECENT_KEY = "terrabloom_recent_v1";

/** Remove all locally-cached session values. Safe to call at any time. */
export const clearSessionCache = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(UID_KEY);
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(WISHLIST_KEY);
        localStorage.removeItem(RECENT_KEY);
    } catch {
        // localStorage unavailable (private mode, storage quota, ...) - nothing to do
    }
};

/** Cache the user's role for quick UI display only (not for authorization). */
export const cacheRole = (role) => {
    try {
        localStorage.setItem(ROLE_KEY, role);
    } catch {
        /* ignore */
    }
};

/** Cache the user's uid for convenience reads (profile pages, etc.). */
export const cacheUid = (uid) => {
    try {
        localStorage.setItem(UID_KEY, uid);
    } catch {
        /* ignore */
    }
};