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

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './preloader.css';

gsap.registerPlugin(ScrollTrigger);

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
function getHeroNameSettle(preloaderContent: HTMLElement) {
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
  const targetCenterY =
    window.innerHeight - bottomPad - (source.height * scale) / 2;
  return {
    x: targetCenterX - sourceCenterX,
    y: targetCenterY - sourceCenterY,
    scale,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Preloader() {
  const mounted = useRef(false);

  useEffect(() => {
    // Strict-mode guard (shouldn't be in StrictMode, but just in case)
    if (mounted.current) return;
    mounted.current = true;

    const ctx = gsap.context(() => {
      // ── Step 1: Build character masks (same as vanilla HTML) ────
      document.querySelectorAll<HTMLElement>('[data-text]').forEach(createMaskedText);

      // ── Step 2: Grab DOM references ─────────────────────────────
      const preloaderContent = document.getElementById('btmPreloaderContent')!;
      const nameLayer        = document.querySelector<HTMLElement>('.btm-name-layer')!;
      const introBg          = document.querySelector<HTMLElement>('.btm-intro-bg')!;
      const transitionPanel  = document.querySelector<HTMLElement>('.btm-transition-panel')!;
      const tPanelRed        = document.querySelector<HTMLElement>('.btm-t-panel-red')!;
      const tPanelDark       = document.querySelector<HTMLElement>('.btm-t-panel-dark')!;
      const firstName        = document.querySelector<HTMLElement>('.btm-preloader-first')!;
      const lastName         = document.querySelector<HTMLElement>('.btm-preloader-last')!;
      const dotName          = document.querySelector<HTMLElement>('.btm-preloader-dot')!;
      const chars            = gsap.utils.toArray<HTMLElement>('.btm-char-reveal');
      const percentRef       = document.getElementById('btmPercentRef')!;
      const barRef           = document.getElementById('btmBarRef')!;

      // ── Step 3: Compute name settle position ─────────────────────
      window.scrollTo(0, 0);
      const nameSettle = getHeroNameSettle(preloaderContent);

      // ── Step 4: Scroll progress tracker ──────────────────────────
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (percentRef)
            percentRef.textContent = `(${Math.round(self.progress * 100)})`;
          if (barRef)
            barRef.style.transform = `scaleY(${Math.max(0.04, self.progress)})`;
        },
      });

      // ── Step 5: Initial GSAP set state ───────────────────────────
      gsap.set(preloaderContent, {
        scale: window.innerWidth <= 600 ? 0.72 : 0.44,
        transformOrigin: '50% 50%',
      });
      gsap.set(chars, { yPercent: 118 });
      gsap.set('.btm-preloader-dot .btm-char-reveal', { autoAlpha: 0 });
      gsap.set([tPanelDark, tPanelRed], { yPercent: 100 });
      gsap.set('.btm-hero-tagline, .btm-hero-nav', {
        autoAlpha: 0,
        clipPath: 'inset(0 0 100% 0)',
      });
      gsap.set('.btm-hero-line', { autoAlpha: 0, scaleX: 0 });

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
        .to({}, { duration: 0.22 })
        .to(preloaderContent, {
          ...nameSettle,
          duration: 0.78,
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
          '.btm-hero-tagline',
          { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.08, ease: 'power3.inOut' },
          '-=0.72',
        )
        .to(
          '.btm-hero-nav',
          { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.inOut' },
          '-=0.86',
        )
        .fromTo(
          '.btm-hero-line',
          { autoAlpha: 1, scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power3.inOut' },
          '<',
        )
        .set(nameLayer, { mixBlendMode: 'difference' }, '-=0.4')
        .set(transitionPanel, { display: 'none' });

      // ── Step 7: Hero background parallax ─────────────────────────
      gsap.to('.btm-hero-bg', {
        scale: 1.18,
        yPercent: 16,
        scrollTrigger: {
          trigger: '.btm-scroll-wrap',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // ── Step 8: Scroll-driven name split + reveal ─────────────────
      const exitLeft  = window.innerWidth <= 768 ? '-38vw' : '-55vw';
      const exitRight = window.innerWidth <= 768 ? '38vw'  : '55vw';

      const heroScroll = gsap.timeline({
        scrollTrigger: {
          trigger: '.btm-scroll-wrap',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      heroScroll
        .fromTo(
          preloaderContent,
          { x: nameSettle.x, y: nameSettle.y, scale: nameSettle.scale },
          { x: nameSettle.x, y: 0, duration: 0.3, ease: 'none', immediateRender: false },
          0,
        )
        .to(
          '.btm-hero-tagline, .btm-hero-nav, .btm-hero-line',
          { autoAlpha: 0, duration: 0.15, ease: 'none' },
          0,
        )
        .fromTo(
          firstName,
          { x: 0, autoAlpha: 1 },
          { x: exitLeft, autoAlpha: 0, duration: 0.7, ease: 'none', immediateRender: false },
          0.3,
        )
        .fromTo(
          [lastName, dotName],
          { x: 0, autoAlpha: 1 },
          { x: exitRight, autoAlpha: 0, duration: 0.7, ease: 'none', immediateRender: false },
          0.3,
        )
        .set(nameLayer, { autoAlpha: 0 }, 0.98);
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
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

      {/* ── Scroll progress indicators ───────────────────────────── */}
      <div className="btm-scroll-pct" id="btmPercentRef">(0)</div>
      <div className="btm-scroll-timeline" aria-hidden="true">
        <span>Hero</span>
        <div className="btm-scroll-track">
          <div className="btm-scroll-bar" id="btmBarRef" />
        </div>
      </div>

      {/* ── Main scroll container + hero + content ───────────────── */}
      <div className="btm-scroll-wrap">
        <section className="btm-hero">
          <div className="btm-hero-bg" aria-hidden="true" />

          <p className="btm-hero-tagline">
            Full Stack Python Developer,{' '}
            <em>bringing AI ideas to life,</em>
            <br />
            through systems, detail and scalable platforms.
          </p>

          <div className="btm-hero-line" aria-hidden="true" />

          <div className="btm-hero-nav">
            <span className="btm-version">➔ V3.0</span>
            <nav className="btm-hero-social">
              <a href="#work">Behance</a>
              <span className="sep">/</span>
              <a href="#">LinkedIn</a>
              <span className="sep">/</span>
              <a href="#">GitHub</a>
            </nav>
            <nav className="btm-hero-menu">
              <a href="#info">Info</a>
              <a href="#work">Work</a>
              <a href="#skills">Skills</a>
            </nav>
          </div>
        </section>
      </div>
    </>
  );
}
