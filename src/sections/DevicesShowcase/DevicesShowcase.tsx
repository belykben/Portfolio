import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ASSET_URLS } from '../../constants/assets.constants';
import Skills from '../../components/Skills';
import styles from './DevicesShowcase.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const renderLetters = (text: string, highlightWord?: string) => {
  const words = text.split(' ');
  return words.map((word, wIdx) => {
    const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
    const letters = word.split('');
    return (
      <span key={wIdx} className={styles.wordSpan}>
        {letters.map((char, cIdx) => (
          <span
            key={cIdx}
            className={`${styles.charSpan} ${isHighlight ? styles.textHighlight : ''}`}
          >
            {char}
          </span>
        ))}
        {wIdx < words.length - 1 && <span className={styles.charSpan}>&nbsp;</span>}
      </span>
    );
  });
};

export default function DevicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRowRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const laptopRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const overlayLeftRef = useRef<HTMLDivElement>(null);
  const overlayRightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const header = headerRef.current;
      const titleRow = titleRowRef.current;
      const leftText = leftTextRef.current;
      const rightText = rightTextRef.current;
      const subText = subTextRef.current;
      const bottomBar = bottomBarRef.current;
      const laptop = laptopRef.current;
      const tablet = tabletRef.current;
      const phone = phoneRef.current;
      const overlay = overlayRef.current;
      const panel1 = panel1Ref.current;
      const panel2 = panel2Ref.current;
      const overlayLeft = overlayLeftRef.current;
      const overlayRight = overlayRightRef.current;

      const overlayLeftChars = overlayLeftRef.current?.querySelectorAll(`.${styles.charSpan}`);
      const overlayRightChars = overlayRightRef.current?.querySelectorAll(`.${styles.charSpan}`);
      const skillsListEl = panel2Ref.current?.querySelector<HTMLElement>('.skills-list');

      // 1. Initial state setup
      if (phone) gsap.set(phone, { xPercent: -50, yPercent: 150, rotateX: 30, scale: 0.7, opacity: 0 });
      if (tablet) gsap.set(tablet, { xPercent: -50, yPercent: 150, rotateX: 30, scale: 0.7, opacity: 0 });
      if (laptop) gsap.set(laptop, { xPercent: -50, yPercent: 150, rotateX: 30, rotateZ: 0, scale: 0.7, opacity: 0 });
      if (overlay) gsap.set(overlay, { y: '-100vh', opacity: 0 });
      if (panel1) gsap.set(panel1, { xPercent: 0, opacity: 1 });
      if (panel2) gsap.set(panel2, { xPercent: 100, opacity: 1 });
      if (skillsListEl) gsap.set(skillsListEl, { y: 0 });

      if (overlayLeft) gsap.set(overlayLeft, { transformOrigin: 'left center', x: 0, scale: 1, opacity: 1 });
      if (overlayRight) gsap.set(overlayRight, { transformOrigin: 'left center', x: 0, scale: 1, opacity: 1 });
      if (overlayLeftChars) gsap.set(overlayLeftChars, { opacity: 1 });
      if (overlayRightChars) gsap.set(overlayRightChars, { opacity: 1 });

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
          end: '+=700%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // ── 1. Separate titles to sides and slide subText to left-aligned ──────
      if (leftText && rightText) {
        tl.to(
          leftText,
          { x: leftTargetX, duration: 0.15, ease: 'power2.inOut' },
          0
        ).to(
          rightText,
          { x: rightTargetX, duration: 0.15, ease: 'power2.inOut' },
          0
        );
      }

      if (subText) {
        tl.to(
          subText,
          { x: 0, duration: 0.15, ease: 'power2.inOut' },
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
            duration: 0.15,
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
            duration: 0.12,
            ease: 'power2.in',
          },
          0.24
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
            duration: 0.15,
            ease: 'power2.out',
          },
          0.30
        ).to(
          tablet,
          {
            xPercent: -50,
            yPercent: -250,
            rotateX: -30,
            scale: 0.7,
            opacity: 0,
            duration: 0.12,
            ease: 'power2.in',
          },
          0.50
        );
      }

      // ── 4. Device 3: Laptop (Enters Bottom -> PINNED in Center, Scales BIG & Rotates Clockwise) ─
      if (laptop) {
        tl.to(
          laptop,
          {
            xPercent: -50,
            yPercent: -50,
            rotateX: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            duration: 0.15,
            ease: 'power2.out',
          },
          0.58
        ).to(
          laptop,
          {
            xPercent: -50,
            yPercent: -50,
            rotateX: 0,
            rotateZ: 6,
            scale: 1.25,
            opacity: 1,
            duration: 0.18,
            ease: 'none',
          },
          0.72
        );
      }

      // ── 5. Initial text contents exit DOWNWARD as Overlay enters from TOP ──
      if (header) {
        tl.to(
          header,
          {
            y: '100vh',
            opacity: 0,
            duration: 0.18,
            ease: 'none',
          },
          0.72
        );
      }

      if (bottomBar) {
        tl.to(
          bottomBar,
          {
            y: '100vh',
            opacity: 0,
            duration: 0.18,
            ease: 'none',
          },
          0.72
        );
      }

      if (overlay) {
        tl.to(
          overlay,
          {
            y: '0vh',
            opacity: 1,
            duration: 0.18,
            ease: 'none',
          },
          0.72
        );
      }

      // ── 6A. Step 1: Letter-by-letter snappy fade + Container scales down left ──
      if (overlayLeft) {
        tl.to(
          overlayLeft,
          {
            x: -160,
            scale: 0.75,
            duration: 0.25,
            ease: 'power2.in',
          },
          1.00
        );
      }

      if (overlayLeftChars && overlayLeftChars.length > 0) {
        tl.to(
          overlayLeftChars,
          {
            opacity: 0,
            stagger: 0.006,
            duration: 0.06,
            ease: 'power1.in',
          },
          1.00
        );
      }

      if (overlayRight) {
        tl.to(
          overlayRight,
          {
            x: -160,
            scale: 0.75,
            duration: 0.25,
            ease: 'power2.in',
          },
          1.02
        );
      }

      if (overlayRightChars && overlayRightChars.length > 0) {
        tl.to(
          overlayRightChars,
          {
            opacity: 0,
            stagger: 0.006,
            duration: 0.06,
            ease: 'power1.in',
          },
          1.02
        );
      }

      // ── 6B. Step 2: Laptop stays PINNED in center until Panel 2 content contacts & pushes it left ──
      if (panel2) {
        tl.to(
          panel2,
          {
            xPercent: 0,
            duration: 0.40,
            ease: 'none',
          },
          1.28
        );
      }

      if (laptop) {
        tl.to(
          laptop,
          {
            xPercent: -180,
            rotateZ: 6,
            scale: 1.25,
            opacity: 0,
            duration: 0.24,
            ease: 'none',
          },
          1.44
        );
      }

      // ── 6C. Step 3: Panel 2 Right Content (.skills-list) SCROLLS UPWARD until last group touches screen center ──
      if (skillsListEl) {
        const lastGroupEl = skillsListEl.lastElementChild as HTMLElement;
        const lastGroupOffset = lastGroupEl ? lastGroupEl.offsetTop : 0;
        const initialListTop = skillsListEl.offsetTop;

        // Position of last group's top edge relative to viewport top when y = 0
        const lastGroupYInViewport = initialListTop + lastGroupOffset;
        const viewportCenter = window.innerHeight * 0.7;

        // targetY brings the top edge of the last group to 50vh (screen center) and stops
        const targetY = Math.max(0, lastGroupYInViewport - viewportCenter);

        if (targetY > 0) {
          tl.to(
            skillsListEl,
            {
              y: -targetY,
              duration: 0.60,
              ease: 'none',
            },
            1.68
          );
        }
      }

      // ── 7. Reverse-Scroll Illusion: Next Section (#about) enters IMMEDIATELY as last element touches center ──
      const aboutSection = document.querySelector<HTMLElement>('#about');

      if (aboutSection) {
        gsap.set(aboutSection, {
          zIndex: 20,
          yPercent: -120,
        });

        tl.to(
          aboutSection,
          {
            yPercent: 0,
            duration: 0.25,
            ease: 'none',
          },
          2.18
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
        <div ref={headerRef} className={styles.header}>
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

        {/* New Overlay (Enters from TOP when Laptop is pinned) */}
        <div ref={overlayRef} className={styles.newOverlay}>
          {/* PANEL 1: Initial statements floating over center laptop */}
          <div ref={panel1Ref} className={styles.panel1}>
            <div ref={overlayLeftRef} className={styles.overlayLeft}>
              <h3 className={styles.overlayLeftText}>
                {renderLetters('Loose coupling in the architecture,', 'architecture')}
              </h3>
            </div>

            <div ref={overlayRightRef} className={styles.overlayRight}>
              <h3 className={styles.overlayRightText}>
                {renderLetters('tight intelligence in the agents.', 'agents')}
              </h3>
            </div>
          </div>

          {/* PANEL 2: "A peek inside my / developer toolbox." using imported Skills component */}
          <div ref={panel2Ref} className={styles.panel2}>
            <Skills
              id="skills-showcase-panel"
              title={
                <>
                  A peek inside my<br />
                  <span className="skill-title-highlight">developer toolbox.</span>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
