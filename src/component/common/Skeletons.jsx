// Pulsing placeholder blocks shown while Firestore data loads.
// Skeletons feel faster than spinners and prevent layout shift when the
// real cards arrive. Purely decorative - hidden from screen readers.
const Shimmer = ({ className = "" }) => (
    <div className={`animate-pulse rounded-full bg-gray-200 dark:bg-white/10 ${className}`}></div>
);

export const SkeletonCard = () => (
    <div className="card-surface flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border shadow-md">
        <div className="mx-3 mt-3 h-60 animate-pulse rounded-xl bg-gray-200 dark:bg-white/10"></div>
        <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
            <Shimmer className="h-5 w-3/4 rounded-md" />
            <Shimmer className="h-5 w-1/3 rounded-md" />
            <Shimmer className="h-12 w-full rounded-md" />
        </div>
    </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
    <div className="flex flex-wrap justify-center gap-6" aria-hidden="true">
        {Array(count)
            .fill()
            .map((_, i) => (
                <SkeletonCard key={i} />
            ))}
    </div>
);