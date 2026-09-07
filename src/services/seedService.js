// src/services/seedService.js
// -----------------------------------------------------------------------------
// One-time catalog seeding: writes the static sample data (src/data/*) into
// Firestore collections if (and only if) they are empty. Called from the admin
// Settings page. Admin-only in the UI, and each write is additionally gated by
// /firestore.rules (admin write on products/blogs; signed-in create on orders).
// -----------------------------------------------------------------------------
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
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

const seedIfEmpty = async (name, rows) => {
    const snap = await getDocs(collection(db, name));
    if (snap.size > 0) return 0;
    let written = 0;
    for (const row of rows) {
        await setDoc(doc(collection(db, name)), {
            ...row,
            createdAt: serverTimestamp(),
        });
        written += 1;
    }
    return written;
};

export const seedCatalog = async () => {
    const results = {
        products: await seedIfEmpty("products", productSeed),
        blogs: await seedIfEmpty("blogs", blogSeed),
        orders: await seedIfEmpty("orders", seedOrders),
    };
    return results;
};