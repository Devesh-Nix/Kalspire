import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'scale-in' | 'slide-in-left' | 'slide-in-right';
  delay?: number;
  className?: string;
}

export function AnimatedContainer({ 
  children, 
  animation = 'fade-in-up', 
  delay = 0,
  className = '' 
}: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use requestIdleCallback to defer non-critical intersection observer setup
    const idleId = requestIdleCallback(() => {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Use requestAnimationFrame to batch state updates
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              if (observerRef.current && element) {
                observerRef.current.unobserve(element);
              }
            }, delay);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      observerRef.current.observe(element);
    });

    return () => {
      cancelIdleCallback(idleId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? `animate-${animation} opacity-100` 
          : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
