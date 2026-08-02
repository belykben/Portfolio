import { forwardRef } from 'react';
import resumeUrl from '../../../../Benedict_Thomas_Updated_Resume_Final.html?url';
import styles from '../Hero.module.css';

export const HeroTypography = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.typographyWrapper}>
      <header className={styles.heroHeader}>
        <nav className={styles.primaryNav} aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#projects">Work</a>
          <a href="#contact">Contact</a>
        </nav>

        <nav className={styles.utilityNav} aria-label="Contact links">
          <a href="https://github.com/belykben" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:benedictt06@gmail.com">benedictt06@gmail.com</a>
        </nav>
      </header>

      <div className={styles.topLeft}>
        <h1 className={styles.primaryHeadline}>
          <span>AI ideas</span>
          <span>made real</span>
        </h1>
      </div>

      <div className={styles.bottomLeft}>
        <p className={styles.subtext}>
          From concept to<br />capable systems
        </p>
        <span className={styles.copyRule} aria-hidden="true" />
        <p className={styles.supportingCopy}>
          Thoughtful engineering, clear interfaces, and scalable foundations.
        </p>
      </div>

      <div className={styles.bottomRight}>
        <p className={styles.tagline}>
          <span>We are</span>
          <span>Builders</span>
        </p>
      </div>

      <div className={styles.bottomCenter}>
        <a
          href={resumeUrl}
          download="Benedict_Thomas_M_Resume.html"
          className={styles.exploreBtn}
          aria-label="Download Benedict Thomas M resume"
        >
          <span>Download Resume</span>
          <span className={styles.exploreIcon} aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 2.25v7.1m0 0 2.75-2.75M8 9.35 5.25 6.6M3 10.5v2.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V10.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
});

HeroTypography.displayName = 'HeroTypography';
