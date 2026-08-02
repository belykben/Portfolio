import { TextRoll } from '../../../components/TextRoll';
import styles from '../Hero.module.css';

export function HeroNavigation() {
  return (
    <header className={styles.heroHeader} data-hero-navigation>
      <nav className={styles.primaryNav} aria-label="Primary navigation">
        <a href="#about"><TextRoll>About</TextRoll></a>
        <a href="#projects"><TextRoll>Work</TextRoll></a>
        <a href="#contact"><TextRoll>Contact</TextRoll></a>
      </nav>

      <nav className={styles.utilityNav} aria-label="Contact links">
        <a href="https://github.com/belykben" target="_blank" rel="noreferrer"><TextRoll>GitHub</TextRoll></a>
        <a href="mailto:benedictt06@gmail.com"><TextRoll>benedictt06@gmail.com</TextRoll></a>
      </nav>
    </header>
  );
}
