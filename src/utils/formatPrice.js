/**
 * Single source of truth for currency formatting across the app.
 * Indian-English grouping with the ₹ prefix — admin tables, user order
 * cards, checkout summaries and wishlist all render through this.
 */
const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default formatPrice;
