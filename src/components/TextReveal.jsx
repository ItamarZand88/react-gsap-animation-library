import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Try to register ScrollTrigger safely
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (error) {
  console.warn("GSAP ScrollTrigger registration failed", error);
}

/**
 * TextReveal component for creating revealing text animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to reveal
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} props.ease - GSAP easing function
 * @param {string} props.color - Text color
 * @param {string|number} props.fontSize - Font size
 * @param {string|number} props.fontWeight - Font weight
 * @param {string|number} props.lineHeight - Line height
 * @param {string} props.textAlign - Text alignment
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none')
 * @param {string} props.direction - Reveal direction ('left', 'right', 'top', 'bottom')
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 */
const TextReveal = ({
  children,
  duration = 1,
  delay = 0,
  threshold = 0.2,
  ease = "power3.out",
  color = 'inherit',
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  trigger = 'scroll', // 'scroll', 'load', or 'none'
  direction = 'right', // 'left', 'right', 'top', 'bottom'
  onComplete = () => {},
  className = ''
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(trigger === 'none');

  // Get the appropriate animation properties based on direction
  const getAnimationProps = () => {
    switch (direction) {
      case 'left':
        return { width: '100%', x: '0%', xPercent: 0 };
      case 'right':
        return { width: '100%', x: '0%', xPercent: 0 };
      case 'top':
        return { height: '100%', y: '0%', yPercent: 0 };
      case 'bottom':
        return { height: '100%', y: '0%', yPercent: 0 };
      default:
        return { width: '100%', x: '0%', xPercent: 0 };
    }
  };

  // Setup the initial properties based on direction
  const getInitialProps = () => {
    switch (direction) {
      case 'left':
        return { width: '0%', right: '0', left: 'auto' };
      case 'right':
        return { width: '0%', left: '0', right: 'auto' };
      case 'top':
        return { height: '0%', bottom: '0', top: 'auto', width: '100%' };
      case 'bottom':
        return { height: '0%', top: '0', bottom: 'auto', width: '100%' };
      default:
        return { width: '0%', left: '0', right: 'auto' };
    }
  };

  // Animation setup function - reusable across different triggers
  const setupAnimation = () => {
    if (!containerRef.current || isAnimated) return;
    
    const container = containerRef.current;
    const mask = maskRef.current;
    const animationProps = getAnimationProps();
    
    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimated(true);
        onComplete();
      }
    });
    
    // Add animation to timeline
    tl.to(mask, {
      ...animationProps,
      duration,
      delay,
      ease
    });
    
    return tl;
  };

  useEffect(() => {
    let timeline;
    let scrollTrigger;
    
    // Setup the initial state
    const initialProps = getInitialProps();
    if (maskRef.current) {
      gsap.set(maskRef.current, initialProps);
    }

    // Different initialization based on trigger type
    switch (trigger) {
      case 'scroll':
        // Only setup ScrollTrigger if it's available
        if (typeof ScrollTrigger !== 'undefined' && containerRef.current) {
          try {
            const animationProps = getAnimationProps();
            
            timeline = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: `top bottom-=${threshold * 100}%`,
                toggleActions: "play none none none",
                onEnter: () => setIsAnimated(true)
              }
            });
            
            timeline.to(maskRef.current, {
              ...animationProps,
              duration,
              delay,
              ease
            });
            
            // Save reference to the ScrollTrigger instance
            scrollTrigger = ScrollTrigger.getAll().pop();
          } catch (error) {
            console.warn("ScrollTrigger animation failed, falling back to load trigger", error);
            setupAnimation();
          }
        } else {
          console.warn("ScrollTrigger is not available, falling back to load trigger");
          setupAnimation();
        }
        break;
        
      case 'load':
        // Run animation on component mount
        timeline = setupAnimation();
        break;
        
      case 'none':
        // Don't animate automatically
        break;
        
      default:
        console.warn(`Unknown trigger type: ${trigger}, falling back to load`);
        timeline = setupAnimation();
    }
    
    // Cleanup function
    return () => {
      if (timeline) timeline.kill();
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, [trigger, duration, delay, threshold, ease, direction]);

  // Play animation manually - useful when trigger is 'none'
  const play = () => {
    if (!isAnimated) {
      setupAnimation();
    }
  };

  // Basic container styles
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block'
  };

  // Hidden text styles
  const textStyle = {
    visibility: 'hidden',
    fontSize,
    fontWeight,
    lineHeight,
    textAlign,
    color
  };

  // Mask styles with dynamic positioning based on direction
  const maskStyle = {
    position: 'absolute',
    top: direction === 'bottom' ? 0 : undefined,
    bottom: direction === 'top' ? 0 : undefined,
    left: direction === 'right' ? 0 : undefined,
    right: direction === 'left' ? 0 : undefined,
    width: ['left', 'right'].includes(direction) ? 0 : '100%',
    height: ['top', 'bottom'].includes(direction) ? 0 : '100%',
    overflow: 'hidden'
  };

  // Revealed text styles
  const revealedTextStyle = {
    ...textStyle,
    visibility: 'visible',
    color
  };

  return (
    <div 
      ref={containerRef} 
      className={`react-gsap-textreveal ${className}`} 
      style={containerStyle}
      data-testid="text-reveal-component"
    >
      <div ref={textRef} style={textStyle}>
        {children}
      </div>
      <div ref={maskRef} style={maskStyle}>
        <div style={revealedTextStyle}>
          {children}
        </div>
      </div>
      
      {/* If we need to expose the play function */}
      {typeof children === 'function' ? children({ play }) : null}
    </div>
  );
};

export default TextReveal;