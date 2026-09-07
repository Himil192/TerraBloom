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
/**
 * Checkout - called by the cart flow.
 *
 * Generates a human-readable order number of the form "TB-<timestamp>-<uid-suffix>"
 * here so that EVERY order — whether from real checkout or seed data — speaks the
 * same language across Admin/Orders, UserDashboard and OrderSuccess.
 *
 * Per /firestore.rules: a signed-in user may only create orders where
 * userId == auth.uid, with the fields whitelisted (orderNumber, userId,
 * customerName, customerEmail, items, subtotal, tax, total, status) and
 * status forced to "Processing". The Admin Orders page re-verifies line
 * prices against live product docs at display time.
 */
export const createOrder = async (orderData) => {
    const newRef = doc(ref());
    const now = Date.now();
    const uidSuffix = orderData.userId
        ? String(orderData.userId).slice(-5)
        : String(now).slice(-5);
    const orderNumber = `TB-${now}-${uidSuffix}`;

    await setDoc(newRef, {
        ...orderData,
        orderNumber,
        createdAt: serverTimestamp(),
    });
    // Return the full normalized shape, including the doc id.
    const snap = await getDoc(newRef);
    return snap.exists() ? mapOrder(snap) : { ...orderData, orderNumber, id: newRef.id };
};

/** Normalize a seed order (or any incoming record) into the live contract so that
 *  legacy seed data and real checkout orders render identically everywhere. */
export const normalizeOrder = (o) => ({
    ...o,
    orderNumber: o.orderNumber || (o.id && `ORD-${o.id}`) || "Pending",
    customerName: o.customerName || o.customer || "Unknown",
    customerEmail: o.customerEmail || o.email || "",
    items: Array.isArray(o.items)
        ? o.items
        : Array.isArray(o.products)
        ? o.products
        : [],
});

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