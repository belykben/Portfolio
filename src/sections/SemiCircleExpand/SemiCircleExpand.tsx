import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import MagneticButton from '../../components/MagneticButton';
import styles from './SemiCircleExpand.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SemiCircleExpand() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !circleRef.current) return;

      const section = sectionRef.current;
      const circle = circleRef.current;
      const content = contentRef.current;

      // Calculate exact scale required to cover screen from bottom-center
      const getCoverScale = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Radius needed to reach top corners (0,0) and (w,0) from (w/2, h)
        const dist = Math.sqrt((w / 2) ** 2 + h ** 2);
        // Base circle radius is 1000px (2000px diameter)
        return (dist / 1000) * 1.1;
      };

      // Initial state: small 20px white semi-circle pinned at bottom center
      // 2000px * 0.02 = 40px diameter -> 20px semi-circle height
      gsap.set(circle, { scale: 0.02, opacity: 1 });
      if (content) gsap.set(content, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Semi-circle expands to cover entire screen as user scrolls
      tl.to(circle, {
        scale: getCoverScale,
        duration: 1,
        ease: 'power2.inOut',
      });

      // 2. Content fades in cleanly once screen is covered in white
      if (content) {
        tl.to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.65
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="semi-circle-expand"
      aria-label="Expanding white semi-circle transition"
    >
      <div className={styles.stickyContainer}>
        {/* White Semi-Circle pinned at bottom center */}
        <div ref={circleRef} className={styles.semiCircle} />

        {/* Revealed content on white background */}
        <div ref={contentRef} className={styles.contentWrapper}>
          <span className={styles.tagline}>WHAT&apos;S NEXT</span>
          <h2 className={styles.heading}>
            Let&apos;s Build Something<br />
            <span className={styles.headingHighlight}>Extraordinary Together</span>
          </h2>
          <p className={styles.description}>
            Architecting high-performance web systems, agentic AI workflows, and bespoke digital experiences.
          </p>
          <MagneticButton
            variant="fill"
            size="lg"
            onClick={() => {
              const contactEl = document.querySelector('#contact');
              if (contactEl) {
                contactEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get In Touch
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
