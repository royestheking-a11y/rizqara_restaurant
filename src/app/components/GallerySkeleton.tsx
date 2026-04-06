import { Skeleton } from './Skeleton';

export function GallerySkeleton() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Header Skeleton */}
      <div className="py-16 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6B0F0F, #4A0A0A)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 50%)' }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
            <Skeleton width="60px" height="12px" className="opacity-40 bg-[#D4AF37]" />
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
          </div>
          <Skeleton width="300px" height="48px" className="mx-auto mb-4 opacity-50 bg-white rounded-xl" />
          <Skeleton width="400px" height="20px" className="mx-auto opacity-20 bg-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center flex-wrap">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} width="100px" height="42px" className="rounded-full opacity-10 flex-shrink-0 bg-[#6B0F0F]/5" />
          ))}
        </div>

        {/* Masonry Grid Skeleton */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm p-2 space-y-2" style={{ border: '1px solid rgba(107,15,15,0.06)', marginBottom: '16px' }}>
              <Skeleton 
                height={i % 2 === 0 ? "280px" : i % 3 === 0 ? "400px" : "320px"} 
                className="rounded-xl opacity-10 bg-[#6B0F0F]/5" 
              />
              <div className="p-2 space-y-2">
                <Skeleton width="60%" height="16px" className="opacity-20 bg-[#111]" />
                <Skeleton width="30%" height="12px" className="rounded-full opacity-10 bg-[#D4AF37]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
