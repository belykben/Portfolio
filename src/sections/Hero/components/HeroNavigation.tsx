import styles from '../Hero.module.css';

export function HeroNavigation() {
  return (
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
  );
}
