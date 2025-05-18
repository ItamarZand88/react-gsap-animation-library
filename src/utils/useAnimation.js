import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAnimationSettings } from '../context/AnimationContext';

// Make sure GSAP plugins are registered
if (typeof window !== 'undefined') {
  try {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  } catch (error) {
    console.warn("GSAP plugin registration failed:", error);
  }
}

/**
 * Primary animation hook that leverages GSAP's official React integration
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.scope - Container element ref for scoping animations
 * @param {boolean} options.revertOnUpdate - Whether to revert animations when dependencies change
 * @returns {Object} Animation utilities including tween, timeline, and contextSafe
 */
export const useAnimation = (options = {}) => {
  const { disableAllAnimations } = useAnimationSettings();
  const containerRef = options.scope || useRef(null);
  
  const { 
    contextSafe, 
    context,
    revert,
    kill 
  } = useGSAP({
    scope: containerRef
  });
  
  // Create a timeline within the current GSAP context
  const timeline = (timelineOptions = {}) => {
    if (disableAllAnimations) return gsap.timeline();
    return gsap.timeline(timelineOptions, context);
  };
  
  // Create a tween within the current GSAP context
  const tween = (targets, vars) => {
    if (disableAllAnimations) return { kill: () => {} };
    return gsap.to(targets, vars, context);
  };
  
  // Add animation to a timeline
  const add = (timeline, animation, position) => {
    if (disableAllAnimations) return timeline;
    return timeline.add(animation, position);
  };
  
  return {
    containerRef,
    contextSafe,
    timeline,
    tween,
    add,
    context,
    revert,
    kill
  };
};

/**
 * Hook for creating common animation effects with simpler API
 * 
 * @param {React.RefObject} elementRef - Reference to the element to animate
 * @param {Object} options - Animation options
 * @param {string} options.effect - Animation effect ('fadeIn', 'fadeOut', 'slideIn', etc.)
 * @param {string} options.direction - Animation direction ('up', 'down', 'left', 'right')
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Delay before animation starts in seconds
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.trigger - Animation trigger ('load', 'scroll', 'none')
 * @param {number} options.threshold - Viewport threshold for scroll animations (0-1)
 * @returns {Object} Animation utilities
 */
export const useAnimationEffect = (elementRef, options = {}) => {
  const { 
    effect = 'fadeIn',
    direction = 'up',
    distance = 30,
    duration = 0.8,
    delay = 0,
    ease = 'power3.out',
    trigger = 'scroll',
    threshold = 0.2,
    onComplete
  } = options;
  
  const { disableAllAnimations, disableScrollAnimations } = useAnimationSettings();
  
  // Use GSAP's useGSAP for proper context management
  useGSAP(() => {
    if (!elementRef?.current || disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      return;
    }
    
    // Configure animation based on effect type
    let animation;
    
    // Set initial state and animation based on effect
    switch (effect) {
      case 'fadeIn':
        const fromProps = { opacity: 0 };
        
        if (direction === 'up') fromProps.y = distance;
        else if (direction === 'down') fromProps.y = -distance;
        else if (direction === 'left') fromProps.x = distance;
        else if (direction === 'right') fromProps.x = -distance;
        
        animation = gsap.from(elementRef.current, {
          ...fromProps,
          duration,
          delay,
          ease,
          onComplete,
          clearProps: 'all'
        });
        break;
        
      case 'fadeOut':
        const toProps = { opacity: 0 };
        
        if (direction === 'up') toProps.y = -distance;
        else if (direction === 'down') toProps.y = distance;
        else if (direction === 'left') toProps.x = -distance;
        else if (direction === 'right') toProps.x = distance;
        
        animation = gsap.to(elementRef.current, {
          ...toProps,
          duration,
          delay,
          ease,
          onComplete
        });
        break;
        
      case 'slideIn':
        const slideProps = { opacity: 1 };
        const slideFrom = {};
        
        if (direction === 'up') slideFrom.y = distance;
        else if (direction === 'down') slideFrom.y = -distance;
        else if (direction === 'left') slideFrom.x = -distance;
        else if (direction === 'right') slideFrom.x = distance;
        
        gsap.set(elementRef.current, {
          ...slideFrom,
          opacity: 0
        });
        
        animation = gsap.to(elementRef.current, {
          ...slideProps,
          x: 0,
          y: 0,
          duration,
          delay,
          ease,
          onComplete,
          clearProps: 'all'
        });
        break;
        
      // Add more effect types as needed
        
      default:
        console.warn(`Unknown animation effect: ${effect}`);
        return;
    }
    
    // If scroll trigger is enabled, create a scroll trigger
    if (trigger === 'scroll' && !disableScrollAnimations) {
      animation.pause();
      
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: `top bottom-=${threshold * 100}%`,
        onEnter: () => animation.play(),
        once: true
      });
    }
    
  }, { 
    scope: elementRef, 
    dependencies: [
      effect, 
      direction, 
      distance, 
      duration, 
      delay, 
      ease, 
      trigger, 
      threshold,
      disableAllAnimations,
      disableScrollAnimations
    ] 
  });
  
  return {
    ref: elementRef
  };
};

/**
 * Hook to create scroll-based animations with GSAP ScrollTrigger
 * 
 * @param {React.RefObject} elementRef - Reference to the element to animate
 * @param {Object} options - ScrollTrigger options
 * @param {Object|Function} options.animation - Animation properties or function returning them
 * @param {Object} options.initial - Initial state properties
 * @param {string} options.start - ScrollTrigger start position
 * @param {string} options.end - ScrollTrigger end position
 * @param {boolean} options.scrub - Whether to link animation progress to scroll position
 * @param {boolean} options.markers - Show debug markers
 * @param {boolean} options.pin - Pin the element during animation
 * @param {string} options.toggleActions - ScrollTrigger toggle actions
 * @returns {Object} ScrollTrigger utilities
 */
export const useScrollTrigger = (elementRef, options = {}) => {
  const { 
    animation,
    initial,
    start = 'top bottom-=10%',
    end = 'bottom top+=10%',
    scrub = false,
    markers = false,
    pin = false,
    toggleActions = 'play none none reset',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack
  } = options;
  
  const { disableAllAnimations, disableScrollAnimations } = useAnimationSettings();
  
  useGSAP(() => {
    if (!elementRef?.current || disableAllAnimations || disableScrollAnimations) {
      return;
    }
    
    // Set initial state if provided
    if (initial) {
      gsap.set(elementRef.current, initial);
    }
    
    // Create animation
    let tween;
    
    if (typeof animation === 'function') {
      tween = animation(elementRef.current);
    } else if (animation) {
      tween = gsap.to(elementRef.current, animation);
    } else {
      tween = gsap.to(elementRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 1 
      });
    }
    
    // Pause animation if not in scrub mode
    if (!scrub) {
      tween.pause();
    }
    
    // Create scroll trigger
    ScrollTrigger.create({
      trigger: elementRef.current,
      start,
      end,
      markers,
      scrub,
      pin,
      toggleActions,
      onEnter: onEnter || (scrub ? null : () => tween.play()),
      onLeave,
      onEnterBack,
      onLeaveBack
    });
    
  }, { 
    scope: elementRef,
    dependencies: [
      JSON.stringify(animation),
      JSON.stringify(initial),
      start,
      end,
      scrub,
      markers,
      pin,
      toggleActions,
      disableAllAnimations,
      disableScrollAnimations
    ]
  });
  
  return {
    ref: elementRef
  };
};

export default {
  useAnimation,
  useAnimationEffect,
  useScrollTrigger
};