import { useCallback, useEffect, useRef, useState } from 'react';

type IntersectionObserverHookProps = {
  onIntersect?: any;
  enabled?: boolean;
} & ConstructorParameters<typeof IntersectionObserver>[1];

export function useIntersectionObserver<T extends HTMLElement = any>(
  options?: IntersectionObserverHookProps
): readonly [(element: T | null) => void, IntersectionObserverEntry | null] {
  const [entry, setEntry] = useState<IntersectionObserverEntry>(null);

  const observer = useRef<IntersectionObserver>();

  const ref = useCallback(
    (element: T | null) => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }

      if (element === null) {
        setEntry(null);
        return;
      }

      observer.current = new IntersectionObserver(([_entry]) => {
        setEntry(_entry);
      }, options);

      observer.current.observe(element);
    },
    [options?.rootMargin, options?.root, options?.threshold]
  );

  useEffect(() => {
    if (!options.enabled) return;

    if (entry?.isIntersecting) {
      options.onIntersect();
    }
  }, [entry?.isIntersecting]);

  return [ref, entry] as const;
}
