import { useEffect, useMemo, useState } from "react";

// -----------------------------------------------------------------------------
// <Avatar /> - deterministic "no photo" avatars, real-world style.
//
// Real apps (GitHub identicons, DiceBear, Boring Avatars, ui-avatars) don't show
// a boring initials circle when a user has no profile photo - they generate a
// UNIQUE illustration that is always the same for that person, derived from a
// seed (name / email / uid). We do the same fully client-side with inline SVG:
// zero network calls, zero dependencies, works offline, and identical on every
// device because the seed never changes.
//
// Props:
//   - src       photo URL. If empty or the image fails to load, the generated
//               identicon takes over automatically (onError fallback).
//   - name      display name (fallback seed material)
//   - email     email (fallback seed material)
//   - seed      strongest seed override (e.g. the user's uid)
//   - className sizing + ring styles for the wrapper (e.g. "w-10 h-10")
//   - alt       accessible label
// -----------------------------------------------------------------------------

// TerraBloom-friendly gradient pairs - pinned so the avatar stays on-brand in
// light AND dark mode.
const PALETTES = [
    ["#4A9B4B", "#88B73B"], // moss -> lime
    ["#2F6D4F", "#7BC47F"], // deep forest -> fresh green
    ["#3EA08D", "#BFE3B4"], // teal -> mint
    ["#56A05A", "#A2C73E"], // green -> citron
    ["#F2B428", "#E7822E"], // sunlight -> amber
    ["#5B8DEF", "#9B6AE8"], // sky -> violet
    ["#7C6FC0", "#F2B428"], // iris -> gold
    ["#E86A8C", "#F2B428"], // coral -> gold
];

/** Small deterministic string hash (FNV-1a style) - identical on every runtime. */
const hashString = (value) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < value.length; i += 1) {
        h ^= value.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
};

/** Seeded PRNG (mulberry32) - every field below is derived from this, so the
 *  same user always gets the same avatar no matter where it is rendered. */
const mulberry32 = (seed) => () => {
    let s = seed | 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Build the symmetric identicon cells for a given seed. */
const buildCells = (seed) => {
    const rnd = mulberry32(seed);
    const grid = 5; // 5 × 5 symmetric grid (GitHub-style)
    const cells = [];
    for (let row = 0; row < grid; row += 1) {
        for (let col = 0; col < grid; col += 1) {
            // Mirror horizontally too - gives a nice "symbol" look in a circle.
            const visualCol = col < Math.ceil(grid / 2) ? col : grid - 1 - col;
            if (rnd() > 0.5) {
                cells.push({ row, col: visualCol, hue: Math.floor(rnd() * 3) });
            }
        }
    }
    return cells;
};
const Avatar = ({
    name = "",
    email = "",
    seed = "",
    src = "",
    alt = "Avatar",
    className = "w-10 h-10",
}) => {
    const [imgFailed, setImgFailed] = useState(false);

    // If the href changes back to a valid photo, re-allow the <img>.
    useEffect(() => {
        setImgFailed(false);
    }, [src]);

    const showPhoto = Boolean(src) && !imgFailed;

    // Always derive the identicon deterministically - cheap, and keeps the
    // generated avatar stable when we swap between photo/no-photo.
    const identicon = useMemo(() => {
        const seedMaterial = seed || name || email || "TerraBloom-user";
        const hash = hashString(seedMaterial);
        const palette = PALETTES[hash % PALETTES.length];
        const cells = buildCells(hash);
        const gradientId = `tb-avatar-${hash}`;
        return { hash, palette, cells, gradientId };
    }, [seed, name, email]);

    return (
        <div
            className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-[var(--glass-highlight-strong)] ${className}`}
            aria-label={alt}
        >
            {showPhoto ? (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setImgFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                    role="img"
                    aria-label={`${alt} (generated avatar)`}
                >
                    <defs>
                        <linearGradient
                            id={identicon.gradientId}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >
                            <stop offset="0%" stopColor={identicon.palette[0]} />
                            <stop offset="100%" stopColor={identicon.palette[1]} />
                        </linearGradient>
                        <clipPath id={`${identicon.gradientId}-clip`}>
                            <circle cx="50" cy="50" r="50" />
                        </clipPath>
                    </defs>

                    {/* Gradient coin + a soft highlight so it has depth */}
                    <circle
                        cx="50"
                        cy="50"
                        r="50"
                        fill={`url(#${identicon.gradientId})`}
                    />
                    <circle
                        cx="30"
                        cy="26"
                        r="26"
                        fill="white"
                        opacity="0.18"
                        clipPath={`url(#${identicon.gradientId}-clip)`}
                    />

                    {/* Identicon cells - unique per seed */}
                    <g
                        clipPath={`url(#${identicon.gradientId}-clip)`}
                        transform={`rotate(${identicon.hash % 90} 50 50)`}
                    >
                        {identicon.cells.map(({ row: r, col: c, hue }, i) => (
                            <rect
                                key={`${r}-${c}-${i}`}
                                x={5 + c * 18}
                                y={5 + r * 18}
                                width="13"
                                height="13"
                                rx="3.2"
                                fill={
                                    hue % 2 === 0
                                        ? "rgba(255,255,255,0.92)"
                                        : "rgba(0,0,0,0.22)"
                                }
                            />
                        ))}
                    </g>
                </svg>
            )}
        </div>
    );
};

export default Avatar;