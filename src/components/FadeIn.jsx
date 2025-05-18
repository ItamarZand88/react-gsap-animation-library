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
 * FadeIn component for creating fade in animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} props.ease - GSAP easing function
 * @param {number} props.stagger - Stagger delay for multiple children
 * @param {Object} props.from - Initial animation properties
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none')
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 */
const FadeIn = ({ 
  children, 
  duration = 0.8, 
  delay = 0, 
  threshold = 0.2,
  ease = "power3.out",
  stagger = 0,
  from = { opacity: 0, y: 30 },
  trigger = 'scroll', // 'scroll', 'load', or 'none'
  onComplete = () => {},
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(trigger === 'none');
  const childrenArray = React.Children.toArray(children);
  const hasMultipleChildren = childrenArray.length > 1;

  // Animation setup function - reusable across different triggers
  const setupAnimation = () => {
    if (!elementRef.current || isAnimated) return;
    
    const element = elementRef.current;
    const targets = hasMultipleChildren ? element.children : element;
    
    // Create animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimated(true);
        onComplete();
      }
    });
    
    // Add animation to timeline
    tl.from(targets, {
      ...from,
      duration,
      delay,
      ease,
      stagger: hasMultipleChildren ? stagger : 0,
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
            timeline = gsap.timeline({
              scrollTrigger: {
                trigger: elementRef.current,
                start: `top bottom-=${threshold * 100}%`,
                toggleActions: "play none none none",
                onEnter: () => setIsAnimated(true)
              }
            });
            
            timeline.from(hasMultipleChildren ? elementRef.current.children : elementRef.current, {
              ...from,
              duration,
              delay,
              ease,
              stagger: hasMultipleChildren ? stagger : 0,
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
  }, [trigger, children, duration, delay, threshold, ease, stagger, from, hasMultipleChildren]);

  // Play animation manually - useful when trigger is 'none'
  const play = () => {
    if (!isAnimated) {
      setupAnimation();
    }
  };

  // Combine passed style with our minimal required styles
  const combinedStyle = {
    ...style,
  };

  return (
    <div 
      ref={elementRef} 
      className={`react-gsap-fadein ${className}`} 
      style={combinedStyle}
      data-testid="fade-in-component"
    >
      {/* 
        If we have a function as children, call it with the play function
        This enables render props pattern for more control
      */}
      {typeof children === 'function' ? children({ play }) : children}
    </div>
  );
};

export default FadeIn;