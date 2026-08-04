import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Magnetic, MagneticButton } from '../MagneticButton';
import styles from './WarpModal.module.css';
import type { MenuItemData } from '../FlowingMenu';

export interface WarpModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MenuItemData | null;
  projects?: MenuItemData[];
  onSelectProject?: (project: MenuItemData) => void;
}

export const WarpModal: React.FC<WarpModalProps> = ({
  isOpen,
  onClose,
  project,
  projects = [],
  onSelectProject,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [renderedProject, setRenderedProject] = useState<MenuItemData | null>(project);
  const [copied, setCopied] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const bg3Ref = useRef<HTMLDivElement>(null);

  // Determine prev and next projects
  const currentIndex = projects && renderedProject
    ? projects.findIndex((p) => p.text === renderedProject.text)
    : -1;

  const prevProject = projects.length > 0 && currentIndex !== -1
    ? projects[(currentIndex - 1 + projects.length) % projects.length]
    : null;

  const nextProject = projects.length > 0 && currentIndex !== -1
    ? projects[(currentIndex + 1) % projects.length]
    : null;

  const handlePrev = () => {
    if (!prevProject || !onSelectProject) return;
    if (!contentRef.current) {
      onSelectProject(prevProject);
      return;
    }
    // Direction: Prev (Left to Right) — Current slides right (+70vw), new enters from left (-70vw -> 0)
    gsap.to(contentRef.current, {
      x: '70vw',
      opacity: 0,
      scale: 0.9,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        onSelectProject(prevProject);
        gsap.fromTo(
          contentRef.current,
          { x: '-70vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
        );
      },
    });
  };

  const handleNext = () => {
    if (!nextProject || !onSelectProject) return;
    if (!contentRef.current) {
      onSelectProject(nextProject);
      return;
    }
    // Direction: Next (Right to Left) — Current slides left (-70vw), new enters from right (+70vw -> 0)
    gsap.to(contentRef.current, {
      x: '-70vw',
      opacity: 0,
      scale: 0.9,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        onSelectProject(nextProject);
        gsap.fromTo(
          contentRef.current,
          { x: '70vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
        );
      },
    });
  };

  // Lock main page body scroll when modal is open to prevent scroll bleed
  useEffect(() => {
    if (!isOpen) return;

    // Pause Lenis smooth scroll engine
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      if (lenis) {
        lenis.start();
      }
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  // Preserve project details while close animation plays
  useEffect(() => {
    if (project) {
      setRenderedProject(project);
    }
  }, [project]);

  // Mount/Unmount lifecycle based on isOpen
  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
    }
  }, [isOpen, isMounted]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Copy Project Summary
  const handleCopySummary = async () => {
    if (!renderedProject) return;
    const textToCopy = `${renderedProject.text} - ${renderedProject.category}\nRole: ${renderedProject.role || 'Engineer'}\n\n${renderedProject.longDescription || renderedProject.description}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  // GSAP Warp Animation Timeline
  useEffect(() => {
    if (!isMounted) return;

    let tl: gsap.core.Timeline | null = null;

    if (isOpen) {
      // --- ENTER WARP ANIMATION ---
      tl = gsap.timeline();

      // 1. Parent Wrapper Fade In
      gsap.set(wrapperRef.current, { opacity: 0 });
      tl.to(wrapperRef.current, { opacity: 1, duration: 0.35, ease: 'power3.inOut' }, 0);

      // 2. 3D Content Initial Deformation
      gsap.set(contentRef.current, {
        rotateX: -5,
        skewY: -1.5,
        scaleY: 2,
        scaleX: 0.4,
        y: 100,
      });

      // Content Rotation / Scale Normalization
      tl.to(
        contentRef.current,
        {
          rotateX: 0,
          skewY: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 0.35,
          ease: 'power3.inOut',
        },
        0
      );

      // Content Spring Y Bounce
      tl.to(
        contentRef.current,
        {
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
        },
        0
      );

      // 3. Atmospheric Warp Background Blobs
      const enterDuration = 0.5;

      gsap.set(bg1Ref.current, {
        scale: 0,
        opacity: 1,
        backgroundColor: 'oklch(0.65 0.27 29 / 0.8)',
      });

      tl.to(
        bg1Ref.current,
        {
          scale: 10,
          opacity: 0.25,
          backgroundColor: 'oklch(0.89 0.029 195 / 0.4)',
          duration: enterDuration,
          ease: 'power1.inOut',
        },
        0
      );

      gsap.set([bg2Ref.current, bg3Ref.current], { opacity: 0, scale: 1 });

      tl.to(
        [bg2Ref.current, bg3Ref.current],
        {
          opacity: 0.85,
          duration: enterDuration,
          ease: 'none',
        },
        0
      );

      // Continuous Breathing Loop on Ambient Blobs
      gsap.to([bg2Ref.current, bg3Ref.current], {
        scale: 0.75,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.35,
      });
    } else {
      // --- EXIT WARP ANIMATION ---
      gsap.killTweensOf([bg2Ref.current, bg3Ref.current]);

      tl = gsap.timeline({
        onComplete: () => setIsMounted(false),
      });

      const exitDuration = 0.25;

      // Wrapper Fade Out
      tl.to(wrapperRef.current, { opacity: 0, duration: 0.35, ease: 'power3.inOut' }, 0);

      // Content Deform Back Out
      tl.to(
        contentRef.current,
        {
          rotateX: -5,
          skewY: -1.5,
          scaleY: 2,
          scaleX: 0.4,
          y: 100,
          duration: 0.35,
          ease: 'power3.inOut',
        },
        0
      );

      // Backgrounds Contract
      tl.to(
        bg1Ref.current,
        {
          scale: 0,
          opacity: 1,
          backgroundColor: 'oklch(0.65 0.27 29 / 0.8)',
          duration: exitDuration,
          ease: 'power1.inOut',
        },
        0
      );

      tl.to(
        [bg2Ref.current, bg3Ref.current],
        {
          opacity: 0,
          duration: exitDuration,
          ease: 'power1.inOut',
        },
        0
      );
    }

    return () => {
      if (tl) tl.kill();
    };
  }, [isOpen, isMounted]);

  if (!isMounted) return null;

  return createPortal(
    <>
      {/* Overlay Backdrop & Ambient Warp Blobs */}
      <div ref={overlayRef} className={styles.overlay}>
        <div ref={bg1Ref} className={styles.bg1} />
        <div ref={bg2Ref} className={styles.bg2} />
        <div ref={bg3Ref} className={styles.bg3} />
      </div>

      {/* Content Centering Wrapper */}
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        onClick={onClose}
      >
        <div
          ref={contentRef}
          onClick={(e) => e.stopPropagation()}
          className={styles.contentCard}
        >
          {/* Fixed Top Header (Centered Title) */}
          <div className={styles.header}>
            <div className={styles.headerSpacer} />
            <div className={styles.titleAreaCenter}>
              <h2 className={styles.title}>{renderedProject?.text ?? 'Project Details'}</h2>
            </div>
            <Magnetic strength={0.4}>
              <button
                onClick={onClose}
                className={styles.closeBtn}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </Magnetic>
          </div>

          {/* Middle Body with Isolated Scroll */}
          <div
            className={styles.body}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
          >
            <div className={styles.bodyInner}>
              {/* Meta Bar */}
              <div className={styles.metaBar}>
                {renderedProject?.category && (
                  <span className={styles.metaCategoryTag}>{renderedProject.category}</span>
                )}
                {renderedProject?.domain && (
                  <span className={styles.metaDomainTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span>{renderedProject.domain}</span>
                  </span>
                )}
                {renderedProject?.role && (
                  <span className={styles.metaRoleTag}>Role: {renderedProject.role}</span>
                )}
                {renderedProject?.period && (
                  <span className={styles.metaPeriodTag}>{renderedProject.period}</span>
                )}
              </div>

              {/* Executive Summary */}
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>Executive Summary & Overview</h3>
                <p className={styles.description}>
                  {renderedProject?.longDescription ||
                    renderedProject?.description ||
                    `High-performance architectural overview of ${renderedProject?.text ?? 'this project'
                    }. Built with modern full-stack patterns, reactive micro-animations, and enterprise scalability.`}
                </p>
              </div>

              {/* Metrics Grid */}
              {renderedProject?.metrics && renderedProject.metrics.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h3 className={styles.sectionHeading}>Core Metrics & Business Impact</h3>
                  <div className={styles.metricsGrid}>
                    {renderedProject.metrics.map((metric, idx) => (
                      <div key={idx} className={styles.metricCard}>
                        <span className={styles.metricValue}>{metric.value}</span>
                        <span className={styles.metricLabel}>{metric.label}</span>
                        {metric.subtext && <span className={styles.metricSubtext}>{metric.subtext}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Highlights & Resume Details */}
              {renderedProject?.highlights && renderedProject.highlights.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h3 className={styles.sectionHeading}>Key Architectural Accomplishments</h3>
                  <ul className={styles.highlightList}>
                    {renderedProject.highlights.map((item, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className={styles.highlightText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Architecture & Tech Stack */}
              {renderedProject?.techStack && renderedProject.techStack.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h3 className={styles.sectionHeading}>Technologies & Frameworks</h3>
                  <div className={styles.techGrid}>
                    {renderedProject.techStack.map((tech, idx) => (
                      <span key={idx} className={styles.techBadge}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy Specs Action Button */}
              <div className={styles.copyRow}>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                >
                  {copied ? 'Copied Full Technical Specs!' : 'Copy Full Technical Specs'}
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Footer Actions Nav */}
          <div className={styles.footerNav}>
            <MagneticButton
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={!prevProject}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Previous</span>
              </span>
            </MagneticButton>

            <MagneticButton
              variant="outline"
              size="md"
              onClick={() => window.open(renderedProject?.githubUrl || renderedProject?.link || 'https://github.com/belykben', '_blank')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>Explore Project</span>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </MagneticButton>

            <MagneticButton
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!nextProject}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Next</span>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default WarpModal;
