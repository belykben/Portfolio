import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

export interface MenuItemData {
  link: string;
  text: string;
  image: string;
  category?: string;
}

export interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  badgeColor?: string;
  badgeTextColor?: string;
}

interface MenuItemProps extends MenuItemData {
  index: number;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isLast: boolean;
  onHoverChange: (isActive: boolean, index: number) => void;
}

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#ffffff',
  bgColor = 'transparent',
  marqueeBgColor = '#ffffff',
  marqueeTextColor = '#060010',
  borderColor = 'rgba(255, 255, 255, 0.15)',
  badgeColor = 'oklch(0.89 0.029 195)',
  badgeTextColor = '#060010',
}) => {
  const [modalState, setModalState] = useState({ isActive: false, index: 0 });

  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const badgeWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    if (modalWrapperRef.current) {
      gsap.set(modalWrapperRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
    }
    if (badgeWrapperRef.current) {
      gsap.set(badgeWrapperRef.current, { xPercent: -50, yPercent: -50, scale: 0 });
    }

    const xModalTo = modalWrapperRef.current
      ? gsap.quickTo(modalWrapperRef.current, 'x', { duration: 0.8, ease: 'power3' })
      : () => {};
    const yModalTo = modalWrapperRef.current
      ? gsap.quickTo(modalWrapperRef.current, 'y', { duration: 0.8, ease: 'power3' })
      : () => {};

    const xBadgeTo = badgeWrapperRef.current
      ? gsap.quickTo(badgeWrapperRef.current, 'x', { duration: 0.6, ease: 'power3' })
      : () => {};
    const yBadgeTo = badgeWrapperRef.current
      ? gsap.quickTo(badgeWrapperRef.current, 'y', { duration: 0.6, ease: 'power3' })
      : () => {};

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      xModalTo(mouseX);
      yModalTo(mouseY);

      xBadgeTo(mouseX);
      yBadgeTo(mouseY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const tickerFunc = () => {
      if (!badgeWrapperRef.current || !textRef.current) return;
      const bx = gsap.getProperty(badgeWrapperRef.current, 'x');
      const by = gsap.getProperty(badgeWrapperRef.current, 'y');

      if (typeof bx === 'number' && typeof by === 'number') {
        gsap.set(textRef.current, {
          x: (mouseX - bx) * 0.15,
          y: (mouseY - by) * 0.15,
        });
      }
    };
    gsap.ticker.add(tickerFunc);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(tickerFunc);
    };
  }, []);

  useEffect(() => {
    if (modalWrapperRef.current && badgeWrapperRef.current) {
      gsap.to([modalWrapperRef.current, badgeWrapperRef.current], {
        scale: modalState.isActive ? 1 : 0,
        duration: 0.5,
        ease: 'expo.out',
      });
    }
  }, [modalState.isActive]);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        yPercent: -modalState.index * 100,
        duration: 0.5,
        ease: 'expo.out',
      });
    }
  }, [modalState.index]);

  return (
    <div className="fm-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="fm-menu">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            index={index}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isLast={index === items.length - 1}
            onHoverChange={(isActive, idx) => {
              setModalState({ isActive, index: idx });
            }}
          />
        ))}
      </nav>

      {/* Floating image modal preview */}
      <div ref={modalWrapperRef} className="fm-modal-wrapper">
        <div className="fm-modal-container">
          <div ref={sliderRef} className="fm-modal-slider">
            {items.map((proj, idx) => (
              <div key={`modal-${idx}`} className="fm-modal-slide">
                <img src={proj.image} alt={proj.text} className="fm-modal-img" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating "View" badge cursor */}
      <div ref={badgeWrapperRef} className="fm-badge-wrapper">
        <div className="fm-badge" style={{ backgroundColor: badgeColor, color: badgeTextColor }}>
          <span ref={textRef} className="fm-badge-text">
            View
          </span>
        </div>
      </div>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  category,
  index,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  isLast,
  onHoverChange,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useLayoutEffect(() => {
    if (!marqueeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: speed,
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, [speed]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) return;
    onHoverChange(true, index);
    if (!itemRef.current || !outerRef.current || !innerRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);

    const yOffset = edge === 'top' ? '-101%' : '101%';
    const innerYOffset = edge === 'top' ? '101%' : '-101%';

    gsap.killTweensOf([outerRef.current, innerRef.current]);
    gsap.fromTo(outerRef.current, { y: yOffset }, { y: '0%', duration: 0.6, ease: 'expo.out' });
    gsap.fromTo(innerRef.current, { y: innerYOffset }, { y: '0%', duration: 0.6, ease: 'expo.out' });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) return;
    onHoverChange(false, index);
    if (!itemRef.current || !outerRef.current || !innerRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);

    const yOffset = edge === 'top' ? '-101%' : '101%';
    const innerYOffset = edge === 'top' ? '101%' : '-101%';

    gsap.killTweensOf([outerRef.current, innerRef.current]);
    gsap.to(outerRef.current, { y: yOffset, duration: 0.6, ease: 'expo.out' });
    gsap.to(innerRef.current, { y: innerYOffset, duration: 0.6, ease: 'expo.out' });
  };

  const formattedNum = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={itemRef}
      className="fm-menu-item"
      style={{ borderBottom: isLast ? 'none' : `1px solid ${borderColor}` }}
    >
      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fm-menu-link"
        style={{ color: textColor }}
      >
        <div className="fm-menu-link-text">
          <span className="fm-menu-num">{formattedNum}</span>
          <span>{text}</span>
        </div>
        {category && <span className="fm-menu-category">{category}</span>}
      </a>

      {/* Marquee Wrapper Background */}
      <div
        ref={outerRef}
        className="fm-marquee-outer"
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div ref={innerRef} className="fm-marquee-inner">
          <div ref={marqueeRef} className="fm-marquee-content">
            {[...Array(8)].map((_, idx) => (
              <div className="fm-marquee-part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div
                  className="fm-marquee-img"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;