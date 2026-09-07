import React from "react";
import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export const WishlistHeart = ({ product, className = "" }) => {
    const { has, toggle } = useWishlist();
    const saved = has(product.id);
    return (
        <button
            type="button"
            onClick={() => toggle(product)}
            aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
            aria-pressed={saved}
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur transition-all duration-200 hover:scale-110 ${
                saved
                    ? "border-red-200 bg-red-50 text-red-500 dark:bg-red-950/60"
                    : "border-color-border bg-white/85 text-color-text"
            } ${className}`}
        >
            <Heart size={18} className={saved ? "fill-current" : ""} />
        </button>
    );
};

const ProductCard = ({ product }) => {
    const rating = Math.round(product.rating || 0);
    const detailPath = `/products/${product.id}`;
    return (
        <div className="card-surface group relative flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border shadow-md hover:-translate-y-1 hover:shadow-xl">
            <div className="relative mx-3 mt-3">
                <Link
                    to={detailPath}
                    className="flex h-60 overflow-hidden rounded-xl"
                    aria-label={`View details for ${product.title}`}
                >
                    <img
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"
                        srcSet={`${product.image} 2x`}
                        src={product.image}
                        alt={product.title}
                    />
                </Link>
                <WishlistHeart product={product} className="absolute right-2 top-2" />
            </div>
            <div className="flex flex-col justify-between flex-grow mt-4 px-5 pb-5">
                <Link to={detailPath}>
                    <h5 className="text-xl tracking-tight text-color-text min-h-[48px]">
                        {product.title}
                    </h5>
                </Link>

                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span className="text-3xl font-bold text-color-text">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                    </p>
                    <div className="flex items-center">
                        {Array(5)
                            .fill()
                            .map((_, i) => (
                                <svg
                                    key={i}
                                    aria-hidden="true"
                                    className={i < rating ? "h-4 w-4 text-yellow-400" : "h-4 w-4 text-gray-200"}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            ))}
                        <span className="ml-2 rounded bg-yellow-200 px-2.5 py-0.5 text-black text-xs font-semibold">{product.rating ? product.rating.toFixed(1) : "New"}</span>
                    </div>
                </div>

                {/* Push button to bottom */}
                <Link
                    to={detailPath}
                    className="mt-auto flex items-center justify-center rounded-md px-5 py-4 text-center text-sm font-medium btn-primary focus:outline-none focus:ring-4 focus:ring-[#4A9B4B]/40"
                >
                    <Eye className="mr-2 h-5 w-5" />
                    View Details
                </Link>

            </div>
        </div>
    );
};

export default ProductCard;
