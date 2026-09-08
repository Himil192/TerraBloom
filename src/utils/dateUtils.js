// Shared, crash-proof date helpers.
// Firestore Timestamps often reach the UI either as real Timestamp objects or
// as plain { seconds, nanoseconds } objects (e.g. after a JSON round-trip).
// Rendering either directly crashes React with:
//   "Objects are not valid as a React child (found: object with keys {seconds, nanoseconds})"
// These helpers convert every supported shape to a JS Date before formatting.

export const toJsDate = (value) => {
    try {
        if (!value) return null;
        // Real Firestore Timestamp (has .toDate())
        if (typeof value.toDate === "function") return value.toDate();
        // JSON-serialized Timestamp ({ seconds, nanoseconds })
        if (typeof value === "object" && typeof value.seconds === "number") {
            return new Date(
                value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6)
            );
        }
        // JS Date, epoch millis, or parseable date string
        const d = value instanceof Date ? value : new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
};

/**
 * Format any date-ish value for display.
 * @param {*} value  Firestore Timestamp | {seconds, nanoseconds} | Date | number | string
 * @param {object} [opts]  Intl options, defaults to "15 Jan 2024"
 * @param {string} [locale] defaults to "en-IN"
 */
export const formatDate = (value, opts, locale = "en-IN") => {
    const d = toJsDate(value);
    if (d) {
        try {
            return d.toLocaleDateString(
                locale,
                opts || { day: "numeric", month: "short", year: "numeric" }
            );
        } catch {
            // Invalid Intl options (e.g. day: "short" throws RangeError) -
            // degrade to a safe format instead of crashing the page.
            try {
                return d.toLocaleDateString(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
            } catch {
                return d.toISOString().slice(0, 10);
            }
        }
    }
    // Unparseable - fall back to the raw string if the backend stored one,
    // otherwise show an em dash instead of crashing.
    return typeof value === "string" && value.trim() ? value : "—";
};