import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAnimationSettings } from '../../context/AnimationContext';

/**
 * FadeIn component for creating fade-in animations with GSAP
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {string} props.direction - Fade direction ('up', 'down', 'left', 'right', 'none')
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const FadeIn = ({ 
  children, 
  duration = 0.8, 
  delay = 0, 
  ease = "power3.out",
  direction = 'up',
  trigger = 'scroll',
  threshold = 0.2,
  onStart = () => {},
  onComplete = () => {},
  className = '',
  style = {},
  ...otherProps
}) => {
  const elementRef = useRef(null);
  const { disableAllAnimations, disableScrollAnimations } = useAnimationSettings();
  
  // Get direction-based animation properties
  const getDirectionalProps = () => {
    const baseProps = { opacity: 0 };
    
    switch (direction) {
      case 'up':
        return { ...baseProps, y: 30 };
      case 'down':
        return { ...baseProps, y: -30 };
      case 'left':
        return { ...baseProps, x: 30 };
      case 'right':
        return { ...baseProps, x: -30 };
      case 'none':
        return baseProps;
      default:
        return { ...baseProps, y: 30 };
    }
  };
  
  // Use GSAP React hook
  const { contextSafe } = useGSAP(() => {
    if (!elementRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      // Make content visible
      gsap.set(elementRef.current, { opacity: 1, x: 0, y: 0 });
      return;
    }
    
    // For load and scroll triggers
    if (trigger === 'load' || trigger === 'scroll') {
      // Get starting properties
      const fromProps = getDirectionalProps();
      
      // Create the animation
      const tween = gsap.from(elementRef.current, {
        ...fromProps,
        duration,
        delay,
        ease,
        onStart,
        onComplete,
        paused: trigger === 'scroll'
      });
      
      // Handle scroll trigger
      if (trigger === 'scroll' && !disableScrollAnimations) {
        ScrollTrigger.create({
          trigger: elementRef.current,
          start: `top bottom-=${threshold * 100}%`,
          onEnter: () => tween.play()
        });
      } else if (trigger === 'load') {
        // Play immediately for load trigger
        tween.play();
      }
    }
    
    return () => {
      // Clean up ScrollTrigger instances on unmount
      if (trigger === 'scroll') {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === elementRef.current)
          .forEach(st => st.kill());
      }
    };
  }, { 
    scope: elementRef,
    dependencies: [
      direction, 
      duration, 
      delay, 
      ease, 
      trigger, 
      threshold,
      disableAllAnimations, 
      disableScrollAnimations
    ]
  });
  
  // Play animation function for manual triggers
  const playAnimation = contextSafe(() => {
    if (disableAllAnimations) return;
    
    const fromProps = getDirectionalProps();
    
    gsap.fromTo(
      elementRef.current,
      fromProps,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease,
        onStart,
        onComplete
      }
    );
  });
  
  // Get event handlers based on trigger type
  const getEventHandlers = () => {
    if (disableAllAnimations) return {};
    
    if (trigger === 'hover') {
      return {
        onMouseEnter: playAnimation
      };
    }
    
    if (trigger === 'click') {
      return {
        onClick: playAnimation
      };
    }
    
    return {};
  };
  
  // Combined props for rendering
  const componentProps = {
    ref: elementRef,
    className: `react-gsap-fadein ${className}`,
    style,
    'data-animation-direction': direction,
    ...getEventHandlers(),
    ...otherProps
  };
  
  return (
    <div {...componentProps}>
      {typeof children === 'function' 
        ? children({ play: playAnimation }) 
        : children
      }
    </div>
  );
};

export default FadeIn;