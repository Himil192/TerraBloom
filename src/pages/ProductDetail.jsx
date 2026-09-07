import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Leaf,
    ShieldCheck,
    Truck,
    ShoppingCart,
    Heart,
    Loader2,
    PackageSearch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { showSuccess } from "../utils/toastUtils";
import ProductCards from "../component/ProductCards";

const PERKS = [
    { icon: Leaf, label: "100% eco-friendly materials" },
    { icon: ShieldCheck, label: "Quality checked before dispatch" },
    { icon: Truck, label: "Plastic-free, careful packaging" },
];

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { has, toggle: toggleWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setProduct(null);
            setRelated([]);
            try {
                const data = await getProductById(id);
                if (cancelled) return;
                setProduct(data);
                if (data) document.title = `${data.title} | TerraBloom`;
                const all = await getAllProducts();
                if (cancelled) return;
                setRelated(
                    all
                        .filter((p) => p.id !== (data && data.id))
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 4)
                );
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(
        () => () => {
            document.title = "TerraBloom";
        },
        []
    );

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center pt-24">
                <Loader2 className="h-8 w-8 animate-spin text-highlight" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-20 text-center">
                <PackageSearch className="mx-auto mb-4 h-12 w-12 text-highlight" />
                <h1 className="mb-2 text-2xl font-bold">Product not found</h1>
                <p className="mb-8 opacity-70">It may have been removed or the link is outdated.</p>
                <Link
                    to="/products"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Products
                </Link>
            </div>
        );
    }

    // Main render - reached only when `product` is a valid product object.
    const rating = Math.round(product.rating || 0);
    const inStock = product.stock === undefined || product.stock > 0;
    const saved = has(product.id);

    const handleAddToCart = () => {
        addItem(product, 1);
        showSuccess("Added to cart");
    };

    const handleBuyNow = () => {
        addItem(product, 1);
        navigate("/checkout");
    };

    return (
        <div className="bg-color-background text-color-text">
            <div className="mx-auto max-w-screen-xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm opacity-70" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-highlight">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-highlight">Products</Link>
                    <span>/</span>
                    <span className="font-semibold text-highlight">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Image */}
                    <div className="card-surface overflow-hidden rounded-3xl border shadow-lg" data-aos="fade-up">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="aspect-square w-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center" data-aos="fade-up" data-aos-delay="100">
                        <div className="mb-3 flex items-start justify-between gap-4">
                            <h1 className="text-3xl font-extrabold sm:text-4xl">{product.title}</h1>
                            <button
                                type="button"
                                onClick={() => toggleWishlist(product)}
                                aria-pressed={saved}
                                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-color-border transition hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                <Heart
                                    className={`h-5 w-5 transition ${saved ? "fill-red-500 text-red-500" : "text-color-text"}`}
                                />
                            </button>
                        </div>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex items-center" aria-hidden="true">
                                {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                            </div>
                            <span className="text-sm font-semibold">
                                {product.rating ? product.rating.toFixed(1) : "New"}
                            </span>
                        </div>

                        <p className="mb-5 text-4xl font-bold text-highlight">
                            ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                        <span
                            className={`mb-6 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                            }`}
                        >
                            {inStock ? "In Stock" : "Out of Stock"}
                        </span>

                        <p className="mb-8 leading-relaxed opacity-80">{product.description}</p>

                        <ul className="mb-8 space-y-2.5 text-sm">
                            {PERKS.map((perk) => (
                                <li key={perk.label} className="flex items-center gap-2">
                                    <perk.icon className="h-4 w-4 text-highlight" />
                                    {perk.label}
                                </li>
                            ))}
                        </ul>

                        {/* Purchase CTAs */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                {inStock ? "Add to Cart" : "Out of Stock"}
                            </button>
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                className="btn-secondary inline-flex flex-1 items-center justify-center rounded-full px-7 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                        </div>
                        <Link
                            to="/products"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-highlight hover:gap-2 transition-all"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 rotate-180" /> Browse more products
                        </Link>
                    </div>
                </div>

                {/* Related */}
                {related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
                        <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
                            {related.map((p) => (
                                <ProductCards key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;