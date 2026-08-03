/**
 * Preloader.tsx
 *
 * Direct port of standalone-preloader-demo.html into React.
 *
 * Key decisions:
 * - Uses a plain global CSS file (preloader.css) with btm- prefix so GSAP
 *   string selectors (e.g. '.btm-char-reveal') work without CSS-module hashing.
 * - Uses a single useEffect (not useGSAP) so we control the full lifecycle.
 *   The effect runs once after mount, char masks are built synchronously inside
 *   it before GSAP touches anything — same as the vanilla HTML <script>.
 * - All GSAP set/to calls and selectors match the reference 1:1.
 * - cleanup: gsap.context().revert() to kill all tweens/ScrollTriggers on unmount.
 */

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Hero from '../sections/Hero/Hero';
import HeroStatement from '../sections/HeroStatement/HeroStatement';
import DevicesShowcase from '../sections/DevicesShowcase/DevicesShowcase';
import Projects from '../sections/Projects/Projects';
import CinematicBackground from './CinematicBackground';
import './preloader.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function createMaskedText(el: HTMLElement) {
  const text = el.getAttribute('data-text') ?? '';
  el.innerHTML = '';
  Array.from(text).forEach((char) => {
    if (char === ' ') {
      const span = document.createElement('span');
      span.className = 'btm-char-mask btm-space';
      span.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'btm-char-reveal';
      span.appendChild(inner);
      el.appendChild(span);
    } else {
      const span = document.createElement('span');
      span.className = 'btm-char-mask';
      const inner = document.createElement('span');
      inner.className = 'btm-char-reveal';
      inner.textContent = char;
      span.appendChild(inner);
      el.appendChild(span);
    }
  });
}

function getHeroNameBottomSettle(preloaderContent: HTMLElement) {
  gsap.set(preloaderContent, { clearProps: 'transform' });
  const source = preloaderContent.getBoundingClientRect();
  const mobile = window.innerWidth <= 768;
  const pad = mobile ? 20 : 48;
  const bottomPad = mobile ? Math.max(window.innerHeight * 0.2, 168) : 126;
  const targetWidth = Math.max(280, window.innerWidth - pad * 2);
  const scale = Math.min(targetWidth / source.width, 2.65);
  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const targetCenterX = window.innerWidth / 2;
  const targetCenterY = window.innerHeight - bottomPad - (source.height * scale) / 2;

  return {
    x: targetCenterX - sourceCenterX,
    y: targetCenterY - sourceCenterY,
    scale,
  };
}

function getHeroNameLock(preloaderContent: HTMLElement) {
  gsap.set(preloaderContent, { clearProps: 'transform' });
  const source = preloaderContent.getBoundingClientRect();
  const mobile = window.innerWidth <= 768;
  const targetWidth = mobile
    ? Math.min(window.innerWidth - 48, 300)
    : Math.min(window.innerWidth * 0.32, 560);
  const scale = Math.min(targetWidth / source.width, mobile ? 0.62 : 0.52);
  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const targetCenterX = window.innerWidth / 2;
  const targetCenterY = window.innerHeight * 0.47;
  return {
    x: targetCenterX - sourceCenterX,
    y: targetCenterY - sourceCenterY,
    scale,
  };
}

function getHeroNameHeaderLock(preloaderContent: HTMLElement) {
  const navigation = document.querySelector<HTMLElement>('[data-hero-navigation]');
  const navigationBounds = navigation?.getBoundingClientRect();
  const mobile = window.innerWidth <= 768;
  const targetWidth = mobile
    ? Math.min(window.innerWidth * 0.42, 176)
    : Math.min(window.innerWidth * 0.12, 232);
  const headerCenterY = navigationBounds
    ? navigationBounds.top + navigationBounds.height / 2
    : Math.min(Math.max(window.innerHeight * 0.041, 32), 48) + 10;

  return {
    x: 0,
    y: headerCenterY - window.innerHeight / 2,
    scale: targetWidth / preloaderContent.offsetWidth,
  };
}

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = preloaderRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>('[data-text]').forEach(createMaskedText);

    const preloaderContent = root.querySelector<HTMLElement>('#btmPreloaderContent')!;
    const introBg = root.querySelector<HTMLElement>('.btm-intro-bg')!;
    const transitionPanel = root.querySelector<HTMLElement>('.btm-transition-panel')!;
    const tPanelRed = root.querySelector<HTMLElement>('.btm-t-panel-red')!;
    const tPanelDark = root.querySelector<HTMLElement>('.btm-t-panel-dark')!;
    const chars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.btm-char-reveal'));

    window.scrollTo(0, 0);
    const nameBottomSettle = getHeroNameBottomSettle(preloaderContent);
    const nameLock = getHeroNameLock(preloaderContent);

    gsap.set(preloaderContent, {
      scale: window.innerWidth <= 600 ? 0.72 : 0.44,
      transformOrigin: '50% 50%',
    });
    gsap.set(chars, { yPercent: 118 });
    gsap.set('.btm-preloader-dot .btm-char-reveal', { autoAlpha: 0 });
    gsap.set([tPanelDark, tPanelRed], { yPercent: 100 });

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

    intro
      .to(chars, {
        yPercent: 0,
        duration: 0.44,
        ease: 'power3.out',
        stagger: { each: 0.025, from: 'center' },
      })
      .to(
        '.btm-preloader-dot .btm-char-reveal',
        { autoAlpha: 1, duration: 0.22, ease: 'power2.out' },
        '-=0.1',
      )
      .to({}, { duration: 0.16 })
      .to(preloaderContent, {
        ...nameBottomSettle,
        duration: 0.88,
        ease: 'power3.inOut',
      })
      .to(
        tPanelDark,
        { yPercent: 0, duration: 0.45, ease: 'power3.inOut' },
        '<+=0.05',
      )
      .to(
        tPanelRed,
        { yPercent: 0, duration: 0.45, ease: 'power3.inOut' },
        '-=0.3',
      )
      .set(introBg, { display: 'none' })
      .to(tPanelRed, { yPercent: -100, duration: 0.56, ease: 'power3.inOut' })
      .to(
        tPanelDark,
        { yPercent: -100, duration: 0.56, ease: 'power3.inOut' },
        '-=0.42',
      )
      .to(
        preloaderContent,
        { ...nameLock, duration: 0.78, ease: 'power4.out' },
        '<+=0.1',
      )
      .set(transitionPanel, { display: 'none' });

    const moveNameIntoHeader = (event: Event) => {
      const heroProgress = (event as CustomEvent<number>).detail;
      const progress = Math.min(heroProgress / 0.76, 1);
      const headerLock = getHeroNameHeaderLock(preloaderContent);

      gsap.set(preloaderContent, {
        x: gsap.utils.interpolate(nameLock.x, headerLock.x, progress),
        y: gsap.utils.interpolate(nameLock.y, headerLock.y, progress),
        scale: gsap.utils.interpolate(nameLock.scale, headerLock.scale, progress),
      });
    };

    document.addEventListener('hero-parallax-progress', moveNameIntoHeader);

    return () => {
      document.removeEventListener('hero-parallax-progress', moveNameIntoHeader);
    };
  }, { scope: preloaderRef });

  return (
    <div ref={preloaderRef} className="btm-preloader-root">
      {/* ── Intro background overlay ────────────────────────────── */}
      <div className="btm-intro-bg" aria-hidden="true" />

      {/* ── Red / Dark transition panels ────────────────────────── */}
      <div className="btm-transition-panel" aria-hidden="true">
        <div className="btm-t-panel-dark" />
        <div className="btm-t-panel-red" />
      </div>

      {/* ── Fixed name layer ─────────────────────────────────────── */}
      <div className="btm-name-layer" aria-hidden="true">
        <div className="btm-preloader-content" id="btmPreloaderContent">
          <span className="btm-preloader-segment btm-preloader-first" data-text="Benedict" />
          <span className="btm-preloader-segment btm-preloader-last" data-text="Thomas M" />
          <span className="btm-preloader-segment btm-preloader-dot" data-text="." />
        </div>
      </div>

      {/* ── Main scroll container + hero + blended empty sections ── */}
      <div className="btm-scroll-wrap">
        <div className="btm-bg-layer">
          <CinematicBackground />
        </div>
        <Hero />
        <HeroStatement />
        <DevicesShowcase />
        <Projects />
      </div>
    </div>
  );
}
