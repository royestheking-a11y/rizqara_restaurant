interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rect', width, height }: SkeletonProps) {
  // Deep premium background base - slightly darker and more neutralized for high contrast
  const baseStyles = "relative overflow-hidden bg-[#161616]";
  
  const variantStyles = {
    text: "h-4 w-full rounded-md",
    rect: "w-full h-full rounded-2xl",
    circle: "rounded-full"
  };

  // Ultra-premium shimmer with an elegant gold-amber gradient + blur
  const shimmer = (
    <div 
      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)'
      }}
    />
  );

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    >
      {shimmer}
    </div>
  );
}
