/**
 * Shared order-status vocabulary + pill styling, used by the admin Orders
 * table, the user's Orders list, OrderCard previews and the OrderDetail
 * timeline. Keeping it in one place guarantees the statuses and their colors
 * can never drift apart between the admin and user experiences.
 */
export const ORDER_STATUSES = ["Processing", "In Transit", "Delivered", "Cancelled"];

export const orderStatusPill = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
        case "In Transit":
            return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
        case "Processing":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
        case "Cancelled":
            return "bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
        default:
            return "bg-[var(--glass-highlight)] text-secondary border border-subtle";
    }
};
