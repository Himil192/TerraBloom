// src/services/orderService.js
// -----------------------------------------------------------------------------
// Order data service.
// Pass 1: in-memory CRUD over seed orders (src/data/orders.js). The storefront
//         checkout doesn't exist yet, so this is sample data for the admin UI.
// Pass 2: swap the internals for Firestore (orders collection). The public API
//         below is the only thing the UI depends on.
// -----------------------------------------------------------------------------
import { seedOrders } from "../data/orders";

const cloneOrder = (order) => ({
    ...order,
    items: Array.isArray(order.items) ? order.items.map((item) => ({ ...item })) : [],
});

let orders = seedOrders.map(cloneOrder);

export const getAllOrders = () => orders.map(cloneOrder);

export const getOrderById = (id) => {
    const found = orders.find((order) => order.id === String(id));
    return found ? cloneOrder(found) : null;
};

export const updateOrderStatus = (id, status) => {
    const index = orders.findIndex((order) => order.id === String(id));
    if (index === -1) return null;
    orders[index] = { ...orders[index], status };
    return cloneOrder(orders[index]);
};