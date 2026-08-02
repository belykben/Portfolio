import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './TextRoll.css';

export interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
  stagger?: number;
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className,
  center = false,
  stagger = 0.035,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const topCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bottomCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const topTargets = topCharsRef.current.filter((el): el is HTMLSpanElement => el !== null);
    const bottomTargets = bottomCharsRef.current.filter((el): el is HTMLSpanElement => el !== null);

    const ctx = gsap.context(() => {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .to(
          topTargets,
          {
            y: '-150%',
            ease: 'power3.inOut',
            duration: 0.4,
            stagger: {
              each: stagger,
              from: center ? 'center' : 'start',
            },
          },
          0
        )
        .to(
          bottomTargets,
          {
            y: '0%',
            ease: 'power3.inOut',
            duration: 0.4,
            stagger: {
              each: stagger,
              from: center ? 'center' : 'start',
            },
          },
          0
        );
    }, containerRef);

    return () => ctx.revert();
  }, [center, children, stagger]);

  const handleMouseEnter = () => {
    timelineRef.current?.play();
  };

  const handleMouseLeave = () => {
    timelineRef.current?.reverse();
  };

  const splitText = typeof children === 'string' ? children.split('') : [];

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('text-roll-container', className)}
    >
      <span className="text-roll-top" aria-hidden="true">
        {splitText.map((l, i) => (
          <span
            ref={(el) => { topCharsRef.current[i] = el; }}
            className="text-roll-char"
            key={`top-${i}`}
          >
            {l === ' ' ? '\u00A0' : l}
          </span>
        ))}
      </span>

      <span className="text-roll-bottom" aria-hidden="true">
        {splitText.map((l, i) => (
          <span
            ref={(el) => { bottomCharsRef.current[i] = el; }}
            className="text-roll-char text-roll-char-initial-bottom"
            key={`bottom-${i}`}
          >
            {l === ' ' ? '\u00A0' : l}
          </span>
        ))}
      </span>

      <span className="sr-only">{children}</span>
    </span>
  );
};

export default TextRoll;
