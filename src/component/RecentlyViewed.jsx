import { useEffect, useState } from "react";
import ProductCard from "./ProductCards";

const RECENT_KEY = "terrabloom_recent_v1";
const MAX_ITEMS = 8;

/** Snapshot a product into the recently-viewed list (dedup, newest first). */
export const recordRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const clean = Array.isArray(list) ? list.filter((p) => p && p.id !== product.id) : [];
        const snapshot = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            rating: product.rating,
        };
        localStorage.setItem(RECENT_KEY, JSON.stringify([snapshot, ...clean].slice(0, MAX_ITEMS)));
    } catch {
        /* storage unavailable - recently-viewed is a nice-to-have, never fail */
    }
};

// "Recently viewed" strip for the homepage. Renders nothing for new visitors.
const RecentlyViewed = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(RECENT_KEY);
            const list = raw ? JSON.parse(raw) : [];
            setItems(Array.isArray(list) ? list.filter((p) => p && p.id) : []);
        } catch {
            setItems([]);
        }
    }, []);

    if (items.length === 0) return null;
    return (
        <section className="bg-color-background py-16 text-color-text">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Recently Viewed</h2>
                <p className="mb-8 opacity-70">Pick up where you left off.</p>
                <div className="flex flex-wrap gap-6">
                    {items.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;