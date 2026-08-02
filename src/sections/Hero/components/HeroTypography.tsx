import resumeUrl from '../../../../Benedict_Thomas_Updated_Resume_Final.html?url';
import { TextRoll } from '../../../components/TextRoll';
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

      <div className={styles.bottomCenter}>
        <a
          href={resumeUrl}
          download="Benedict_Thomas_M_Resume.html"
          className={styles.exploreBtn}
          aria-label="Download Benedict Thomas M resume"
        >
          <span>
            <TextRoll>Download Resume</TextRoll>
          </span>
          <span className={styles.exploreIcon} aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 2.25v7.1m0 0 2.75-2.75M8 9.35 5.25 6.6M3 10.5v2.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V10.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
