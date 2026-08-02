import { useRef } from 'react';
import { HeroPortal } from './components/HeroPortal';
import { HeroTypography } from './components/HeroTypography';
import { HeroScrollPrompt } from './components/HeroScrollPrompt';
import { useHeroAnimation } from './hooks/useHeroAnimation';
import styles from './Hero.module.css';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const setupImgRef = useRef<HTMLImageElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  useHeroAnimation({
    sectionRef,
    portalRef,
    setupImgRef,
    typographyRef,
    scrollPromptRef,
    transitionOverlayRef,
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.heroSection} btm-hero`}
      id="hero"
    >
      <HeroPortal
        ref={portalRef}
        setupImgRef={setupImgRef}
        transitionOverlayRef={transitionOverlayRef}
      />

      <HeroTypography ref={typographyRef} />

      <HeroScrollPrompt ref={scrollPromptRef} />
    </section>
  );
}
