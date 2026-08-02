import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { HERO_CONSTANTS } from '../constants/hero.constants';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface UseHeroAnimationParams {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  portalRef: React.RefObject<HTMLDivElement | null>;
  setupImgRef: React.RefObject<HTMLImageElement | null>;
  headlineRef?: React.RefObject<HTMLDivElement | null>;
  supportingCopyRef?: React.RefObject<HTMLDivElement | null>;
  taglineRef?: React.RefObject<HTMLDivElement | null>;
  scrollPromptRef?: React.RefObject<HTMLDivElement | null>;
}

export function useHeroAnimation({
  sectionRef,
  portalRef,
  setupImgRef,
  headlineRef,
  supportingCopyRef,
  taglineRef,
  scrollPromptRef,
}: UseHeroAnimationParams) {
  useGSAP(() => {
    const section = sectionRef.current;
    const portal = portalRef.current;
    const setupImg = setupImgRef.current;
    const headline = headlineRef?.current;
    const supportingCopy = supportingCopyRef?.current;
    const tagline = taglineRef?.current;
    const scrollPrompt = scrollPromptRef?.current;

    if (!section || !portal || !setupImg) return;

    gsap.set(portal, {
      transformOrigin: HERO_CONSTANTS.TRANSFORM_ORIGIN,
      scale: HERO_CONSTANTS.INITIAL_SCALE,
      willChange: 'transform',
      force3D: true,
    });

    gsap.set(setupImg, {
      willChange: 'transform',
      force3D: true,
    });

    const textPlanes = [headline, supportingCopy, tagline, scrollPrompt]
      .filter((element): element is HTMLDivElement => Boolean(element));

    gsap.set(textPlanes, {
      willChange: 'transform',
      force3D: true,
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${HERO_CONSTANTS.PIN_SPACER_VH}%`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    masterTL.eventCallback('onUpdate', () => {
      document.dispatchEvent(new CustomEvent('hero-parallax-progress', {
        detail: masterTL.progress(),
      }));
    });

    // The artwork is a distant plane travelling into the portal. The type sits
    // in front of it and takes separate, outward paths to create the parallax.
    masterTL.to(
      portal,
      {
        scale: HERO_CONSTANTS.FINAL_SCALE,
        xPercent: -2.5,
        yPercent: 1.5,
        ease: 'power1.out',
        duration: 0.98,
      },
      0
    );

    if (headline) {
      masterTL.to(headline, {
        x: () => -window.innerWidth * 1.15,
        y: () => -window.innerHeight * 0.34,
        scale: 2.2,
        rotation: -2,
        ease: 'power2.out',
        duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_END,
      }, HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_START);
    }

    if (supportingCopy) {
      masterTL.to(supportingCopy, {
        x: () => -window.innerWidth * 0.75,
        y: () => window.innerHeight * 0.55,
        scale: 1.72,
        rotation: -1.2,
        ease: 'power2.out',
        duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_EXIT_END,
      }, HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_START);
    }

    if (tagline) {
      masterTL.to(tagline, {
        x: () => window.innerWidth * 0.86,
        y: () => window.innerHeight * 0.45,
        scale: 2.28,
        rotation: 1.8,
        ease: 'power2.out',
        duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_END,
      }, HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_START);
    }

    if (scrollPrompt) {
      masterTL.to(scrollPrompt, {
        x: () => window.innerWidth * 0.38,
        y: () => window.innerHeight * 0.34,
        scale: 1.18,
        ease: 'power3.out',
        duration: HERO_CONSTANTS.TIMELINE_PHASES.TEXT_EXIT_END * 0.58,
      }, HERO_CONSTANTS.TIMELINE_PHASES.TEXT_ACCELERATION_START);
    }

    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    if (!setupImg.complete) {
      setupImg.addEventListener('load', refreshScrollTrigger, { once: true });
    } else {
      requestAnimationFrame(refreshScrollTrigger);
    }

    return () => {
      setupImg.removeEventListener('load', refreshScrollTrigger);
    };
  }, { scope: sectionRef });
}
