// src/services/productService.js
// -----------------------------------------------------------------------------
// Product data service - FIRESTORE BACKED.
// Reads/writes the `products` collection live. Security is enforced server-side
// by /firestore.rules (public read, admin-only writes) - the client never
// trusts its own role for these operations.
// -----------------------------------------------------------------------------
import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ref = () => collection(db, "products");

const mapProduct = (snap) => ({ id: snap.id, ...snap.data() });

const byCreatedAt = (a, b) => {
    const at = (x) => {
        try {
            return (x.createdAt?.toDate?.() || new Date(0)).getTime();
        } catch {
            return 0;
        }
    };
    return at(a) - at(b);
};

export const getAllProducts = async () => {
    const snap = await getDocs(ref());
    return snap.docs.map(mapProduct).sort(byCreatedAt);
};

export const getProductById = async (id) => {
    const snap = await getDoc(doc(db, "products", String(id)));
    return snap.exists() ? mapProduct(snap) : null;
};

export const createProduct = async (data) => {
    const newRef = doc(ref());
    await setDoc(newRef, { ...data, createdAt: serverTimestamp() });
    return { id: newRef.id, ...data };
};

export const updateProduct = async (id, data) => {
    const productRef = doc(db, "products", String(id));
    await updateDoc(productRef, { ...data, updatedAt: serverTimestamp() });
    return getProductById(id);
};

export const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", String(id)));
};