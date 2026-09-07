// src/services/settingsService.js
// -----------------------------------------------------------------------------
// Lightweight store-settings service. Persists to localStorage so admin
// preferences survive reloads locally. These are non-sensitive UI preferences
// (NOT credentials) - safe for localStorage. Will move to Firestore `settings`
// in the Phase 6 migration.
// -----------------------------------------------------------------------------

const KEY = "terrabloom-store-settings";

const DEFAULT_SETTINGS = {
    storeName: "TerraBloom",
    supportEmail: "support@terrabloom.com",
    phone: "+91 98765 43210",
    address: "Green Retail Hub, Bengaluru 560001",
    currency: "₹",
    taxRate: "18",
};

const merge = (saved) => ({ ...DEFAULT_SETTINGS, ...(saved || {}) });

export const getSettings = () => {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? merge(JSON.parse(raw)) : merge(null);
    } catch {
        return merge(null);
    }
};

export const saveSettings = (settings) => {
    const next = merge(settings);
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        /* storage unavailable - settings stay in-memory for the session */
    }
    return next;
};