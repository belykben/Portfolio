import styles from '../Hero.module.css';

interface HeroTypographyProps {
  headlineRef: React.RefObject<HTMLDivElement | null>;
  supportingCopyRef: React.RefObject<HTMLDivElement | null>;
  taglineRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroTypography({
  headlineRef,
  supportingCopyRef,
  taglineRef,
}: HeroTypographyProps) {
  return (
    <div className={styles.typographyWrapper}>
      <div ref={headlineRef} className={styles.topLeft}>
        <h1 className={styles.primaryHeadline}>
          <span>AI ideas</span>
          <span>made real</span>
        </h1>
      </div>

      <div ref={supportingCopyRef} className={styles.bottomLeft}>
        <p className={styles.subtext}>
          From concept to<br />capable systems
        </p>
        <span className={styles.copyRule} aria-hidden="true" />
        <p className={styles.supportingCopy}>
          Thoughtful engineering, clear interfaces, and scalable foundations.
        </p>
      </div>

      <div ref={taglineRef} className={styles.bottomRight}>
        <p className={styles.tagline}>
          <span>We are</span>
          <span>Builders</span>
        </p>
      </div>
    </div>
  );
}
