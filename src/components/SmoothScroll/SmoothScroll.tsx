import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * SmoothScroll — Lenis smooth scroll provider.
 *
 * Bridges Lenis with GSAP's ScrollTrigger so all scroll-driven
 * animations stay in sync with the smooth scroll offset.
 *
 * Performance notes:
 * - Uses gsap.ticker instead of rAF loop to batch with GSAP's frame cycle
 * - lagSmoothing(0) prevents GSAP from compensating for dropped frames,
 *   which would cause jerky animation spikes
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Bridge Lenis → ScrollTrigger: keep positions in sync
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker — single rAF loop, no duplicate frames
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Prevent GSAP lag compensation from causing animation spikes
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
