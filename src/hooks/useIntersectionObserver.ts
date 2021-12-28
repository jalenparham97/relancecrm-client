import { useEffect } from 'react';

interface IntersectionObserverHookProps {
  root?: any;
  target?: any;
  onIntersect?: any;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: IntersectionObserverHookProps) {
  useEffect(() => {
    // if (!enabled) {
    //   return;
    // }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log({ entries });
        // return entries.forEach((entry) => entry.isIntersecting && onIntersect())
      },
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target.current, enabled]);
}
