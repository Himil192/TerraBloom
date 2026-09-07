// src/context/WishlistContext.jsx
/* eslint-disable react-refresh/only-export-components -- the heart helper is consumed together with the provider by design */
// -----------------------------------------------------------------------------
// Wishlist state. Dual storage, deliberately simple and safe:
//  * localStorage  - always written, so GUESTS can heart products too.
//  * users/{uid}.wishlist - mirrored via updateDoc when signed in, so the
//    wishlist follows the user across devices. Firestore writes are the ONLY
//    server writes and they target the user's OWN doc (firestore.rules:
//    owner-only update, role field locked, list bounded to 50).
// Snapshots (title/price/image) are display conveniences only - never trusted
// for pricing; cart/checkout always re-verifies against live product docs.
// -----------------------------------------------------------------------------
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

const WishlistContext = createContext(null);
const STORAGE_KEY = "terrabloom_wishlist_v1";
const MAX_ITEMS = 50;

const loadLocal = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const snapshotOf = (product) => ({
    productId: product.id,
    title: product.title,
    price: Number(product.price) || 0,
    image: product.image || "",
});

export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState(loadLocal);
    const [user, setUser] = useState(null);
    // Guards the one-time remote adoption so the mirror effect doesn't push
    // the stale local list to Firestore before it has been merged.
    const adopting = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* storage unavailable - wishlist stays in memory */
        }
    }, [items]);

    useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

    // Adopt the remote wishlist once per session (merge: remote first, then
    // any local-only items the user hearted while signed out).
    useEffect(() => {
        let cancelled = false;
        if (!user) return undefined;
        (async () => {
            adopting.current = true;
            try {
                const snap = await getDoc(doc(db, "users", user.uid));
                if (cancelled) return;
                const remote = snap.data()?.wishlist;
                if (Array.isArray(remote) && remote.length) {
                    setItems((local) => {
                        const seen = new Set(remote.map((i) => i.productId));
                        return [...remote, ...local.filter((i) => !seen.has(i.productId))].slice(0, MAX_ITEMS);
                    });
                }
            } catch {
                /* offline / rules denial - stay local-only */
            } finally {
                if (!cancelled) adopting.current = false;
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [user]);

    // Mirror every change to the user's own profile doc (fire-and-forget).
    useEffect(() => {
        if (!user || adopting.current) return;
        updateDoc(doc(db, "users", user.uid), { wishlist: items.slice(0, MAX_ITEMS) }).catch(() => {
            /* best-effort sync - local copy is already authoritative for this device */
        });
    }, [items, user]);

    const toggle = (product) =>
        setItems((prev) => {
            const exists = prev.some((i) => i.productId === product.id);
            if (exists) return prev.filter((i) => i.productId !== product.id);
            return [...prev, snapshotOf(product)].slice(0, MAX_ITEMS);
        });

    const remove = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId));
    const clear = () => setItems([]);
    const has = (productId) => items.some((i) => i.productId === productId);

    return (
        <WishlistContext.Provider value={{ items, toggle, remove, clear, has }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
    return ctx;
};