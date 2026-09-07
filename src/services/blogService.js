// src/services/blogService.js
// -----------------------------------------------------------------------------
// Blog data service - FIRESTORE BACKED.
// Reads/writes the `blogs` collection live. Security is enforced server-side
// by /firestore.rules (public read, admin-only writes).
// -----------------------------------------------------------------------------
import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ref = () => collection(db, "blogs");

// NOTE: id MUST come after the spread - seeded docs contain a legacy numeric
// `id` field that would otherwise shadow the real Firestore document ID.
const mapBlog = (snap) => ({ ...snap.data(), id: snap.id });

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

export const getAllBlogs = async () => {
    const snap = await getDocs(ref());
    return snap.docs.map(mapBlog).sort(byCreatedAt);
};

export const getBlogById = async (id) => {
    const snap = await getDoc(doc(db, "blogs", String(id)));
    return snap.exists() ? mapBlog(snap) : null;
};

export const createBlog = async (data) => {
    const newRef = doc(ref());
    await setDoc(newRef, { ...data, createdAt: serverTimestamp() });
    return { ...data, id: newRef.id };
};

export const updateBlog = async (id, data) => {
    const blogRef = doc(db, "blogs", String(id));
    await setDoc(blogRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return getBlogById(id);
};

export const deleteBlog = async (id) => {
    await deleteDoc(doc(db, "blogs", String(id)));
};