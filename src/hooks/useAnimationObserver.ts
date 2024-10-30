
import { useEffect, useRef } from 'react';

interface UseAnimationObserverProps {
  onInView?: () => void;
  onOutOfView?: () => void;
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export const useAnimationObserver = ({
  onInView,
  onOutOfView,
  threshold = 0,
  root = null,
  rootMargin = '0px',
}: UseAnimationObserverProps) => {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onInView?.();
          } else {
            onOutOfView?.();
          }
        });
      },
      { threshold, root, rootMargin }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [onInView, onOutOfView, threshold, root, rootMargin]);

  return elementRef;
};