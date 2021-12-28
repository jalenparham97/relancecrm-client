import { useEffect, useState } from 'react';

export const useScrollToBottom = <T extends Element>(): [React.RefCallback<T>, boolean] => {
  const [isBottom, setIsBottom] = useState(false);
  const [node, setRef] = useState<any>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (node && node.parentElement) {
      observer = new IntersectionObserver(([entry]) => setIsBottom(entry.isIntersecting), {
        root: node.parentElement,
      });
      observer.observe(node);
    } else {
      setIsBottom(false);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [node]);

  return [setRef, isBottom];
};
