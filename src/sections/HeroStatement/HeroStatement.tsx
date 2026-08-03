/**
 * HeroStatement.tsx
 *
 * Scroll-driven character-by-character text highlight section with lottery machine number roller animation.
 */

import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './HeroStatement.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Content ─────────────────────────────────────────────────────────────────
const STATEMENT =
  "I build experiences that live at the intersection of AI engineering and creative development. My passion lies in transforming complex ideas into products that are both intelligent and visually captivating, from AI-powered platforms and autonomous workflows to immersive websites filled with fluid motion, cinematic visuals, and thoughtful interactions. For me, great software isn't just about solving problems. It's about creating experiences people remember.";

// Words that get the orange accent colour instead of plain white
const ACCENT_WORDS = new Set([
  'AI',
  'engineering',
  'creative',
  'intelligent',
  'visually',
  'captivating',
  'AI-powered',
  'autonomous',
  'immersive',
  'fluid',
  'cinematic',
  'thoughtful',
  'remember.',
]);

// Metrics data for lottery roller
const STATS = [
  { rawValue: 3, suffix: '+', label: 'Years Experience', detail: 'Engineering AI & Web Systems' },
  { rawValue: 20, suffix: '+', label: 'Enterprise Features', detail: 'Shipped to Active Workflows' },
  { rawValue: 6, suffix: '+', label: 'AI Products', detail: 'Autonomous Engines & Agents' },
  { rawValue: 15, suffix: '+', label: 'Full-Stack Projects', detail: 'End-to-End Architecture' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseStatement(text: string) {
  const words = text.split(' ');
  return words.map((word) => {
    const isAccent = ACCENT_WORDS.has(word);
    const chars = Array.from(word).map((char) => ({
      char,
      isAccent,
    }));
    return {
      word,
      isAccent,
      chars,
    };
  });
}

// Generate vertical reel numbers (2 full rotations + target digit) for slot machine effect
function generateReelDigits(targetDigit: number): number[] {
  const list: number[] = [];
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i <= 9; i++) {
      list.push(i);
    }
  }
  for (let i = 0; i <= targetDigit; i++) {
    list.push(i);
  }
  return list;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reelTrackRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  const parsedWords = useMemo(() => parseStatement(STATEMENT), []);

  // Pre-calculate reel digit arrays for each stat and digit column
  const parsedStats = useMemo(() => {
    return STATS.map((stat) => {
      const digitsStr = String(stat.rawValue);
      const digitColumns = Array.from(digitsStr).map((d) => {
        const targetDigit = parseInt(d, 10);
        const reel = generateReelDigits(targetDigit);
        return {
          targetDigit,
          reel,
        };
      });
      return {
        ...stat,
        digitColumns,
      };
    });
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const charEls = charRefs.current.filter(Boolean) as HTMLSpanElement[];
      const statEls = statItemRefs.current.filter(Boolean) as HTMLDivElement[];
      const total = charEls.length;

      if (total === 0) return;

      // ── 1. Master scrub timeline — character by character ───────────────
      const TOTAL_DURATION = 1;           // 1 arbitrary second (scrubbed to scroll)
      const CHARS_END = 0.75;            // all characters lit by 75% scroll progress
      const step = CHARS_END / total;    // each character's start offset
      const charDuration = step * 2.8;   // slight overlap for a smooth light wave

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: '90% 50%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Pad timeline to TOTAL_DURATION so the scrub spans correctly
      tl.to({}, { duration: TOTAL_DURATION });

      charEls.forEach((el, i) => {
        const startTime = i * step;
        const isAccent = el.dataset.accent === 'true';

        tl.fromTo(
          el,
          { color: 'rgba(242, 242, 250, 0.22)' },
          {
            color: isAccent
              ? 'rgba(182, 228, 234, 1)'  // Direct RGBA match for oklch(0.89 0.029 195) cyan
              : 'rgba(242, 242, 250, 1)', // Pure near-white for regular text
            ease: 'power1.inOut',
            duration: charDuration,
          },
          startTime
        );
      });

      // ── 2. Specs reveal + Autonomous Lottery Machine Reel Spin ─────────
      if (statEls.length > 0) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 30%',
          onEnter: () => {
            gsap.fromTo(
              statEls,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: 'power2.out',
              }
            );

            // Spin each reel column like a lottery machine (autonomously to completion)
            parsedStats.forEach((stat, statIdx) => {
              const tracks = reelTrackRefs.current[statIdx] || [];
              tracks.forEach((trackEl, colIdx) => {
                if (!trackEl) return;
                const columnData = stat.digitColumns[colIdx];
                if (!columnData) return;

                const totalItems = columnData.reel.length;
                const finalPercent = -((totalItems - 1) / totalItems) * 100;

                gsap.fromTo(
                  trackEl,
                  { yPercent: 0 },
                  {
                    yPercent: finalPercent,
                    duration: 1.8 + colIdx * 0.3,
                    delay: statIdx * 0.12 + colIdx * 0.15,
                    ease: 'power3.out', // lottery wheel spin deceleration
                  }
                );
              });
            });
          },
          onLeaveBack: () => {
            // Reset reels when scrolling back UP past the top section
            // so when coming DOWN again from the top, the animation triggers freshly
            parsedStats.forEach((_, statIdx) => {
              const tracks = reelTrackRefs.current[statIdx] || [];
              tracks.forEach((trackEl) => {
                if (trackEl) {
                  gsap.set(trackEl, { yPercent: 0 });
                }
              });
            });
          },
        });
      }
    },
    { scope: sectionRef }
  );

  let globalCharIdx = 0;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="statement"
      aria-label="Personal philosophy statement"
    >
      <div className={styles.sticky}>
        <div className={styles.prose}>
          <p className={styles.statement} aria-label={STATEMENT}>
            {parsedWords.map((wordObj, wIdx) => (
              <span key={wIdx} className={styles.word}>
                {wordObj.chars.map((charObj, cIdx) => {
                  const idx = globalCharIdx++;
                  return (
                    <span
                      key={cIdx}
                      ref={(el) => {
                        charRefs.current[idx] = el;
                      }}
                      className={styles.char}
                      data-accent={charObj.isAccent}
                      aria-hidden="true"
                    >
                      {charObj.char}
                    </span>
                  );
                })}
              </span>
            ))}
          </p>

          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              {parsedStats.map((stat, statIdx) => (
                <div
                  key={statIdx}
                  ref={(el) => {
                    statItemRefs.current[statIdx] = el;
                  }}
                  className={styles.statItem}
                >
                  {/* Lottery Machine Roller */}
                  <div className={styles.lotteryRoller}>
                    {stat.digitColumns.map((col, colIdx) => (
                      <span key={colIdx} className={styles.reelColumn}>
                        <span
                          ref={(el) => {
                            if (!reelTrackRefs.current[statIdx]) {
                              reelTrackRefs.current[statIdx] = [];
                            }
                            reelTrackRefs.current[statIdx][colIdx] = el;
                          }}
                          className={styles.reelTrack}
                        >
                          {col.reel.map((digitNum, dIdx) => (
                            <span key={dIdx} className={styles.reelDigit}>
                              {digitNum}
                            </span>
                          ))}
                        </span>
                      </span>
                    ))}
                    {stat.suffix && (
                      <span className={styles.reelSuffix}>{stat.suffix}</span>
                    )}
                  </div>

                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statDetail}>{stat.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
