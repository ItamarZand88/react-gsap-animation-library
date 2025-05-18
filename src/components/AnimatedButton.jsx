import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '',
  hoverScale = 1.05,
  clickScale = 0.95,
  duration = 0.3,
  style = {}
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    
    // Setup hover animation
    gsap.set(button, { transformOrigin: 'center' });
    
    // Cleanup function
    return () => {
      gsap.killTweensOf(button);
    };
  }, []);

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: hoverScale,
      duration,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration,
      ease: "power2.out"
    });
  };

  const handleMouseDown = () => {
    gsap.to(buttonRef.current, {
      scale: clickScale,
      duration: duration / 2,
      ease: "power2.in"
    });
  };

  const handleMouseUp = () => {
    gsap.to(buttonRef.current, {
      scale: hoverScale,
      duration: duration / 2,
      ease: "power2.out"
    });
  };

  const defaultStyle = {
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    ...style
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      style={defaultStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;