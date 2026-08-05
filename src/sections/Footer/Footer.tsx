import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import resumeUrl from '../../../Benedict_Thomas_Updated_Resume_Final.html?url';
import Topography from '../../components/Topography/Topography';
import { TextRoll } from '../../components/TextRoll';
import styles from './Footer.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // TextRoll hover states
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [resumeHovered, setResumeHovered] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const allNameChars = contentRef.current!.querySelectorAll('.footer-name-char');
      const topRow = contentRef.current!.querySelector(`.${styles.topRow}`);
      const middleArea = contentRef.current!.querySelector(`.${styles.middleArea}`);
      const microBar = contentRef.current!.querySelector(`.${styles.microBar}`);

      const heroBtn = document.querySelector<HTMLElement>('[data-hero-download-btn]');
      const heroHeader = document.querySelector<HTMLElement>('[data-hero-navigation]');
      const btmNameLayer = document.querySelector<HTMLElement>('.btm-name-layer');

      // Initial states
      gsap.set([topRow, middleArea, microBar], { opacity: 0, y: 22 });
      gsap.set(allNameChars, { yPercent: 120, opacity: 0 });

      // Calculate Y to move hero btn to the top row of footer
      const calculateTopRowDeltaY = () => {
        if (!heroBtn || !topRow) return -window.innerHeight * 0.82;
        const btnRect = heroBtn.getBoundingClientRect();
        const rowRect = (topRow as HTMLElement).getBoundingClientRect();
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const rowCenterY = rowRect.top + rowRect.height / 2;
        return rowCenterY - btnCenterY;
      };

      const targetY = calculateTopRowDeltaY();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 95%',
          end: 'top 5%',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      });

      // Exit: hero nav and name layer fade up
      if (heroHeader) {
        tl.to(heroHeader, { opacity: 0, y: -20, duration: 0.5, ease: 'sine.inOut' }, 0);
      }
      if (btmNameLayer) {
        tl.to(btmNameLayer, { opacity: 0, y: -20, duration: 0.5, ease: 'sine.inOut' }, 0);
      }

      // Hero download button smoothly glides to the top row of footer and shrinks slightly
      if (heroBtn) {
        tl.to(
          heroBtn,
          {
            y: targetY,
            scale: 0.82,
            duration: 1,
            ease: 'sine.inOut',
            transformOrigin: 'center center',
          },
          0
        );
      }

      // Footer content enters
      tl.to(topRow, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.05);
      tl.to(middleArea, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
      tl.to(microBar, { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' }, 0.12);

      // Name chars: center-to-sides bottom-up lift
      tl.to(
        allNameChars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: { each: 0.036, from: 'center', ease: 'sine.inOut' },
          ease: 'power2.out',
        },
        0.08
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.footerWrapper} id="contact">
      <footer ref={contentRef} className={styles.footerContent}>

        {/* Topography WebGL Background */}
        <div className={styles.topographyBg}>
          <Topography
            lowColor="#020510"
            midColor="#150d36"
            highColor="#5b5fdc"
            speed={0.16}
            morphAmount={2.0}
            morphSpeed={0.032}
            bands={5}
            thickness={0.007}
            scale={2.2}
            pixelSize={1}
            glow={0.4}
            colorMode="elevation"
            contrast={2.0}
            brightness={1.0}
            fillBands={false}
            opacity={1}
            grain
            grainIntensity={0.022}
            mouseInteraction
            mouseRadius={0.3}
            mouseStrength={0.2}
          />
        </div>

        {/* ── TOP ROW: status / email / resume ── */}
        <div className={styles.topRow}>

          {/* Availability status */}
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>Available for projects</span>
          </div>

          {/* Email — center */}
          <a
            href="mailto:belykben@gmail.com"
            className={styles.heroEmail}
            onMouseEnter={() => setEmailHovered(true)}
            onMouseLeave={() => setEmailHovered(false)}
            aria-label="Email Benedict Thomas M"
          >
            <TextRoll active={emailHovered}>belykben@gmail.com</TextRoll>
          </a>

          {/* Download Resume — top right, plain underline link */}
          <a
            href={resumeUrl}
            download="Benedict_Thomas_M_Resume.html"
            className={styles.resumeLink}
            onMouseEnter={() => setResumeHovered(true)}
            onMouseLeave={() => setResumeHovered(false)}
            aria-label="Download Resume"
          >
            <TextRoll active={resumeHovered}>Download Resume</TextRoll>
            <span className={styles.resumeArrow} aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.25v7.1m0 0 2.75-2.75M8 9.35 5.25 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 10.5v2.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>

        {/* ── MIDDLE AREA: manifesto / links ── */}
        <div className={styles.middleArea}>

          {/* Left: editorial manifesto */}
          <div className={styles.manifesto}>
            <span className={styles.manifestoLabel}>Belief</span>
            <p className={styles.manifestoLine}>
              Design is not decoration.<br />
              <span className={styles.manifestoLineItalic}>It is intention made visible.</span>
            </p>
          </div>

          {/* Connect links */}
          <div className={styles.linkCol}>
            <span className={styles.linkColLabel}>Connect</span>
            {[
              { href: 'https://github.com/belykben', label: 'Github', external: true },
              { href: 'https://linkedin.com/in/belykben', label: 'LinkedIn', external: true },
              { href: 'mailto:belykben@gmail.com', label: 'Email', external: false },
            ].map(({ href, label, external }) => (
              <a
                key={label}
                href={href}
                className={styles.navLink}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onMouseEnter={() => setHoveredLink(label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <TextRoll active={hoveredLink === label}>{label}</TextRoll>
              </a>
            ))}
          </div>

          {/* Navigate links */}
          <div className={styles.linkCol}>
            <span className={styles.linkColLabel}>Navigate</span>
            {[
              { href: '#projects', label: 'Work' },
              { href: '#statement', label: 'Info' },
              { href: '#contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className={styles.navLink}
                onMouseEnter={() => setHoveredLink(`nav-${label}`)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <TextRoll active={hoveredLink === `nav-${label}`}>{label}</TextRoll>
              </a>
            ))}
          </div>
        </div>

        {/* ── BOTTOM NAME BLOCK ── */}
        <div className={styles.nameContainer}>
          <div className={styles.firstNameWrapper}>
            <h2 className={styles.firstName}>
              {Array.from('Benedict').map((char, index) => (
                <span key={index} className={styles.charMask}>
                  <span className={`${styles.nameChar} footer-name-char`}>{char}</span>
                </span>
              ))}
            </h2>
          </div>
          <div className={styles.lastNameWrapper}>
            <h2 className={styles.lastName}>
              {Array.from('Thomas M').map((char, index) => (
                <span key={index} className={styles.charMask}>
                  <span className={`${styles.nameChar} footer-name-char`}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              ))}
              <span className={styles.charMask}>
                <span className={`${styles.nameChar} ${styles.redDot} footer-name-char`}>.</span>
              </span>
            </h2>
          </div>
        </div>

        {/* ── MICRO BAR ── */}
        <div className={styles.microBar}>
          <span className={styles.microText}>© {new Date().getFullYear()} Benedict Thomas M.</span>
          <span className={styles.microText}>
            Crafted with <span className={styles.microAccent}>intention</span>
          </span>
        </div>

      </footer>
    </div>
  );
}
