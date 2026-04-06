import { Skeleton } from './Skeleton';

export function AboutSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {/* Hero Skeleton - Matching actual maroon gradient */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-gradient-to-br from-[#6B0F0F] to-[#4A0A0A]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 70% 30%, #D4AF37 0%, transparent 50%)' }} />
        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
            <Skeleton width="86px" height="12px" className="opacity-40 bg-[#D4AF37]" />
            <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(212,175,55,0.3)' }} />
          </div>
          <Skeleton width="400px" height="60px" className="mx-auto opacity-50 bg-white rounded-xl" />
          <Skeleton width="550px" height="24px" className="mx-auto opacity-20 bg-white" />
        </div>
      </section>

      {/* Story Section Skeleton */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Skeleton height="520px" className="rounded-3xl opacity-10 bg-[#0a0a0a]/5" />
            <div className="absolute -bottom-4 -right-4 p-6 rounded-2xl shadow-xl w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#B8960C] opacity-40" />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: '40px', height: '2px', backgroundColor: '#6B0F0F', opacity: 0.3 }} />
              <Skeleton width="120px" height="16px" className="opacity-20" />
            </div>
            <Skeleton width="90%" height="52px" className="opacity-40 rounded-xl" />
            <div className="space-y-4">
              <Skeleton width="100%" height="80px" className="opacity-10" />
              <Skeleton width="100%" height="80px" className="opacity-10" />
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton width="24px" height="24px" className="rounded-full opacity-20 bg-[#6B0F0F]" />
                  <Skeleton width="240px" height="16px" className="opacity-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid Skeleton */}
      <section className="py-20 px-4 bg-[#F9F5F0] mx-4 sm:mx-8 lg:mx-16 rounded-3xl mb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-[#6B0F0F]/5 space-y-4">
               <Skeleton width="56px" height="56px" className="rounded-2xl mx-auto opacity-10 bg-[#6B0F0F]/20" />
               <Skeleton width="140px" height="24px" className="mx-auto opacity-30" />
               <Skeleton width="100%" height="48px" className="opacity-10" />
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
