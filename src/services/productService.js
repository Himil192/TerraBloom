// src/services/productService.js
// -----------------------------------------------------------------------------
// Product data service.
// Pass 1: in-memory CRUD over the static catalog (src/data/products.js).
//         Admin edits live for the current session only.
// Pass 2: swap the internals for Firestore (products collection). The public
//         API below is intentionally the ONLY thing the UI depends on, so the
//         migration will not touch any page component.
// -----------------------------------------------------------------------------
import { products as seedProducts } from "../data/products";

let products = seedProducts.map((p) => ({ ...p }));
let nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;

export const getAllProducts = () => products.map((p) => ({ ...p }));

export const getProductById = (id) => {
    const found = products.find((p) => p.id === Number(id));
    return found ? { ...found } : null;
};

export const createProduct = (data) => {
    const product = {
        id: nextId,
        image: data.image || "/FeatureProducts/BambooBrush.jpg",
        title: (data.title || "").trim(),
        price: Number(data.price) || 0,
        description: (data.description || "").trim(),
        rating: Number(data.rating) || 4.5,
        stock: Number(data.stock) || 0,
        status: data.status === "inactive" ? "inactive" : "active",
    };
    nextId += 1;
    products.push(product);
    return { ...product };
};

export const updateProduct = (id, data) => {
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id: Number(id) };
    return { ...products[index] };
};

export const deleteProduct = (id) => {
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
};