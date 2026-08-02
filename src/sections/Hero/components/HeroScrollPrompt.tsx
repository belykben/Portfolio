import { forwardRef } from 'react';
import styles from '../Hero.module.css';

export const HeroScrollPrompt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.scrollBar} aria-hidden="true">
      <span>SCROLL DOWN</span>
      <span className={styles.scrollIndicator}>
        <span className={styles.scrollDot} />
      </span>
      <span>TO START THE JOURNEY</span>
    </div>
  );
});

HeroScrollPrompt.displayName = 'HeroScrollPrompt';
