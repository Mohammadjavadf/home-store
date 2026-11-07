import { lazy, Suspense, useEffect, useState } from 'react';

const NotFoundScene = lazy(() => import('./NotFoundScene'));

export default function NotFound3D() {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl');
      setWebgl(gl !== null);
    } catch {
      setWebgl(false);
    }
  }, []);

  if (webgl === null) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-copper border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!webgl) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-7xl font-display font-extrabold text-copper/20">۴۰۴</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[360px]">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-copper border-t-transparent animate-spin" />
          </div>
        }
      >
        <NotFoundScene />
      </Suspense>
    </div>
  );
}