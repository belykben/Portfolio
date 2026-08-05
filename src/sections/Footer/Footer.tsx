import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LightRays from '../../components/LightRays/LightRays';
import styles from './Footer.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ScrollTrigger reveal animation
  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current!.querySelectorAll(`.${styles.mainBody} > *`),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('belykben@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScrollTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={wrapperRef} className={styles.footerWrapper} id="contact">
      <footer ref={contentRef} className={styles.footerContent}>
        {/* LightRays WebGL Background */}
        <div className={styles.lightRaysBg}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#818cf8"
            raysSpeed={1.2}
            lightSpread={0.85}
            rayLength={2.2}
            pulsating={true}
            followMouse={true}
            mouseInfluence={0.15}
            distortion={0.08}
            saturation={1.2}
          />
        </div>

        {/* Background glow and subtle monogram watermark */}
        <div className={styles.backgroundGlow} />
        <div className={styles.watermark}>BELYKBEN</div>

        {/* Top bar: Availability status & live IST time */}
        <div className={styles.topBar}>
          <div className={styles.statusBadge}>
            <span className={styles.pulseDot} />
            <span>Available for New Projects</span>
          </div>

          <div className={styles.timeWidget}>
            <span className={styles.timeLabel}>CHENNAI, IN (IST)</span>
            <span className={styles.timeValue}>{currentTime || '12:00:00 PM'}</span>
          </div>
        </div>

        {/* Main body: High impact CTA & Email pill */}
        <div className={styles.mainBody}>
          <h2 className={styles.headline}>
            LET’S BUILD SOMETHING <span className={styles.accentText}>EXTRAORDINARY.</span>
          </h2>

          <div className={styles.emailRow}>
            <a href="mailto:belykben@gmail.com" className={styles.emailPill} title="Send email to Benedict">
              <span className={styles.emailText}>belykben@gmail.com</span>
            </a>

            <button type="button" onClick={handleCopyEmail} className={styles.copyBtn}>
              {copied ? 'Copied ✓' : 'Copy Email'}
            </button>
          </div>

          {/* Links Grid */}
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <span className={styles.colTitle}>Navigation</span>
              <a href="#hero" className={styles.footerLink}>Home</a>
              <a href="#statement" className={styles.footerLink}>About</a>
              <a href="#showcase" className={styles.footerLink}>Architecture</a>
              <a href="#projects" className={styles.footerLink}>Works</a>
            </div>

            <div className={styles.linkColumn}>
              <span className={styles.colTitle}>Connect</span>
              <a href="https://github.com/belykben" target="_blank" rel="noreferrer" className={styles.footerLink}>
                GitHub ↗
              </a>
              <a href="https://linkedin.com/in/belykben" target="_blank" rel="noreferrer" className={styles.footerLink}>
                LinkedIn ↗
              </a>
              <a href="mailto:belykben@gmail.com" className={styles.footerLink}>
                Email ↗
              </a>
            </div>

            <div className={styles.linkColumn}>
              <span className={styles.colTitle}>Expertise</span>
              <span className={styles.footerLink}>Local AI & VLM</span>
              <span className={styles.footerLink}>Agentic SDLC</span>
              <span className={styles.footerLink}>Neo4j GraphRAG</span>
              <span className={styles.footerLink}>React & FastAPI</span>
            </div>
          </div>
        </div>

        {/* Bottom bar: Copyright & Back to Top */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Benedict Thomas M. Crafted with React & GSAP.
          </span>

          <button type="button" onClick={handleScrollTop} className={styles.scrollTopBtn}>
            <span>Back to Top</span>
            <span className={styles.arrowIcon}>↑</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
