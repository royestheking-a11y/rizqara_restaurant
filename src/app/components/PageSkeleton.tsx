import { Skeleton } from './Skeleton';

export function PageSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {/* Generic Banner Skeleton */}
      <div className="py-16 px-4 bg-white/5 relative overflow-hidden flex flex-col items-center">
        <Skeleton width="120px" height="12px" className="mb-4 opacity-20" />
        <Skeleton width="300px" height="48px" className="mb-6 opacity-30" />
        <Skeleton width="400px" height="20px" className="opacity-10" />
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Skeleton height="400px" className="rounded-2xl opacity-20" />
          <div className="space-y-6">
            <Skeleton width="150px" height="24px" className="opacity-20" />
            <Skeleton width="90%" height="40px" className="opacity-30" />
            <Skeleton width="100%" height="100px" className="opacity-10" />
            <Skeleton width="200px" height="48px" className="rounded-full opacity-30" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 space-y-4">
              <Skeleton width="48px" height="48px" className="rounded-xl opacity-20" />
              <Skeleton width="120px" height="24px" className="opacity-30" />
              <Skeleton width="100%" height="48px" className="opacity-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
