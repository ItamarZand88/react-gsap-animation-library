import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAnimationSettings } from '../../context/AnimationContext';

/**
 * SlideIn component for creating slide-in animations with GSAP
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {string} props.direction - Slide direction ('up', 'down', 'left', 'right')
 * @param {number} props.distance - Slide distance in pixels
 * @param {boolean} props.fade - Whether to fade in while sliding
 * @param {boolean} props.bounce - Whether to add a bounce effect at the end
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const SlideIn = ({
  children,
  duration = 0.8,
  delay = 0,
  ease,
  direction = 'up',
  distance = 100,
  fade = true,
  bounce = false,
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
  
  // Set default ease based on bounce effect
  if (!ease) {
    ease = bounce ? "back.out(1.7)" : "power3.out";
  }
  
  // Get direction-based animation properties
  const getDirectionalProps = () => {
    const baseProps = fade ? { opacity: 0 } : {};
    
    switch (direction) {
      case 'up':
        return { ...baseProps, y: distance };
      case 'down':
        return { ...baseProps, y: -distance };
      case 'left':
        return { ...baseProps, x: -distance };
      case 'right':
        return { ...baseProps, x: distance };
      default:
        return { ...baseProps, y: distance };
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
      distance,
      duration, 
      delay, 
      ease, 
      trigger, 
      threshold,
      fade,
      bounce,
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
        opacity: fade ? 1 : undefined,
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
    className: `react-gsap-slidein ${className}`,
    style,
    'data-animation-direction': direction,
    'data-fade': fade.toString(),
    'data-bounce': bounce.toString(),
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

export default SlideIn;