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
import CinematicBackground from './CinematicBackground';
import TextRoll from './TextRoll';
import './preloader.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─────────────────────────────────────────────────────────────────────────────
// char mask builder — exact copy of createMaskedText() from the reference
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// settle calculation — exact copy of getHeroNameSettle() from the reference
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = preloaderRef.current;
    if (!root) return;

      // ── Step 1: Build character masks (same as vanilla HTML) ────
      root.querySelectorAll<HTMLElement>('[data-text]').forEach(createMaskedText);

      // ── Step 2: Grab DOM references ─────────────────────────────
      const preloaderContent = root.querySelector<HTMLElement>('#btmPreloaderContent')!;
      const introBg          = root.querySelector<HTMLElement>('.btm-intro-bg')!;
      const transitionPanel  = root.querySelector<HTMLElement>('.btm-transition-panel')!;
      const tPanelRed        = root.querySelector<HTMLElement>('.btm-t-panel-red')!;
      const tPanelDark       = root.querySelector<HTMLElement>('.btm-t-panel-dark')!;
      const chars            = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.btm-char-reveal'));

      // ── Step 3: Compute name settle position ─────────────────────
      window.scrollTo(0, 0);
      const nameBottomSettle = getHeroNameBottomSettle(preloaderContent);
      const nameLock = getHeroNameLock(preloaderContent);

      // ── Step 4: Scroll progress tracker ──────────────────────────
      // ── Step 5: Initial GSAP set state ───────────────────────────
      gsap.set(preloaderContent, {
        scale: window.innerWidth <= 600 ? 0.72 : 0.44,
        transformOrigin: '50% 50%',
      });
      gsap.set(chars, { yPercent: 118 });
      gsap.set('.btm-preloader-dot .btm-char-reveal', { autoAlpha: 0 });
      gsap.set([tPanelDark, tPanelRed], { yPercent: 100 });

      // ── Step 6: Intro animation timeline (matches reference exactly)
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

      // ── Step 8: Match the name to the hero's exact rendered progress ──
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
          <span className="btm-preloader-segment btm-preloader-last"  data-text="Thomas M" />
          <span className="btm-preloader-segment btm-preloader-dot"   data-text="." />
        </div>
      </div>

      {/* ── Main scroll container + hero + blended empty sections ── */}
      <div className="btm-scroll-wrap">
        <div className="btm-bg-layer">
          <CinematicBackground />
        </div>
        <Hero />

        <HeroStatement />

        {/* ── Section 1: Overview ──────────────────────────────── */}
        <section className="btm-section btm-section-about" id="about">
          <div className="btm-section-container">
            <span className="btm-section-tag">01 // OVERVIEW</span>
            <h2 className="btm-section-title">About & Philosophy</h2>
            <div className="btm-grid-placeholder">
              <div className="btm-card-placeholder">
                <span className="btm-card-num">01</span>
                <h3>Architecture & Systems</h3>
                <p>Building high-performance web applications with modern design systems and smooth micro-interactions.</p>
              </div>
              <div className="btm-card-placeholder">
                <span className="btm-card-num">02</span>
                <h3>Creative Engineering</h3>
                <p>Blending motion, physics, and atmospheric visuals with rock-solid frontend engineering.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Portfolio ─────────────────────────────── */}
        <section className="btm-section btm-section-projects" id="projects">
          <div className="btm-section-container">
            <span className="btm-section-tag">02 // PORTFOLIO</span>
            <h2 className="btm-section-title">Featured Projects</h2>
            <div className="btm-grid-placeholder btm-grid-3">
              <div className="btm-card-placeholder">
                <span className="btm-card-num">01</span>
                <h3>Cinematic Hero Engine</h3>
                <p>Multi-layered atmospheric cloud engine with 60 FPS translate3d depth layering.</p>
              </div>
              <div className="btm-card-placeholder">
                <span className="btm-card-num">02</span>
                <h3>Interactive Design Systems</h3>
                <p>Tailored UI components with zero-dependency animations and dark mode aesthetic.</p>
              </div>
              <div className="btm-card-placeholder">
                <span className="btm-card-num">03</span>
                <h3>Full-Stack Applications</h3>
                <p>Scalable web applications built for speed, responsiveness, and user engagement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Contact ───────────────────────────────── */}
        <section className="btm-section btm-section-contact" id="contact">
          <div className="btm-section-container btm-contact-container">
            <span className="btm-section-tag">03 // CONNECT</span>
            <h2 className="btm-section-title">Let's Create Together</h2>
            <p className="btm-contact-desc">
              Currently available for select engineering projects, creative UI visual systems, and full-stack positions.
            </p>
            <div className="btm-contact-actions">
              <a href="mailto:contact@example.com" className="btm-btn-primary">
                <TextRoll>Get In Touch</TextRoll>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
