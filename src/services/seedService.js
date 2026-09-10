// src/services/seedService.js
// -----------------------------------------------------------------------------
// One-time catalog seeding: writes the static sample data (src/data/*) into
// Firestore collections if (and only if) they are empty. Called from the admin
// Settings page. Admin-only in the UI, and each write is additionally gated by
// /firestore.rules (admin write on products/blogs; signed-in create on orders).
//
// Every seeded document gets a DETERMINISTIC id (slug of its title / the seed
// order number), so re-seeding overwrites the same document instead of
// creating a duplicate — even if two admins trigger a seed simultaneously.
// findDuplicates()/dedupeCatalog() clean up duplicates created by the old
// auto-id seeder.
// -----------------------------------------------------------------------------
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { products as productSeed } from "../data/products";
import { blogs as blogSeed } from "../data/blogs";
import { seedOrders } from "../data/orders";

const count = async (name) => {
    try {
        const snap = await getDocs(collection(db, name));
        return snap.size;
    } catch {
        return -1; // -1 => collection unreadable
    }
};

export const catalogStatus = async () => ({
    products: await count("products"),
    blogs: await count("blogs"),
    orders: await count("orders"),
});

/** Stable doc id from a human title: "Eco Panda Pads" -> "eco-panda-pads". */
const slugify = (title) =>
    String(title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/** Firestore write time of a document, for keep-the-oldest decisions. */
const writtenAt = (docSnap) => docSnap.get("createdAt")?.seconds || 0;

const seedIfEmpty = async (name, rows, idOf) => {
    const snap = await getDocs(collection(db, name));
    if (snap.size > 0) return 0;
    let written = 0;
    for (const row of rows) {
        // Deterministic id: a concurrent/repeated seed overwrites the same doc
        // instead of inserting a second copy.
        await setDoc(doc(db, name, idOf(row)), {
            ...row,
            createdAt: serverTimestamp(),
        });
        written += 1;
    }
    return written;
};

export const seedCatalog = async () => {
    const results = {
        products: await seedIfEmpty("products", productSeed, (p) => slugify(p.title)),
        blogs: await seedIfEmpty("blogs", blogSeed, (b) => slugify(b.title)),
        // Seed orders carry their own business id (e.g. "ORD-1001").
        orders: await seedIfEmpty("orders", seedOrders, (o) => o.id || slugify(o.customer)),
    };
    return results;
};

/** Normalized grouping key for a document title. */
const titleKey = (docSnap) =>
    String(docSnap.get("title") || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

/**
 * Scan a collection for documents sharing the same normalized title.
 * @returns {Promise<number>} how many redundant docs exist
 */
const countDuplicates = async (name) => {
    try {
        const snap = await getDocs(collection(db, name));
        const keep = new Map(); // title key -> { id, at }
        let dupes = 0;
        snap.forEach((docSnap) => {
            const key = titleKey(docSnap);
            if (!key) return;
            const existing = keep.get(key);
            if (!existing) {
                keep.set(key, { id: docSnap.id, at: writtenAt(docSnap) });
            } else {
                dupes += 1;
                if (writtenAt(docSnap) < existing.at) {
                    keep.set(key, { id: docSnap.id, at: writtenAt(docSnap) });
                }
            }
        });
        return dupes;
    } catch {
        return 0; // unreadable collection -> nothing to report
    }
};

export const findDuplicates = async () => ({
    products: await countDuplicates("products"),
    blogs: await countDuplicates("blogs"),
});

/**
 * Remove duplicate catalog documents (same normalized title), always keeping
 * the OLDEST copy. Documents with unique titles are never touched. Admin-only
 * via firestore.rules.
 * @returns {Promise<{products: number, blogs: number}>} docs removed
 */
export const dedupeCatalog = async () => {
    const removed = { products: 0, blogs: 0 };

    for (const name of ["products", "blogs"]) {
        const snap = await getDocs(collection(db, name));
        const keep = new Map(); // title key -> { id, at }
        const doomed = [];
        snap.forEach((docSnap) => {
            const key = titleKey(docSnap);
            if (!key) return;
            const existing = keep.get(key);
            if (!existing) {
                keep.set(key, { id: docSnap.id, at: writtenAt(docSnap) });
            } else if (writtenAt(docSnap) < existing.at) {
                // This doc is older than the stored keeper -> it survives instead.
                doomed.push(existing.id);
                keep.set(key, { id: docSnap.id, at: writtenAt(docSnap) });
            } else {
                doomed.push(docSnap.id);
            }
        });
        for (const id of doomed) {
            await deleteDoc(doc(db, name, id));
            removed[name] += 1;
        }
    }

    return removed;
};
