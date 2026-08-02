import { useRef } from 'react';
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

  useHeroAnimation({
    sectionRef,
    portalRef,
    setupImgRef,
    headlineRef,
    supportingCopyRef,
    taglineRef,
    scrollPromptRef,
  });

  return (
    <>
      <HeroNavigation />
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
