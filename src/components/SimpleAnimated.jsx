import React, { useRef, useEffect, useState } from 'react';

/**
 * SimpleAnimated component for basic animations without dependencies
 * This component uses CSS animations instead of GSAP for maximum compatibility
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type ('fade', 'slide-left', 'slide-right', 'slide-up', 'slide-down', 'scale', 'rotate')
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.easing - CSS easing function
 * @param {string} props.trigger - Animation trigger ('auto', 'hover', 'click', 'visible')
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 */
const SimpleAnimated = ({
  children,
  animation = 'fade',
  duration = 0.5,
  delay = 0,
  easing = 'ease-out',
  trigger = 'auto', // 'auto', 'hover', 'click', 'visible'
  onComplete = () => {},
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle trigger based animation start
  useEffect(() => {
    if (trigger === 'auto') {
      setIsAnimated(true);
    } else if (trigger === 'visible') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setIsAnimated(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      
      return () => {
        observer.disconnect();
      };
    }
  }, [trigger]);
  
  // Handle animation completion
  useEffect(() => {
    if (isAnimated) {
      const timer = setTimeout(() => {
        onComplete();
      }, (delay + duration) * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimated, delay, duration, onComplete]);
  
  // Initial CSS properties based on animation type
  const getInitialStyles = () => {
    switch (animation) {
      case 'fade':
        return { opacity: 0 };
      case 'slide-left':
        return { opacity: 0, transform: 'translateX(-50px)' };
      case 'slide-right':
        return { opacity: 0, transform: 'translateX(50px)' };
      case 'slide-up':
        return { opacity: 0, transform: 'translateY(50px)' };
      case 'slide-down':
        return { opacity: 0, transform: 'translateY(-50px)' };
      case 'scale':
        return { opacity: 0, transform: 'scale(0.8)' };
      case 'rotate':
        return { opacity: 0, transform: 'rotate(-25deg)' };
      default:
        return { opacity: 0 };
    }
  };
  
  // Final CSS properties
  const getFinalStyles = () => {
    return { opacity: 1, transform: 'none' };
  };
  
  // Dynamic styles based on animation state
  const getAnimationStyles = () => {
    // Base styles
    const baseStyles = {
      transition: `all ${duration}s ${easing} ${delay}s`,
    };
    
    // Combine with initial or final styles based on animation state
    const animationStyles = isAnimated || 
                            (trigger === 'hover' && isHovered) ? 
                            getFinalStyles() : 
                            getInitialStyles();
    
    return { ...baseStyles, ...animationStyles };
  };
  
  // Combined styles
  const combinedStyles = {
    ...style,
    ...getAnimationStyles()
  };
  
  // Event handlers
  const handleClick = () => {
    if (trigger === 'click' && !isAnimated) {
      setIsAnimated(true);
    }
  };
  
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsHovered(false);
    }
  };
  
  // Manual animation trigger function for programmatic control
  const play = () => {
    setIsAnimated(true);
  };
  
  return (
    <div
      ref={elementRef}
      className={`simple-animated ${animation} ${className}`}
      style={combinedStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="simple-animated-component"
    >
      {typeof children === 'function' ? children({ play, isAnimated }) : children}
    </div>
  );
};

export default SimpleAnimated;