import { forwardRef } from 'react';
import styles from '../Hero.module.css';

export const HeroScrollPrompt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.scrollBar} aria-hidden="true">
      <span className={styles.scrollCue}>
        <svg viewBox="0 0 16 16" fill="none">
          <path d="m4.5 5.5 3.5 3.5 3.5-3.5M4.5 8.5 8 12l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Scroll down</span>
      </span>
      <span>To start the journey</span>
    </div>
  );
});

HeroScrollPrompt.displayName = 'HeroScrollPrompt';
