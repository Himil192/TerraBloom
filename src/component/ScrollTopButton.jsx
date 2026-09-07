import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Floating "back to top" button - appears once the reader scrolls down a bit.
const ScrollTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;
    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll back to top"
            className="btn-primary fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
};

export default ScrollTopButton;