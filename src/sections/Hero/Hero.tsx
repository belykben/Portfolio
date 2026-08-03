import { useRef, useState } from 'react';
import gsap from 'gsap';
import resumeUrl from '../../../Benedict_Thomas_Updated_Resume_Final.html?url';
import { TextRoll } from '../../components/TextRoll';
import { HeroNavigation } from './components/HeroNavigation';
import { HeroPortal } from './components/HeroPortal';
import { HeroTypography } from './components/HeroTypography';
import { HeroScrollPrompt } from './components/HeroScrollPrompt';
import { useHeroAnimation } from './hooks/useHeroAnimation';
import styles from './Hero.module.css';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const setupImgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const supportingCopyRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  useHeroAnimation({
    sectionRef,
    portalRef,
    setupImgRef,
    headlineRef,
    supportingCopyRef,
    taglineRef,
    scrollPromptRef,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    gsap.to(btnRef.current, {
      x: distanceX * 0.38,
      y: distanceY * 0.38,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    setIsBtnHovered(true);
  };

  const handleMouseLeave = () => {
    setIsBtnHovered(false);
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.35)',
    });
  };

  return (
    <>
      <HeroNavigation />
      <div className={styles.bottomCenter}>
        <a
          ref={btnRef}
          href={resumeUrl}
          download="Benedict_Thomas_M_Resume.html"
          className={styles.exploreBtn}
          aria-label="Download Benedict Thomas M resume"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span>
            <TextRoll active={isBtnHovered}>Download Resume</TextRoll>
          </span>
          <span className={styles.exploreIcon} aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                className={styles.arrowStem}
                d="M8 2.25v7.1m0 0 2.75-2.75M8 9.35 5.25 6.6"
                stroke="currentColor"
                strokeWidth="1.45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.arrowTray}
                d="M3 10.5v2.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V10.5"
                stroke="currentColor"
                strokeWidth="1.45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
      <section
        ref={sectionRef}
        className={`${styles.heroSection} btm-hero`}
        id="hero"
      >
        <HeroPortal
          ref={portalRef}
          setupImgRef={setupImgRef}
        />

        <HeroTypography
          headlineRef={headlineRef}
          supportingCopyRef={supportingCopyRef}
          taglineRef={taglineRef}
        />

        <HeroScrollPrompt ref={scrollPromptRef} />
      </section>
    </>
  );
}
