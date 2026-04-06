import { Skeleton } from './Skeleton';

export function ProductDetailSkeleton() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Breadcrumb Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Skeleton width="40px" height="14px" className="opacity-10 bg-[#6B7280]" />
          <Skeleton width="10px" height="10px" className="opacity-10" />
          <Skeleton width="40px" height="14px" className="opacity-10 bg-[#6B7280]" />
          <Skeleton width="10px" height="10px" className="opacity-10" />
          <Skeleton width="80px" height="14px" className="opacity-10 bg-[#6B0F0F]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* LEFT — Images Skeleton */}
          <div className="space-y-4">
            <Skeleton height="420px" className="rounded-3xl opacity-10 bg-[#6B0F0F]/5" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} height="80px" className="rounded-xl opacity-10 bg-[#6B0F0F]/5" />
              ))}
            </div>
          </div>

          {/* RIGHT — Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton width="120px" height="14px" className="opacity-20 bg-[#6B0F0F]" />
              <Skeleton width="80%" height="48px" className="opacity-30 bg-black rounded-xl" />
            </div>

            {/* Rating & Stats Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton width="100px" height="20px" className="opacity-20 bg-[#D4AF37]" />
              <Skeleton width="120px" height="16px" className="opacity-10 bg-[#6B7280]" />
            </div>

            {/* Quick Stats Skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} width="90px" height="28px" className="rounded-full opacity-10 bg-[#6B0F0F]" />
              ))}
            </div>

            {/* Price Skeleton */}
            <div className="py-6 px-5 rounded-2xl bg-black/5">
              <Skeleton width="150px" height="42px" className="opacity-40 bg-[#6B0F0F]" />
            </div>

            {/* Quantity Skeleton */}
            <div className="space-y-4">
              <Skeleton width="80px" height="16px" className="opacity-20 bg-[#111]" />
              <Skeleton width="200px" height="48px" className="rounded-xl opacity-10 bg-[#6B0F0F]" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-3">
              <Skeleton width="50%" height="56px" className="rounded-xl opacity-20 border border-[#6B0F0F]" />
              <Skeleton width="50%" height="56px" className="rounded-xl opacity-70 bg-gradient-to-br from-[#6B0F0F] to-[#4A0A0A]" />
            </div>
          </div>
        </div>

        {/* Info Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex border-b border-[#111]/5 gap-8">
            <Skeleton width="100px" height="30px" className="opacity-20" />
            <Skeleton width="100px" height="30px" className="opacity-10" />
            <Skeleton width="100px" height="30px" className="opacity-10" />
          </div>
          <Skeleton height="150px" className="rounded-2xl opacity-10 bg-[#6B0F0F]/5" />
        </div>
      </div>
    </div>
  );
}
