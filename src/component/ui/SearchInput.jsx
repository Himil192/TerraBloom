import { Search, X } from "lucide-react";

/**
 * Shared search field for admin filter toolbars.
 *
 * Fixes over the old inline copies:
 *  - Fixed h-11 height so the absolutely-positioned icon is always perfectly
 *    centered (the old py-2.5 content-based height made alignment fragile) and
 *    so it matches GlassSelect in the same toolbar row.
 *  - left-3.5 icon + pl-11 text = symmetric 14px rhythm on both sides.
 *  - Built-in clear (×) button, theme-aware icon color.
 *
 * Props: value, onChange (input event, e.target.value), placeholder,
 * className (sizing for the wrapper, e.g. "sm:flex-1 sm:max-w-md"), ariaLabel.
 */
export default function SearchInput({
    value,
    onChange,
    placeholder = "Search…",
    className = "",
    ariaLabel,
}) {
    const hasValue = Boolean(value);

    return (
        <div className={`relative ${className}`}>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-label={ariaLabel || placeholder}
                className={`glass-field h-11 pl-11 text-sm ${
                    hasValue ? "pr-10" : "pr-4"
                }`}
            />
            {hasValue && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange({ target: { value: "" } })}
                    className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-[var(--glass-highlight)] hover:text-[var(--text-strong)]"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
