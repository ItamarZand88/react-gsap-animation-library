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
 * SlideIn component for creating slide-in animations from different directions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.direction - Animation direction ('left', 'right', 'top', 'bottom')
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {number} props.distance - Slide-in distance in pixels
 * @param {string} props.ease - GSAP easing function
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none')
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Additional inline styles
 */
const SlideIn = ({ 
  children, 
  direction = 'left', 
  duration = 0.8, 
  delay = 0,
  threshold = 0.2,
  distance = 100,
  ease = "power3.out",
  trigger = 'scroll', // 'scroll', 'load', or 'none'
  onComplete = () => {},
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(trigger === 'none');
  
  // Determine animation properties based on direction
  const getFromProps = () => {
    const from = { opacity: 0 };
    
    switch (direction) {
      case 'left':
        from.x = -distance;
        break;
      case 'right':
        from.x = distance;
        break;
      case 'top':
        from.y = -distance;
        break;
      case 'bottom':
        from.y = distance;
        break;
      default:
        from.x = -distance;
    }
    
    return from;
  };
  
  // Animation setup function - reusable across different triggers
  const setupAnimation = () => {
    if (!elementRef.current || isAnimated) return;
    
    const element = elementRef.current;
    const from = getFromProps();
    
    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimated(true);
        onComplete();
      }
    });
    
    // Add animation to timeline
    tl.from(element, {
      ...from,
      duration,
      delay,
      ease,
      clearProps: "all"
    });
    
    return tl;
  };

  useEffect(() => {
    let timeline;
    let scrollTrigger;
    
    // Different initialization based on trigger type
    switch (trigger) {
      case 'scroll':
        // Only setup ScrollTrigger if it's available
        if (typeof ScrollTrigger !== 'undefined') {
          try {
            const from = getFromProps();
            
            timeline = gsap.timeline({
              scrollTrigger: {
                trigger: elementRef.current,
                start: `top bottom-=${threshold * 100}%`,
                toggleActions: "play none none none",
                onEnter: () => setIsAnimated(true)
              }
            });
            
            timeline.from(elementRef.current, {
              ...from,
              duration,
              delay,
              ease,
              clearProps: "all"
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
  }, [trigger, direction, duration, delay, threshold, distance, ease]);

  // Play animation manually - useful when trigger is 'none'
  const play = () => {
    if (!isAnimated) {
      setupAnimation();
    }
  };

  return (
    <div 
      ref={elementRef} 
      className={`react-gsap-slidein ${className}`} 
      style={style}
      data-testid="slide-in-component"
    >
      {/* 
        If we have a function as children, call it with the play function
        This enables render props pattern for more control
      */}
      {typeof children === 'function' ? children({ play }) : children}
    </div>
  );
};

export default SlideIn;