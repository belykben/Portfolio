import React, { useRef } from 'react';
import { gsap } from 'gsap';
import './MagneticButton.css';

export interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.35,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Subtract current GSAP transform offset to get the true un-shifted element center
    const currentX = (gsap.getProperty(ref.current, 'x') as number) || 0;
    const currentY = (gsap.getProperty(ref.current, 'y') as number) || 0;

    const centerX = left - currentX + width / 2;
    const centerY = top - currentY + height / 2;

    const targetX = (clientX - centerX) * strength;
    const targetY = (clientY - centerY) * strength;

    gsap.to(ref.current, {
      x: targetX,
      y: targetY,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const reset = () => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`magnetic-wrapper ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'fill' | 'outline';
  size?: 'sm' | 'md';
  type?: 'button' | 'submit' | 'reset';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'fill',
  size = 'md',
  type = 'button',
}) => {
  const fillRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, {
      top: '-25%',
      duration: 0.5,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    if (!fillRef.current) return;
    gsap.to(fillRef.current, {
      top: '-150%',
      duration: 0.5,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(fillRef.current, { top: '100%' });
      },
    });
  };

  const sizeClass = size === 'sm' ? 'magnetic-btn-sm' : 'magnetic-btn-md';
  const variantClass = variant === 'outline' ? 'magnetic-btn-outline' : 'magnetic-btn-fill';

  return (
    <Magnetic strength={0.35}>
      <button
        type={type}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`magnetic-btn ${sizeClass} ${variantClass} ${className}`.trim()}
      >
        <div ref={fillRef} className="magnetic-btn-fill-circle" />
        <Magnetic strength={0.15}>
          <span className="magnetic-btn-text">{children}</span>
        </Magnetic>
      </button>
    </Magnetic>
  );
};

export default MagneticButton;
