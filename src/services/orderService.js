// src/services/orderService.js
// -----------------------------------------------------------------------------
// Order data service - FIRESTORE BACKED.
// Reads/writes the `orders` collection. Per /firestore.rules orders are
// admin-only for read/update and any signed-in user may create (checkout).
// -----------------------------------------------------------------------------
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ref = () => collection(db, "orders");

// NOTE: id MUST come after the spread - seeded docs may contain a legacy
// numeric `id` field that would otherwise shadow the real Firestore document ID.
const mapOrder = (snap) => ({ ...snap.data(), id: snap.id });

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

export const getAllOrders = async () => {
    const snap = await getDocs(ref());
    return snap.docs.map(mapOrder).sort(byCreatedAt);
};

export const getOrderById = async (id) => {
    const snap = await getDoc(doc(db, "orders", String(id)));
    return snap.exists() ? mapOrder(snap) : null;
};

export const updateOrderStatus = async (id, status) => {
    const orderRef = doc(db, "orders", String(id));
    await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
    return getOrderById(id);
};