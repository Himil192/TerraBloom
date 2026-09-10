import { useState } from "react";
import { Star, Trash2, BadgeCheck, PenLine } from "lucide-react";
import { Modal } from "../ui/model";
import { addReview, deleteReview } from "../../services/reviewService";
import { showSuccess, showError } from "../../utils/toastUtils";

const MAX_TEXT = 1000;

/**
 * Star-rating + text review modal, launched from an order's item rows after an
 * order is Delivered. Reuses the same Firestore subcollection (and uid-locked
 * "one review per user per product" rule) as the ProductDetail review section.
 * Because reviews are immutable server-side (update: false), editing is a
 * delete-own + recreate-own cycle - both writes stay uid-locked in the rules.
 */
const OrderReviewForm = ({
    product,
    existingReview,
    uid,
    userName,
    verified,
    onClose,
    onSaved,
}) => {
    const [rating, setRating] = useState(
        existingReview ? Math.round(Number(existingReview.rating) || 0) : 0
    );
    const [hover, setHover] = useState(0);
    const [text, setText] = useState(existingReview?.text || "");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
            if (existingReview) {
                await deleteReview(product.id, existingReview.id).catch(() => {});
            }
            await addReview(product.id, {
                uid: String(uid),
                userName,
                rating,
                text,
                verified: Boolean(verified),
            });
            showSuccess(
                existingReview ? "Review updated! 🌱" : "Thanks for your review! 🌱"
            );
            onClose();
            onSaved?.(product.id);
        } catch {
            showError("Could not save your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const remove = async () => {
        if (!existingReview) return;
        setDeleting(true);
        try {
            await deleteReview(product.id, existingReview.id);
            showSuccess("Review deleted.");
            onClose();
            onSaved?.(product.id);
        } catch {
            showError("Could not delete your review. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose} className="max-w-md max-h-[85vh] overflow-y-auto p-6">
            <form onSubmit={submit} className="space-y-4">
                <div className="flex items-start gap-3 pr-10">
                    <div className="w-10 h-10 rounded-xl bg-[var(--glass-highlight)] flex items-center justify-center shrink-0">
                        <PenLine className="w-5 h-5 text-[var(--primary-color)]" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-strong">
                            {existingReview ? "Edit your review" : "Write a review"}
                        </h3>
                        <p className="text-sm text-muted truncate">{product.title}</p>
                    </div>
                </div>

                {/* Star picker */}
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            type="button"
                            key={n}
                            onMouseEnter={() => setHover(n)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(n)}
                            aria-label={`Rate ${n} out of 5`}
                            className="p-0.5 cursor-pointer"
                        >
                            <Star
                                className={`h-7 w-7 ${
                                    n <= (hover || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-secondary">
                        {hover || rating ? `${hover || rating}/5` : "Tap to rate"}
                    </span>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={MAX_TEXT}
                    rows={4}
                    placeholder="What did you love (or not)? Help other eco-shoppers decide."
                    className="glass-field w-full resize-none rounded-xl px-3.5 py-3 text-sm"
                />
                <p className="text-right text-xs text-muted">
                    {text.length}/{MAX_TEXT}
                </p>

                {verified && (
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
                        <BadgeCheck className="h-4 w-4" /> Verified Purchase
                    </p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3">
                    {existingReview && (
                        <button
                            type="button"
                            onClick={remove}
                            disabled={submitting || deleting}
                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-[#B3261E]/10 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-50"
                    >
                        {submitting
                            ? "Saving..."
                            : existingReview
                            ? "Update Review"
                            : "Submit Review"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OrderReviewForm;