import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook that provides animation capabilities
 * This hook is GSAP-independent for maximum compatibility
 * 
 * @param {Object} options - Animation options
 * @param {string} options.type - Animation type ('fade', 'slide', 'scale', etc.)
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Animation delay in seconds
 * @param {string} options.easing - CSS easing function
 * @param {string} options.trigger - When to trigger animation ('auto', 'hover', 'click', 'visible')
 * @param {Object} options.from - Initial animation properties
 * @param {Object} options.to - Final animation properties
 * @param {function} options.onComplete - Callback when animation completes
 * @returns {Object} Animation control object
 */
export const useAnimation = ({
  type = 'fade',
  duration = 0.5,
  delay = 0,
  easing = 'ease-out',
  trigger = 'auto',
  from = {},
  to = {},
  onComplete = () => {}
} = {}) => {
  const ref = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Get default 'from' and 'to' values based on animation type
  const getDefaultAnimationValues = () => {
    let defaultFrom = {};
    let defaultTo = {};
    
    switch (type) {
      case 'fade':
        defaultFrom = { opacity: 0 };
        defaultTo = { opacity: 1 };
        break;
      case 'slide-left':
        defaultFrom = { opacity: 0, transform: 'translateX(-50px)' };
        defaultTo = { opacity: 1, transform: 'translateX(0)' };
        break;
      case 'slide-right':
        defaultFrom = { opacity: 0, transform: 'translateX(50px)' };
        defaultTo = { opacity: 1, transform: 'translateX(0)' };
        break;
      case 'slide-up':
        defaultFrom = { opacity: 0, transform: 'translateY(50px)' };
        defaultTo = { opacity: 1, transform: 'translateY(0)' };
        break;
      case 'slide-down':
        defaultFrom = { opacity: 0, transform: 'translateY(-50px)' };
        defaultTo = { opacity: 1, transform: 'translateY(0)' };
        break;
      case 'scale':
        defaultFrom = { opacity: 0, transform: 'scale(0.8)' };
        defaultTo = { opacity: 1, transform: 'scale(1)' };
        break;
      case 'rotate':
        defaultFrom = { opacity: 0, transform: 'rotate(-25deg)' };
        defaultTo = { opacity: 1, transform: 'rotate(0)' };
        break;
      default:
        defaultFrom = { opacity: 0 };
        defaultTo = { opacity: 1 };
    }
    
    return { defaultFrom, defaultTo };
  };
  
  // Merge default and custom animation values
  const { defaultFrom, defaultTo } = getDefaultAnimationValues();
  const animationFrom = { ...defaultFrom, ...from };
  const animationTo = { ...defaultTo, ...to };
  
  // Convert style object to CSS string
  const objectToCSSString = (styleObj) => {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabKey}: ${value};`;
      })
      .join(' ');
  };

  // Initialize animation based on trigger type
  useEffect(() => {
    if (!ref.current) return;
    
    // Set initial styles
    Object.entries(animationFrom).forEach(([prop, value]) => {
      ref.current.style[prop] = value;
    });
    
    // Set transition
    ref.current.style.transition = `all ${duration}s ${easing} ${delay}s`;
    
    // Handle different trigger types
    if (trigger === 'auto') {
      // Auto trigger animation after a small delay
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50); // Small delay to ensure initial styles are applied
      
      return () => clearTimeout(timer);
    } else if (trigger === 'visible') {
      // Setup intersection observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [ref.current]);
  
  // Handle visibility changes
  useEffect(() => {
    if (isVisible && trigger === 'visible') {
      setIsAnimating(true);
    }
  }, [isVisible, trigger]);
  
  // Apply animation when isAnimating changes
  useEffect(() => {
    if (!ref.current || !isAnimating) return;
    
    // Apply target styles
    Object.entries(animationTo).forEach(([prop, value]) => {
      ref.current.style[prop] = value;
    });
    
    // Handle animation completion
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, (duration + delay) * 1000);
    
    return () => clearTimeout(timer);
  }, [isAnimating, duration, delay]);
  
  // Play animation manually
  const play = () => {
    if (!isAnimating && !isComplete) {
      setIsAnimating(true);
    }
  };
  
  // Reset animation
  const reset = () => {
    if (!ref.current) return;
    
    // Reset to initial styles
    Object.entries(animationFrom).forEach(([prop, value]) => {
      ref.current.style[prop] = value;
    });
    
    setIsAnimating(false);
    setIsComplete(false);
  };
  
  // Stop animation and freeze current state
  const stop = () => {
    if (!ref.current || !isAnimating) return;
    
    // Get current computed styles
    const computedStyle = window.getComputedStyle(ref.current);
    const currentTransform = computedStyle.transform;
    const currentOpacity = computedStyle.opacity;
    
    // Remove transition
    ref.current.style.transition = 'none';
    
    // Freeze at current position
    ref.current.style.transform = currentTransform;
    ref.current.style.opacity = currentOpacity;
    
    setIsAnimating(false);
  };
  
  // Get style props for the element
  const getStyleProps = () => {
    return {
      ref,
      style: {
        transition: `all ${duration}s ${easing} ${delay}s`,
        ...(isAnimating ? animationTo : animationFrom)
      }
    };
  };
  
  // Get props for click trigger
  const getClickProps = () => {
    if (trigger === 'click') {
      return {
        onClick: play
      };
    }
    return {};
  };
  
  // Get props for hover trigger
  const getHoverProps = () => {
    if (trigger === 'hover') {
      return {
        onMouseEnter: play,
        onMouseLeave: reset
      };
    }
    return {};
  };
  
  // Props to spread on the element
  const props = {
    ...getStyleProps(),
    ...getClickProps(),
    ...getHoverProps(),
    'data-animation-state': isAnimating ? 'running' : (isComplete ? 'completed' : 'initial')
  };
  
  return {
    ref,
    play,
    reset,
    stop,
    isAnimating,
    isComplete,
    isVisible,
    props
  };
};

/**
 * Hook for detecting when an element is visible in the viewport
 * 
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.root - Root element selector
 * @param {string} options.rootMargin - Root margin
 * @param {function} options.onEnter - Callback when element enters viewport
 * @param {function} options.onExit - Callback when element exits viewport
 * @returns {Object} The ref to attach and the visibility state
 */
export const useInView = ({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  onEnter = () => {},
  onExit = () => {}
} = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsInView(isVisible);
        
        if (isVisible) {
          onEnter(entry);
        } else {
          onExit(entry);
        }
      },
      {
        threshold,
        root: root ? document.querySelector(root) : null,
        rootMargin
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [ref.current, threshold, root, rootMargin]);
  
  return { ref, isInView };
};

/**
 * Hook for safely using GSAP without direct dependencies
 * Falls back to standard DOM animations if GSAP is not available
 * 
 * @param {Object} options - Animation options
 * @returns {Object} Animation controls and ref
 */
export const useSafeGSAP = (options = {}) => {
  const ref = useRef(null);
  const [gsapAvailable, setGsapAvailable] = useState(false);
  const [timeline, setTimeline] = useState(null);
  
  // Check if GSAP is available
  useEffect(() => {
    try {
      const gsapCheck = window.gsap || require('gsap');
      setGsapAvailable(!!gsapCheck);
    } catch (e) {
      setGsapAvailable(false);
    }
  }, []);
  
  // Helper function to safely access GSAP
  const getGSAP = () => {
    if (!gsapAvailable) return null;
    
    try {
      return window.gsap || require('gsap');
    } catch (e) {
      return null;
    }
  };
  
  // Create a fallback animation using the Web Animation API
  const createFallbackAnimation = (target, animationProps) => {
    if (!target) return null;
    
    const { from = {}, to = {}, duration = 1, delay = 0 } = animationProps;
    
    // Convert GSAP-style properties to Web Animation API format
    const convertProps = (props) => {
      const result = {};
      
      // Handle transform properties
      const transformProps = ['x', 'y', 'rotation', 'scale', 'scaleX', 'scaleY'];
      const hasTransform = transformProps.some(prop => prop in props);
      
      if (hasTransform) {
        let transformValue = '';
        
        if ('x' in props) transformValue += `translateX(${props.x}px) `;
        if ('y' in props) transformValue += `translateY(${props.y}px) `;
        if ('rotation' in props) transformValue += `rotate(${props.rotation}deg) `;
        if ('scale' in props) transformValue += `scale(${props.scale}) `;
        if ('scaleX' in props) transformValue += `scaleX(${props.scaleX}) `;
        if ('scaleY' in props) transformValue += `scaleY(${props.scaleY}) `;
        
        result.transform = transformValue.trim();
      }
      
      // Handle opacity
      if ('opacity' in props) {
        result.opacity = props.opacity;
      }
      
      return result;
    };
    
    const keyframes = [
      convertProps(from),
      convertProps(to)
    ];
    
    const timing = {
      duration: duration * 1000,
      delay: delay * 1000,
      fill: 'forwards',
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' // Approximate power2.out
    };
    
    try {
      return target.animate(keyframes, timing);
    } catch (e) {
      console.warn('Failed to create fallback animation:', e);
      return null;
    }
  };
  
  // Create a GSAP or fallback animation
  const animate = (animationProps = {}) => {
    const element = ref.current;
    if (!element) return null;
    
    const gsap = getGSAP();
    
    if (gsap) {
      // Use GSAP
      const tl = gsap.timeline(animationProps.timelineOptions || {});
      setTimeline(tl);
      
      if (animationProps.from) {
        tl.from(element, animationProps.from);
      }
      
      if (animationProps.to) {
        tl.to(element, animationProps.to);
      }
      
      return tl;
    } else {
      // Use fallback
      return createFallbackAnimation(element, animationProps);
    }
  };
  
  return {
    ref,
    animate,
    gsapAvailable,
    timeline
  };
};

export default {
  useAnimation,
  useInView,
  useSafeGSAP
};