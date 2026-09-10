// src/services/reviewService.js
// -----------------------------------------------------------------------------
// Review data service - FIRESTORE BACKED (products/{id}/reviews subcollection).
// Genuine customer reviews: anyone can read; signed-in users may write a
// review AS THEMSELVES only (enforced server-side by /firestore.rules),
// authors may delete their own review, admins moderate.
// The live average is computed from these docs at read time - there is NO
// writable rating aggregate on the product doc that could be abused.
// -----------------------------------------------------------------------------
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    orderBy,
    query,
    limit,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const MAX_REVIEWS = 100; // bound reads - free-tier friendly

const reviewsRef = (productId) =>
    collection(db, "products", String(productId), "reviews");

const mapReview = (snap) => ({ ...snap.data(), id: snap.id });

export const getReviews = async (productId) => {
    try {
        const snap = await getDocs(
            query(reviewsRef(productId), orderBy("createdAt", "desc"), limit(MAX_REVIEWS))
        );
        return snap.docs.map(mapReview).sort((a, b) => {
            const at = (x) => {
                try {
                    return (x.createdAt?.toDate?.() || new Date(0)).getTime();
                } catch {
                    return 0;
                }
            };
            return at(b) - at(a);
        });
    } catch (error) {
        // A hiccup here must never break the product page.
        console.error("Error loading reviews:", error);
        return [];
    }
};

export const addReview = async (productId, { uid, userName, rating, text, verified }) => {
    const data = {
        uid: String(uid),
        userName: String(userName).trim().slice(0, 80),
        rating: Math.round(Number(rating)),
        text: String(text).trim().slice(0, 1000),
        verified: Boolean(verified),
        createdAt: serverTimestamp(),
    };
    // The review doc ID IS the author's uid - "one review per user per
    // product" is then enforced by Firestore itself (not just the UI), and
    // the rules require reviewId == request.auth.uid on create.
    const reviewDoc = doc(reviewsRef(productId), String(uid));
    await setDoc(reviewDoc, data);
    return { ...data, id: String(uid) };
};

export const deleteReview = async (productId, reviewId) => {
    await deleteDoc(doc(db, "products", String(productId), "reviews", reviewId));
};

// Live aggregate from real reviews; falls back to the seeded catalog rating
// when a product has no customer reviews yet.
export const ratingSummary = (reviews, fallbackRating = 0) => {
    if (!reviews || reviews.length === 0) {
        return {
            average: Number(fallbackRating) || 0,
            count: 0,
            breakdown: [0, 0, 0, 0, 0], // index 0 => 5 stars ... index 4 => 1 star
            source: "catalog",
        };
    }
    const breakdown = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews) {
        const stars = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
        sum += stars;
        breakdown[5 - stars] += 1;
    }
    return {
        average: sum / reviews.length,
        count: reviews.length,
        breakdown,
        source: "reviews",
    };
};

/**
 * Live rating aggregates for a whole catalog (admin Top Rated, sorting...).
 * Returns a Map(productId -> { average, count }) computed from the genuine
 * customer-review subcollections — NEVER the seeded sample `rating` field.
 * One bounded subcollection read per product, run in parallel; products with
 * no reviews map to { average: 0, count: 0 }. A failed read degrades to zero
 * counts instead of breaking the dashboard.
 */
export const getRatingsForProducts = async (productIds = []) => {
    const ids = [...new Set(productIds.map(String))].filter(Boolean);

    const results = await Promise.all(
        ids.map(async (id) => {
            try {
                const snap = await getDocs(query(reviewsRef(id), limit(MAX_REVIEWS)));
                let count = 0;
                let sum = 0;
                snap.forEach((d) => {
                    const stars = Math.min(5, Math.max(1, Math.round(Number(d.data()?.rating) || 0)));
                    if (stars > 0) {
                        sum += stars;
                        count += 1;
                    }
                });
                return [id, { average: count ? sum / count : 0, count }];
            } catch (error) {
                console.error(`Failed to aggregate ratings for product ${id}:`, error);
                return [id, { average: 0, count: 0 }];
            }
        })
    );

    return new Map(results);
};