import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--card)] p-6">
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
