import { lazy, Suspense, useEffect, useState } from 'react';
import SmartImage from '../ui/SmartImage';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero3D() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      setWebglSupported(gl !== null);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported === null) {
    return (
      <div className="w-full h-[280px] sm:h-[380px] lg:h-[500px] rounded-2xl sm:rounded-[2rem] overflow-hidden bg-cream dark:bg-night flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-copper border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-soft border border-ink/5 dark:border-white/10">
        <SmartImage
          src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80"
          alt="آشپزخانه مدرن"
          className="w-full h-[280px] sm:h-[380px] lg:h-[500px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-soft border border-ink/5 dark:border-white/10 bg-gradient-to-br from-cream via-copper/5 to-forest/5 dark:from-night dark:via-copper/10 dark:to-forest/10">
      <div className="w-full h-[280px] sm:h-[380px] lg:h-[500px]">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-copper border-t-transparent animate-spin" />
            </div>
          }
        >
          <HeroScene />
        </Suspense>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-ink/70 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full pointer-events-none whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
        برای چرخش بکشید
      </div>
    </div>
  );
}