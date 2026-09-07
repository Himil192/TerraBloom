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
    setDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ref = () => collection(db, "orders");

// NOTE: id MUST come after the spread - seeded docs may contain a legacy
// numeric `id` field that would otherwise shadow the real Firestore document ID.
const mapOrder = (snap) => ({ ...snap.data(), id: snap.id });

// Newest first - admins care about the latest activity. Used by both the
// admin Orders list and the user's own "My orders" list.
const byCreatedAtDesc = (a, b) => {
    const at = (x) => {
        try {
            return (x.createdAt?.toDate?.() || new Date(0)).getTime();
        } catch {
            return 0;
        }
    };
    return at(b) - at(a);
};

export const getAllOrders = async () => {
    const snap = await getDocs(ref());
    return snap.docs.map(mapOrder).sort(byCreatedAtDesc);
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

// Checkout - called by the cart flow. Per firestore.rules the caller may only
// create orders where userId == their own uid, with a validated shape; the
// admin Orders page re-verifies line prices against live product docs.
export const createOrder = async (orderData) => {
    const newRef = doc(ref());
    await setDoc(newRef, { ...orderData, createdAt: serverTimestamp() });
    return newRef.id;
};

// "My orders" - returns ONLY the signed-in user's own orders. The security
// rules require userId == auth.uid on every matched document, so this query
// can never leak another user's orders even if the client is tampered with.
export const getOrdersByUser = async (uid) => {
    const snap = await getDocs(query(ref(), where("userId", "==", uid)));
    return snap.docs.map(mapOrder).sort(byCreatedAtDesc);
};

// Verified Purchase check (reviews) - reads ONLY the caller's own orders.
// The rules force userId == auth.uid on every matched document, so this can
// never leak or even inspect another user's purchase history.
export const userPurchasedProduct = async (uid, productId) => {
    try {
        const orders = await getOrdersByUser(uid);
        return orders.some((o) =>
            (o.items || []).some((it) => String(it.productId) === String(productId))
        );
    } catch {
        return false;
    }
};