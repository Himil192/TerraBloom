import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Star, Trash2, BadgeCheck, PenLine, LogIn } from "lucide-react";
import { addReview, deleteReview, ratingSummary } from "../services/reviewService";
import { userPurchasedProduct } from "../services/orderService";
import { showSuccess, showError } from "../utils/toastUtils";

const MAX_TEXT = 1000;

const fmtDate = (ts) => {
    try {
        return ts?.toDate
            ? ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "Just now";
    } catch {
        return "";
    }
};

const ReviewSection = ({ productId, reviews, onReviewsChange, catalogRating }) => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [verified, setVerified] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const summary = ratingSummary(reviews, catalogRating);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setUserName(u?.displayName || u?.email?.split("@")[0] || "Eco Shopper");
            if (!u) {
                setVerified(false);
                return;
            }
            // Verified Purchase: computed from the author's OWN order history,
            // which the orders rule permits them to read (and only theirs).
            userPurchasedProduct(u.uid, productId)
                .then(setVerified)
                .catch(() => setVerified(false));
        });
        return () => unsubscribe();
    }, [productId]);

    const myReview = user ? reviews.find((r) => r.uid === user.uid) : null;

    const submit = async (e) => {
        e.preventDefault();
        if (!rating) {
            showError("Please pick a star rating.");
            return;
        }
        if (!text.trim()) {
            showError("Please write a few words about the product.");
            return;
        }
        setSubmitting(true);
        try {
            // Reviews are immutable server-side (update: false), so an edit
            // is delete-own + recreate-own - both uid-locked in the rules.
            if (myReview) {
                await deleteReview(productId, myReview.id).catch(() => {});
            }
            const created = await addReview(productId, {
                uid: user.uid,
                userName,
                rating,
                text,
                verified,
            });
            onReviewsChange([created, ...reviews]);
            setFormOpen(false);
            setRating(0);
            setText("");
            showSuccess("Thanks for your review! 🌱");
        } catch {
            showError("Could not save your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const remove = async (review) => {
        setDeletingId(review.id);
        try {
            await deleteReview(productId, review.id);
            onReviewsChange(reviews.filter((r) => r.id !== review.id));
            showSuccess("Review removed.");
        } catch {
            showError("Could not remove the review.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section id="reviews" className="mt-20 scroll-mt-28">
            <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>

            {/* Summary + breakdown */}
            <div className="card-surface mb-10 grid grid-cols-1 gap-8 rounded-3xl border p-6 shadow-md sm:grid-cols-[auto_1fr] sm:gap-12">
                <div className="text-center sm:text-left">
                    <p className="text-5xl font-extrabold">
                        {summary.source === "reviews" ? summary.average.toFixed(1) : (summary.average ? summary.average.toFixed(1) : "—")}
                    </p>
                    <div className="my-2 flex justify-center sm:justify-start" aria-hidden="true">
                        {Array(5).fill().map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.round(summary.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                    </div>
                    <p className="text-sm opacity-70">
                        {summary.source === "reviews"
                            ? `${summary.count} genuine review${summary.count === 1 ? "" : "s"}`
                            : "No reviews yet — be the first"}
                    </p>
                </div>
                <div className="flex flex-col justify-center gap-1.5">
                    {summary.breakdown.map((count, idx) => {
                        const stars = 5 - idx;
                        const pct = summary.count ? Math.round((count / summary.count) * 100) : 0;
                        return (
                            <div key={stars} className="flex items-center gap-2 text-xs">
                                <span className="w-10 shrink-0 font-semibold">{stars} ★</span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                    <div className="h-full rounded-full bg-yellow-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-8 shrink-0 text-right opacity-60">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Write / manage your review */}
            <div className="mb-10">
                {!user ? (
                    <Link
                        to="/login"
                        className="btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                    >
                        <LogIn className="h-4 w-4" /> Sign in to write a review
                    </Link>
                ) : formOpen ? (
                    <form onSubmit={submit} className="card-surface rounded-3xl border p-6 shadow-md">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h3 className="font-bold">{myReview ? "Update your review" : "Your review"}</h3>
                            {verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                    <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
                                </span>
                            )}
                        </div>
                        <div className="mb-4 flex items-center gap-1" role="radiogroup" aria-label="Star rating">
                            {Array(5).fill().map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    role="radio"
                                    aria-checked={rating === i + 1}
                                    aria-label={`${i + 1} star${i ? "s" : ""}`}
                                    onMouseEnter={() => setHover(i + 1)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(i + 1)}
                                    className="p-0.5 transition-transform hover:scale-110"
                                >
                                    <Star className={`h-7 w-7 ${(hover || rating) > i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
                            rows={4}
                            maxLength={MAX_TEXT}
                            placeholder="What did you think of this product?"
                            className="w-full resize-none rounded-2xl border border-color-border bg-color-background p-4 text-sm outline-none focus:border-highlight"
                        />
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs opacity-60">{text.length}/{MAX_TEXT}</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary rounded-full px-5 py-2 text-sm font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting || !rating} className="btn-primary rounded-full px-6 py-2 text-sm font-semibold disabled:opacity-50">
                                    {submitting ? "Saving..." : myReview ? "Update Review" : "Post Review"}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : myReview ? (
                    <div className="card-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
                        <p className="text-sm font-semibold">You&apos;ve reviewed this product 🌱</p>
                        <button
                            onClick={() => { setRating(myReview.rating); setText(myReview.text); setFormOpen(true); }}
                            className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold"
                        >
                            <PenLine className="h-4 w-4" /> Edit Review
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setFormOpen(true)} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                        <PenLine className="h-4 w-4" /> Write a Review
                    </button>
                )}
            </div>

            {/* Reviews list */}
            <div className="mt-8">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-widest opacity-60">
                    {reviews.length} Review{reviews.length === 1 ? "" : "s"}
                </h4>

                {reviews.length === 0 ? (
                    <div className="card-surface rounded-2xl border border-dashed p-8 text-center">
                        <p className="mb-1 font-semibold">No reviews yet</p>
                        <p className="text-sm opacity-70">Be the first to share how this product worked for you.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {reviews.map((r) => (
                            <li key={r.id} className="card-surface rounded-2xl border p-5" data-aos="fade-up">
                                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A9B4B]/15 text-sm font-bold text-highlight">
                                        {(r.userName || "?").charAt(0).toUpperCase()}
                                    </span>
                                    <span className="font-semibold">{r.userName || "Eco Shopper"}</span>
                                    {r.verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                                            <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
                                        </span>
                                    )}
                                    <span className="text-xs opacity-60">{fmtDate(r.createdAt)}</span>

                                    {user && r.uid === user.uid && (
                                        <button
                                            onClick={() => remove(r)}
                                            disabled={deletingId === r.id}
                                            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
                                            aria-label="Delete my review"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {deletingId === r.id ? "Removing..." : "Delete"}
                                        </button>
                                    )}
                                </div>

                                <div className="mb-2 flex items-center gap-1" aria-label={`Rated ${r.rating} out of 5`}>
                                    {Array(5).fill().map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(r.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>

                                {/* React renders this as a plain text node - no HTML
                                    injection is possible, matching the security model. */}
                                <p className="text-sm leading-relaxed opacity-85">{r.text}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {!user && (
                    <p className="mt-6 flex items-center justify-center gap-2 text-sm opacity-70">
                        <LogIn className="h-4 w-4" />
                        <Link to="/login" className="font-semibold text-highlight hover:underline">
                            Sign in
                        </Link>
                        to write a review
                    </p>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;