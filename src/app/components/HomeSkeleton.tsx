import { Skeleton } from './Skeleton';

export function HomeSkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Hero Skeleton - matching actual marquee-style hero with maroon/gold */}
      <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#6B0F0F] via-[#330505] to-[#0a0a0a]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 50%)' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-4xl space-y-10">
             {/* Badge */}
             <Skeleton width="220px" height="34px" className="rounded-full opacity-30 bg-[#D4AF37]/20 border border-[#D4AF37]/20" />
             
             {/* Main Titles */}
             <div className="space-y-4">
               <Skeleton width="180px" height="18px" className="opacity-40" />
               <div className="space-y-4">
                 <Skeleton width="85%" height="80px" className="opacity-50 rounded-2xl bg-white/5" />
                 <Skeleton width="65%" height="80px" className="opacity-50 rounded-2xl bg-[#D4AF37]/20" />
               </div>
             </div>
             
             <Skeleton width="520px" height="64px" className="opacity-20 rounded-xl bg-white/5" />
             
             {/* Buttons */}
             <div className="flex flex-wrap gap-6 pt-4">
               <Skeleton width="190px" height="60px" className="rounded-full opacity-60 bg-gradient-to-br from-[#6B0F0F] to-[#4A0A0A]" />
               <Skeleton width="190px" height="60px" className="rounded-full opacity-20 border-2 border-white/10" />
             </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Skeleton - Polished alignment */}
      <section className="bg-[#0d0d0d] py-16 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Skeleton width="120px" height="52px" className="opacity-40 rounded-xl" />
                <Skeleton width="160px" height="14px" className="opacity-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section Skeleton */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative p-2">
            <Skeleton height="560px" className="rounded-[40px] opacity-15 border border-white/5" />
            <div className="absolute -bottom-8 -right-8 p-6 bg-[#0d0d0d] rounded-3xl border border-white/10 shadow-2xl">
               <Skeleton width="120px" height="120px" className="rounded-2xl opacity-40 bg-gradient-to-br from-[#D4AF37] to-[#B8960C]" />
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
               <Skeleton width="140px" height="20px" className="opacity-30" />
               <Skeleton width="100%" height="72px" className="opacity-50 rounded-2xl" />
            </div>
            <div className="space-y-6 opacity-30">
               <Skeleton width="100%" height="80px" className="rounded-2xl" />
               <Skeleton width="100%" height="80px" className="rounded-2xl" />
            </div>
            <Skeleton width="260px" height="60px" className="rounded-full opacity-50 bg-[#6B0F0F]/30" />
          </div>
        </div>
      </section>

      {/* Popular Selection Skeleton - The heart of home page preview */}
      <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-b from-[#6B0F0F]/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <Skeleton width="200px" height="24px" className="opacity-20" />
            <Skeleton width="420px" height="56px" className="opacity-50 rounded-2xl" />
            <Skeleton width="500px" height="18px" className="opacity-15" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white/5 p-4 space-y-4 border border-white/10 shadow-lg">
                <Skeleton height="210px" className="rounded-2xl opacity-25" />
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton width="70%" height="24px" className="opacity-40 rounded-lg" />
                      <Skeleton width="20%" height="24px" className="opacity-60 rounded-lg bg-[#D4AF37]/20" />
                    </div>
                    <Skeleton width="40%" height="16px" className="opacity-15" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton width="50%" height="42px" className="rounded-xl opacity-20 border border-white/10" />
                    <Skeleton width="50%" height="42px" className="rounded-xl opacity-70 bg-gradient-to-r from-[#6B0F0F] to-[#4A0A0A]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
