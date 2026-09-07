// src/context/CartContext.jsx
/* eslint-disable react-refresh/only-export-components -- cart helpers/shipping utils are consumed together with the provider by design */
// -----------------------------------------------------------------------------
// Cart state for the storefront. Items persist to localStorage (product ids,
// snapshot title/price/image, qty) so a refresh keeps the cart. Security note:
// the cart is CLIENT-SIDE CONVENIENCE ONLY - it never decides prices. Firestore
// rules + admin price re-verification are the enforcement layer (see
// firestore.rules /orders).
// -----------------------------------------------------------------------------
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "terrabloom_cart_v1";

export const SHIPPING_FREE_OVER = 999; // free shipping above this subtotal (₹)
export const SHIPPING_FLAT = 49; // flat shipping fee otherwise (₹)

export const computeShipping = (subtotal) =>
    subtotal >= SHIPPING_FREE_OVER || subtotal === 0 ? 0 : SHIPPING_FLAT;

const loadCart = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const clampQty = (qty) => Math.max(1, Math.min(99, Math.floor(Number(qty)) || 1));

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* storage unavailable (private mode / quota) - cart stays in memory */
        }
    }, [items]);

    const addItem = (product, qty = 1) => {
        setItems((prev) => {
            const wanted = clampQty(qty);
            const stockCap = product.stock !== undefined && product.stock > 0 ? product.stock : wanted;
            const capped = Math.min(wanted, stockCap);
            const existing = prev.find((i) => i.productId === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.productId === product.id ? { ...i, qty: Math.min(99, i.qty + capped) } : i
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    title: product.title,
                    price: Number(product.price) || 0,
                    image: product.image || "",
                    qty: capped,
                },
            ];
        });
    };

    const removeItem = (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId));

    const setQty = (productId, qty) =>
        setItems((prev) =>
            prev.map((i) => (i.productId === productId ? { ...i, qty: clampQty(qty) } : i))
        );

    const clearCart = () => setItems([]);

    const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
    const subtotal = useMemo(() => items.reduce((n, i) => n + i.qty * i.price, 0), [items]);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, setQty, clearCart, count, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
};