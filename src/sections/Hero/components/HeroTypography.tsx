import { forwardRef } from 'react';
import styles from '../Hero.module.css';

export const HeroTypography = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.typographyWrapper}>
      <div className={styles.topLeft}>
        <h1 className={styles.primaryHeadline}>
          <span>We are</span>
          <span>Engineers</span>
        </h1>
      </div>

      <div className={styles.bottomLeft}>
        <p className={styles.subtext}>
          Your gateway to<br />intelligent systems
        </p>
      </div>

      <div className={styles.bottomRight}>
        <p className={styles.tagline}>
          <span>We are</span>
          <span>Builders</span>
        </p>
      </div>

      <div className={styles.bottomCenter}>
        <a href="#about" className={styles.exploreBtn}>
          Explore Work
        </a>
      </div>
    </div>
  );
});

HeroTypography.displayName = 'HeroTypography';
