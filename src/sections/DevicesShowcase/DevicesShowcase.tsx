/**
 * DevicesShowcase.tsx
 *
 * Pinned responsive devices showcase section.
 * Features 3D perspective scroll animations revealing Laptop, Tablet, and Phone one by one.
 * Positioned right after the HeroStatement (counters) section.
 */

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ASSET_URLS } from '../../constants/assets.constants';
import styles from './DevicesShowcase.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DevicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRowRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const laptopRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const titleRow = titleRowRef.current;
      const leftText = leftTextRef.current;
      const rightText = rightTextRef.current;
      const subText = subTextRef.current;
      const bottomBar = bottomBarRef.current;
      const laptop = laptopRef.current;
      const tablet = tabletRef.current;
      const phone = phoneRef.current;

      // 1. Devices initial state (off-screen bottom with 3D rotation)
      if (phone) gsap.set(phone, { xPercent: -50, yPercent: 150, rotateX: 30, scale: 0.7, opacity: 0 });
      if (tablet) gsap.set(tablet, { xPercent: -50, yPercent: 150, rotateX: 30, scale: 0.7, opacity: 0 });
      if (laptop) gsap.set(laptop, { xPercent: -50, yPercent: 150, rotateX: 30, scale: 0.7, opacity: 0 });

      // 2. Compute exact target offsets so leftText and rightText move from centered CSS state to padding walls
      let leftTargetX = 0;
      let rightTargetX = 0;
      if (titleRow && leftText && rightText) {
        const titleRowW = titleRow.offsetWidth;
        const leftW = leftText.offsetWidth;
        const rightW = rightText.offsetWidth;

        const totalTextW = leftW + rightW + 20;
        const sideGap = Math.max(0, (titleRowW - totalTextW) / 2);

        leftTargetX = -sideGap;
        rightTargetX = sideGap;

        if (subText) {
          const subW = subText.offsetWidth;
          const centerSubX = (titleRowW - subW) / 2;
          const leftColInitialLeft = sideGap;
          const initialSubRelative = centerSubX - leftColInitialLeft;

          gsap.set(subText, { x: initialSubRelative, y: 0, opacity: 1 });
        }
      }

      if (leftText) gsap.set(leftText, { x: 0, y: 0 });
      if (rightText) gsap.set(rightText, { x: 0, y: 0 });

      // ── Master ScrollTrigger Timeline with GSAP Pinning ─────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=350%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // ── 1. Separate titles to sides and slide subText to left-aligned ──────
      if (leftText && rightText) {
        tl.to(
          leftText,
          { x: leftTargetX, duration: 0.18, ease: 'power2.inOut' },
          0
        ).to(
          rightText,
          { x: rightTargetX, duration: 0.18, ease: 'power2.inOut' },
          0
        );
      }

      if (subText) {
        tl.to(
          subText,
          { x: 0, duration: 0.18, ease: 'power2.inOut' },
          0
        );
      }

      if (bottomBar) {
        tl.fromTo(
          bottomBar,
          { opacity: 0.5, y: 15 },
          { opacity: 1, y: 0, duration: 0.08, ease: 'power1.out' },
          0
        );
      }

      // ── 2. Device 1: Phone (Enters Bottom -> Holds Center -> Exits Top) ─
      if (phone) {
        tl.to(
          phone,
          {
            xPercent: -50,
            yPercent: -50,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.04
        ).to(
          phone,
          {
            xPercent: -50,
            yPercent: -250,
            rotateX: -30,
            scale: 0.7,
            opacity: 0,
            duration: 0.14,
            ease: 'power2.in',
          },
          0.26
        );
      }

      // ── 3. Device 2: Tablet (Enters Bottom -> Holds Center -> Exits Top) ─
      if (tablet) {
        tl.to(
          tablet,
          {
            xPercent: -50,
            yPercent: -50,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.34
        ).to(
          tablet,
          {
            xPercent: -50,
            yPercent: -250,
            rotateX: -30,
            scale: 0.7,
            opacity: 0,
            duration: 0.14,
            ease: 'power2.in',
          },
          0.56
        );
      }

      // ── 4. Device 3: Laptop (Enters Bottom -> Holds Center -> Exits Top) ─
      if (laptop) {
        tl.to(
          laptop,
          {
            xPercent: -50,
            yPercent: -50,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.64
        ).to(
          laptop,
          {
            xPercent: -50,
            yPercent: -250,
            rotateX: -30,
            scale: 0.7,
            opacity: 0,
            duration: 0.14,
            ease: 'power2.in',
          },
          0.86
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="devices-showcase"
      aria-label="Responsive devices showcase"
    >
      <div className={styles.container}>
        {/* Animated Split Header */}
        <div className={styles.header}>
          <div ref={titleRowRef} className={styles.titleRow}>
            <div ref={leftTextRef} className={styles.leftColumn}>
              <h2 className={styles.mainTitleLeft}>Built in</h2>
              <p ref={subTextRef} className={styles.subTextLeft}>
                Luxury that adapts for all devices.
              </p>
            </div>

            <div ref={rightTextRef} className={styles.rightColumn}>
              <h2 className={styles.mainTitleRight}>Luxury</h2>
            </div>
          </div>
        </div>

        {/* 3D Device Stage */}
        <div className={styles.stage}>
          {/* Laptop */}
          <div
            ref={laptopRef}
            className={`${styles.deviceWrapper} ${styles.laptopWrapper}`}
          >
            <img
              src={ASSET_URLS.devices.laptop}
              alt="Laptop device mockup"
              className={styles.deviceImg}
              loading="lazy"
            />
          </div>

          {/* Tablet */}
          <div
            ref={tabletRef}
            className={`${styles.deviceWrapper} ${styles.tabletWrapper}`}
          >
            <img
              src={ASSET_URLS.devices.tablet}
              alt="Tablet device mockup"
              className={styles.deviceImg}
              loading="lazy"
            />
          </div>

          {/* Phone */}
          <div
            ref={phoneRef}
            className={`${styles.deviceWrapper} ${styles.phoneWrapper}`}
          >
            <img
              src={ASSET_URLS.devices.phone}
              alt="Phone device mockup"
              className={styles.deviceImg}
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom Description Bar */}
        <div ref={bottomBarRef} className={styles.bottomBar}>
          <span className={styles.bottomTag}>RESPONSIVE ECOSYSTEM</span>

          <div className={styles.bottomDesc}>
            <div className={styles.descTitle}>
              <span>CROSS-PLATFORM</span>
              <span>ALL DEVICES</span>
            </div>
            <p className={styles.descText}>
              Crafting seamless, responsive digital experiences across mobile,
              tablet, and desktop platforms. Every interface is meticulously built
              for high-performance execution and fluid visual elegance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
