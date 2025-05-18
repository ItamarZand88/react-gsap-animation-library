// Custom React hooks for GSAP animations
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Hook for simple animations
export const useGsapAnimation = (animationFunction, options = {}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = animationFunction(elementRef.current, options);
    }
    
    return () => {
      if (animationRef.current && animationRef.current.kill) {
        animationRef.current.kill();
      }
      
      if (animationRef.current && animationRef.current.cleanup) {
        animationRef.current.cleanup();
      }
    };
  }, [animationFunction, options]);
  
  return elementRef;
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const {
    animation = 'fadeIn',
    duration = 0.8,
    delay = 0,
    threshold = 0.2,
    start = `top bottom-=${threshold * 100}%`,
    markers = false,
    scrub = false,
    pin = false,
    once = true,
    from = {},
    to = {}
  } = options;
  
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let animationSettings = {};
    
    // Set up animation settings based on the animation type
    switch(animation) {
      case 'fadeIn':
        animationSettings = { opacity: 0, y: 30, ...from };
        break;
      case 'slideInLeft':
        animationSettings = { opacity: 0, x: -100, ...from };
        break;
      case 'slideInRight':
        animationSettings = { opacity: 0, x: 100, ...from };
        break;
      case 'slideInUp':
        animationSettings = { opacity: 0, y: 100, ...from };
        break;
      case 'slideInDown':
        animationSettings = { opacity: 0, y: -100, ...from };
        break;
      case 'scale':
        animationSettings = { opacity: 0, scale: 0.5, ...from };
        break;
      case 'rotate':
        animationSettings = { opacity: 0, rotation: 90, ...from };
        break;
      default:
        animationSettings = { ...from };
    }
    
    const toggleActions = once ? "play none none none" : "play reverse play reverse";
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start,
        markers,
        toggleActions,
        scrub,
        pin
      }
    });
    
    if (Object.keys(animationSettings).length > 0) {
      tl.from(element, {
        ...animationSettings,
        duration,
        delay,
        clearProps: once ? "all" : "",
        ...to
      });
    } else if (Object.keys(to).length > 0) {
      tl.to(element, {
        ...to,
        duration,
        delay
      });
    }
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, duration, delay, threshold, start, markers, scrub, pin, once, from, to]);
  
  return elementRef;
};

// Hook for creating timelines
export const useGsapTimeline = (options = {}) => {
  const { scrollTrigger = null, delay = 0, repeat = 0, yoyo = false } = options;
  const timelineRef = useRef();
  
  useEffect(() => {
    timelineRef.current = gsap.timeline({
      delay,
      repeat,
      yoyo,
      scrollTrigger: scrollTrigger
        ? {
            ...scrollTrigger,
            trigger: scrollTrigger.trigger
          }
        : null
    });
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [delay, repeat, yoyo, scrollTrigger]);
  
  return timelineRef;
};