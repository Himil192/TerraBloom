// src/services/settingsService.js
// -----------------------------------------------------------------------------
// Store settings service - FIRESTORE BACKED with a localStorage cache.
// Reads the `settings/store` doc (public read per rules) and writes it back as
// an admin. Non-sensitive store preferences only - credentials never touch
// localStorage.
// -----------------------------------------------------------------------------
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const KEY = "terrabloom-store-settings";
const SETTINGS_DOC = "store";

const DEFAULT_SETTINGS = {
    storeName: "TerraBloom",
    supportEmail: "support@terrabloom.com",
    phone: "+91 98765 43210",
    address: "Green Retail Hub, Bengaluru 560001",
    currency: "₹",
    taxRate: "18",
};

const merge = (saved) => ({ ...DEFAULT_SETTINGS, ...(saved || {}) });

const fromLocalCache = () => {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? merge(JSON.parse(raw)) : merge(null);
    } catch {
        return merge(null);
    }
};

export const getSettings = async () => {
    // Prefer the Firestore doc, fall back to the local cache / defaults.
    try {
        const snap = await getDoc(doc(db, "settings", SETTINGS_DOC));
        if (snap.exists()) return merge(snap.data());
    } catch (error) {
        console.error("Settings read from Firestore failed, using local cache:", error);
    }
    return fromLocalCache();
};

export const saveSettings = async (settings) => {
    const next = merge(settings);
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        /* storage unavailable */
    }
    try {
        await setDoc(doc(db, "settings", SETTINGS_DOC), next, { merge: true });
    } catch (error) {
        console.error("Failed to persist settings to Firestore:", error);
    }
    return next;
};