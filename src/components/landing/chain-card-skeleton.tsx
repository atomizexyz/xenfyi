import { Skeleton } from "@/components/ui/skeleton";

export function ChainCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[var(--card)] p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-4" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-1.5" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <Skeleton className="h-0.5 w-full" />
    </div>
  );
}
