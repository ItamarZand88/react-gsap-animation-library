import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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
 * @param {Function} callback - Animation setup function
 * @param {Object} options - Configuration options
 * @returns {Object} Context, contextSafe function and other utilities
 */
export const useAnimation = (callback, options = {}) => {
  return useGSAP(callback, options);
};

/**
 * Utility hook for creating animations with a specific container reference
 * 
 * @param {Object} options - Hook options
 * @param {Function} options.animation - Animation setup function
 * @param {Array} options.dependencies - Dependency array for when to re-run animations
 * @param {boolean} options.revertOnUpdate - Whether to revert animations when dependencies change
 * @returns {Object} Animation utilities including the ref and contextSafe function
 */
export const useAnimationEffect = (options = {}) => {
  const containerRef = useRef(null);
  const { 
    animation, 
    dependencies = [], 
    revertOnUpdate = true 
  } = options;
  
  const { contextSafe } = useGSAP(() => {
    if (typeof animation === 'function') {
      animation(containerRef);
    }
  }, {
    scope: containerRef,
    dependencies,
    revertOnUpdate
  });
  
  return {
    ref: containerRef,
    contextSafe
  };
};

/**
 * Hook to safely use GSAP ScrollTrigger with proper cleanup
 * 
 * @param {Object} options - ScrollTrigger options
 * @param {React.RefObject} options.trigger - Element to trigger the animation
 * @param {string} options.start - Start position
 * @param {string} options.end - End position
 * @param {boolean} options.markers - Show debug markers
 * @param {Function} options.onEnter - Callback when entering view
 * @param {Function} options.onLeave - Callback when leaving view
 * @param {Function} options.onEnterBack - Callback when entering view backwards
 * @param {Function} options.onLeaveBack - Callback when leaving view backwards
 * @returns {Object} ScrollTrigger utilities
 */
export const useScrollTrigger = (options = {}) => {
  const { 
    trigger, 
    animation,
    start = "top bottom",
    end = "bottom top",
    scrub = false,
    pin = false,
    markers = false,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack
  } = options;
  
  useEffect(() => {
    if (!trigger?.current || typeof window === 'undefined') return;
    
    try {
      // Create the ScrollTrigger
      const st = ScrollTrigger.create({
        trigger: trigger.current,
        start,
        end,
        markers,
        scrub,
        pin,
        animation,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack
      });
      
      // Clean up on unmount
      return () => {
        st.kill();
      };
    } catch (error) {
      console.warn("ScrollTrigger creation failed:", error);
    }
  }, [
    trigger, animation, start, end, scrub, 
    pin, markers, onEnter, onLeave, 
    onEnterBack, onLeaveBack
  ]);
};

export default {
  useAnimation,
  useAnimationEffect,
  useScrollTrigger
};