import React, { useRef, useState, useEffect } from 'react';

export const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);

  const handleMouse = (e) => {
    if (!ref.current || !window.gsap) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate the distance from the center of the element to the mouse pointer
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    // Use GSAP to animate to the new position smoothly
    window.gsap.to(ref.current, {
      x: x,
      y: y,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const reset = () => {
    if (!ref.current || !window.gsap) return;
    
    // Use an elastic ease to simulate Framer Motion's spring effect on release
    window.gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto"
    });
  };

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouse} 
      onMouseLeave={reset} 
      className="relative inline-flex"
    >
      {children}
    </div>
  );
};

export const MagneticButton = ({
  children,
  onClick,
  className = '',
  variant = 'fill',
  size = 'md',
}) => {
  const fillRef = useRef(null);
  const isSm = size === 'sm';
  const isFill = variant === 'fill';

  const sizeClasses = isSm
    ? 'px-8 py-4 min-w-[140px] text-sm md:px-8 md:py-[14px] md:min-w-[150px] md:text-base'
    : 'px-10 py-5 min-w-[180px] text-base md:text-lg';

  // Using standard Tailwind colors for the outline variant fallback for the preview environment
  const buttonColors = isFill
    ? 'bg-[#1C1D20] text-white border border-[#1C1D20] hover:border-[#455CE9]'
    : 'bg-transparent text-gray-900 border border-gray-300 hover:border-[#455CE9]';

  const handleMouseEnter = () => {
    if (!fillRef.current || !window.gsap) return;
    // Approximating Framer's [0.76, 0, 0.24, 1] cubic-bezier with GSAP's power3.inOut
    window.gsap.to(fillRef.current, {
      top: '-25%',
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    if (!fillRef.current || !window.gsap) return;
    window.gsap.to(fillRef.current, {
      top: '-150%',
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: () => {
        // Reset the position instantly once the exit animation finishes
        window.gsap.set(fillRef.current, { top: '100%' });
      }
    });
  };

  return (
    <Magnetic strength={0.3}>
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-full group cursor-pointer outline-none flex items-center justify-center transition-colors duration-500 ${sizeClasses} ${buttonColors} ${className}`}
      >
        <div
          ref={fillRef}
          className="absolute left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-[50%] bg-[#455CE9] pointer-events-none z-0"
          style={{ top: '100%' }} // Initial state matching the framer motion initial prop
        />
        <Magnetic strength={0.15}>
          <span className="relative z-10 font-medium whitespace-nowrap transition-colors duration-300 group-hover:text-white">
            {children}
          </span>
        </Magnetic>
      </button>
    </Magnetic>
  );
};

export default function App() {
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    // Check if GSAP is already loaded globally
    if (window.gsap) {
      setGsapLoaded(true);
      return;
    }

    // Safely inject GSAP script if it doesn't exist
    const scriptId = 'gsap-library';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      setGsapLoaded(true);
    };

    script.addEventListener('load', handleLoad);

    // Fallback check in case it loaded extremely fast
    if (window.gsap) {
      setGsapLoaded(true);
    }

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!gsapLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#455CE9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12 bg-white p-16 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center space-y-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">GSAP Magnetic Button</h1>
          <p className="text-gray-500">Hover over the buttons and move your mouse to see the magnetic and fill effects.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
          {/* Fill Variant */}
          <div className="flex flex-col items-center gap-4">
            <MagneticButton variant="fill" size="md">
              Fill Variant
            </MagneticButton>
            <span className="text-sm text-gray-400 font-medium">Default (MD)</span>
          </div>

          {/* Outline Variant */}
          <div className="flex flex-col items-center gap-4">
            <MagneticButton variant="outline" size="md">
              Outline Variant
            </MagneticButton>
            <span className="text-sm text-gray-400 font-medium">Outline (MD)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full mt-4">
          {/* Small Fill Variant */}
          <div className="flex flex-col items-center gap-4">
            <MagneticButton variant="fill" size="sm">
              Small Button
            </MagneticButton>
            <span className="text-sm text-gray-400 font-medium">Small (SM)</span>
          </div>
          
          {/* Custom Styled Variant */}
          <div className="flex flex-col items-center gap-4">
            <MagneticButton 
              variant="outline" 
              size="sm"
              className="!border-dashed !border-gray-400 hover:!border-transparent"
            >
              Custom Dashed
            </MagneticButton>
            <span className="text-sm text-gray-400 font-medium">Overridden CSS</span>
          </div>
        </div>

      </div>
    </div>
  );
}