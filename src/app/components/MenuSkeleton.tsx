import { Skeleton } from './Skeleton';

export function MenuSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-[#F9F5F0]">
      {/* Banner Skeleton - Matches actual maroon gradient exactly */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-[#6B0F0F] to-[#4A0A0A] overflow-hidden text-center flex flex-col items-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%)' }} />
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
            <Skeleton width="86px" height="12px" className="opacity-40 bg-[#D4AF37]" />
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
          </div>
          <Skeleton width="320px" height="56px" className="mx-auto opacity-50 bg-white rounded-xl" />
          <Skeleton width="450px" height="24px" className="mx-auto opacity-20 bg-white" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search + Sort Bar Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton width="100%" height="52px" className="rounded-xl opacity-10 flex-1 bg-white border border-[#6B0F0F]/10" />
          <div className="flex gap-3">
             <Skeleton width="160px" height="52px" className="rounded-xl opacity-10 bg-white border border-[#6B0F0F]/10" />
             <Skeleton width="130px" height="52px" className="rounded-xl opacity-10 bg-white border border-[#6B0F0F]/10" />
          </div>
        </div>

        {/* Category Tabs Skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <Skeleton key={i} width="110px" height="42px" className="rounded-full opacity-15 flex-shrink-0 bg-white border border-[#6B0F0F]/10" />
          ))}
        </div>

        {/* Results Info Skeleton */}
        <div className="flex items-center justify-between mb-8 border-b border-[#6B0F0F]/5 pb-6">
           <Skeleton width="260px" height="18px" className="opacity-10 bg-[#111]" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white p-3 space-y-4 shadow-sm border border-[#6B0F0F]/5">
              <Skeleton height="192px" className="rounded-xl opacity-10 bg-[#6B0F0F]/5" />
              <div className="space-y-4 px-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Skeleton width="75%" height="22px" className="opacity-40 bg-[#111] rounded" />
                    <Skeleton width="20%" height="20px" className="opacity-60 bg-[#6B0F0F] rounded" />
                  </div>
                  <Skeleton width="45%" height="14px" className="opacity-10 bg-[#6B0F0F]" />
                </div>
                
                <div className="flex justify-between items-center py-1 opacity-10">
                   <Skeleton width="35%" height="14px" />
                   <Skeleton width="35%" height="14px" />
                </div>

                <div className="flex gap-2 pt-1">
                  <Skeleton width="50%" height="36px" className="rounded-lg opacity-20 border border-[#6B0F0F]/20" />
                  <Skeleton width="50%" height="36px" className="rounded-lg opacity-70 bg-gradient-to-br from-[#6B0F0F] to-[#4A0A0A]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
