import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Custom dropdown styled after the Topbar profile dropdown
 * (glass-strong panel + subtle border + rounded rows with hover highlight).
 * Native <select> popups cannot be themed, so admin filter dropdowns use this.
 *
 * Props:
 *  - value:       current selected value
 *  - onChange:    (value) => void
 *  - options:     [{ value, label }] or plain strings
 *  - className:   sizing for the wrapper (e.g. "sm:w-48")
 *  - placeholder: shown when value is empty
 *  - ariaLabel:   accessible name for the trigger
 */
export default function GlassSelect({
    value,
    onChange,
    options,
    className = "",
    placeholder = "Select…",
    ariaLabel,
}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    const normalized = options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option
    );
    const selected = normalized.find((option) => option.value === value);

    // Close on outside click — same pattern as the Topbar profile dropdown
    useEffect(() => {
        if (!open) return undefined;
        const handleClickOutside = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const openMenu = () => {
        const currentIndex = normalized.findIndex(
            (option) => option.value === value
        );
        setActiveIndex(Math.max(0, currentIndex));
        setOpen(true);
    };

    const commit = (option) => {
        if (!option) return;
        onChange(option.value);
        setOpen(false);
        triggerRef.current?.focus();
    };

    // Keyboard support: arrows navigate, Enter/Space select, Escape closes.
    // Focus stays on the trigger (items are tabIndex={-1} + aria-activedescendant).
    const onKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                if (open) commit(normalized[activeIndex]);
                else openMenu();
                break;
            case "ArrowDown":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.min(normalized.length - 1, i + 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.max(0, i - 1));
                break;
            case "Escape":
                if (open) {
                    e.stopPropagation();
                    setOpen(false);
                }
                break;
            case "Tab":
                setOpen(false);
                break;
            default:
                break;
        }
    };

    return (

        <div ref={rootRef} className={`relative ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={onKeyDown}
                className="glass-field flex h-11 w-full cursor-pointer items-center justify-between gap-2 px-3.5 text-left text-sm"
            >
                <span className={`truncate ${selected ? "" : "text-muted"}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-activedescendant={
                        activeIndex >= 0
                            ? `glass-select-option-${activeIndex}`
                            : undefined
                    }
                    className="glass-strong absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-subtle-strong p-1.5 shadow-lg animate-fadeIn"
                >
                    {normalized.map((option, index) => {
                        const isSelected = option.value === value;
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={option.value}
                                id={`glass-select-option-${index}`}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={-1}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => commit(option)}
                                className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                    isSelected
                                        ? "font-semibold text-[var(--primary-color)]"
                                        : "text-secondary"
                                } ${isActive ? "bg-[var(--glass-highlight)]" : ""}`}
                            >
                                <span className="truncate">{option.label}</span>
                                {isSelected && (
                                    <Check className="ml-auto h-4 w-4 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
