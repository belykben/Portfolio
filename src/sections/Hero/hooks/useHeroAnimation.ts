import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HERO_CONSTANTS } from '../constants/hero.constants';

gsap.registerPlugin(ScrollTrigger);

interface UseHeroAnimationParams {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  portalRef: React.RefObject<HTMLDivElement | null>;
  setupImgRef: React.RefObject<HTMLImageElement | null>;
  typographyRef?: React.RefObject<HTMLDivElement | null>;
  scrollPromptRef?: React.RefObject<HTMLDivElement | null>;
  transitionOverlayRef?: React.RefObject<HTMLDivElement | null>;
}

export function useHeroAnimation({
  sectionRef,
  portalRef,
  setupImgRef,
  typographyRef,
  scrollPromptRef,
  transitionOverlayRef,
}: UseHeroAnimationParams) {
  useEffect(() => {
    const section = sectionRef.current;
    const portal = portalRef.current;
    const setupImg = setupImgRef.current;
    const typography = typographyRef?.current;
    const scrollPrompt = scrollPromptRef?.current;
    const transitionOverlay = transitionOverlayRef?.current;

    if (!section || !portal || !setupImg) return;

    const ctx = gsap.context(() => {
      gsap.set(portal, {
        transformOrigin: HERO_CONSTANTS.TRANSFORM_ORIGIN,
        scale: HERO_CONSTANTS.INITIAL_SCALE,
        willChange: 'transform',
        force3D: true,
      });

      gsap.set(setupImg, {
        willChange: 'transform, opacity',
        force3D: true,
      });

      if (typography) {
        gsap.set(typography, {
          willChange: 'transform, opacity',
          force3D: true,
        });
      }

      if (scrollPrompt) {
        gsap.set(scrollPrompt, {
          willChange: 'transform, opacity',
          force3D: true,
        });
      }

      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${HERO_CONSTANTS.PIN_SPACER_VH}%`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (typography) {
        masterTL.to(
          typography,
          {
            y: -100,
            opacity: 0,
            scale: 0.96,
            ease: 'power2.in',
            duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_EXIT_END,
          },
          0
        );
      }

      if (scrollPrompt) {
        masterTL.to(
          scrollPrompt,
          {
            y: 40,
            opacity: 0,
            ease: 'power2.in',
            duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_EXIT_END * 0.6,
          },
          0
        );
      }

      masterTL.to(
        portal,
        {
          scale: HERO_CONSTANTS.FINAL_SCALE,
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      masterTL.to(
        setupImg,
        {
          opacity: 0,
          ease: 'power2.inOut',
          duration:
            HERO_CONSTANTS.TIMELINE_PHASES.HARDWARE_DISSOLVE_END -
            HERO_CONSTANTS.TIMELINE_PHASES.HARDWARE_DISSOLVE_START,
        },
        HERO_CONSTANTS.TIMELINE_PHASES.HARDWARE_DISSOLVE_START
      );

      if (transitionOverlay) {
        masterTL.to(
          transitionOverlay,
          {
            opacity: 0.45,
            ease: 'power1.out',
            duration: 0.25,
          },
          0.75
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [
    sectionRef,
    portalRef,
    setupImgRef,
    typographyRef,
    scrollPromptRef,
    transitionOverlayRef,
  ]);
}
