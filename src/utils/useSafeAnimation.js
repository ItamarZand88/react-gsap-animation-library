import { useRef, useState, useEffect } from 'react';

/**
 * Hook for safely using animations with multiple fallback layers
 * Primary layer: GSAP if available
 * Secondary layer: Web Animation API
 * Tertiary layer: CSS animations
 * 
 * @param {React.RefObject} ref - Reference to the target element
 * @returns {Object} Animation controls and state
 */
export const useSafeAnimation = (ref) => {
  const [isGsapAvailable, setIsGsapAvailable] = useState(false);
  const [isWebAnimationAvailable, setIsWebAnimationAvailable] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState([]);
  
  // Check for animation capabilities on mount
  useEffect(() => {
    // Check for GSAP
    try {
      const gsap = window.gsap || (typeof require === 'function' && require('gsap'));
      setIsGsapAvailable(!!gsap);
    } catch (error) {
      setIsGsapAvailable(false);
    }
    
    // Check for Web Animation API
    try {
      setIsWebAnimationAvailable(
        typeof Element !== 'undefined' && 
        typeof Element.prototype.animate === 'function'
      );
    } catch (error) {
      setIsWebAnimationAvailable(false);
    }
  }, []);
  
  // Helper to safely get GSAP
  const getGSAP = () => {
    if (!isGsapAvailable) return null;
    try {
      return window.gsap || (typeof require === 'function' && require('gsap'));
    } catch (error) {
      console.warn('Failed to get GSAP instance:', error);
      return null;
    }
  };
  
  // Helper to get ScrollTrigger
  const getScrollTrigger = () => {
    if (!isGsapAvailable) return null;
    try {
      const gsap = getGSAP();
      if (gsap && gsap.plugins && gsap.plugins.ScrollTrigger) {
        return gsap.plugins.ScrollTrigger;
      }
      
      // Try to get it from the window or require it
      return window.ScrollTrigger || (typeof require === 'function' && require('gsap/ScrollTrigger'));
    } catch (error) {
      console.warn('Failed to get ScrollTrigger:', error);
      return null;
    }
  };
  
  // Helper to register ScrollTrigger plugin
  const registerScrollTrigger = () => {
    if (!isGsapAvailable) return false;
    
    try {
      const gsap = getGSAP();
      const ScrollTrigger = getScrollTrigger();
      
      if (gsap && ScrollTrigger && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to register ScrollTrigger:', error);
      return false;
    }
  };
  
  // Helper to create a GSAP animation
  const createGSAPAnimation = (props = {}) => {
    if (!isGsapAvailable || !ref.current) return null;
    
    try {
      const gsap = getGSAP();
      if (!gsap) return null;
      
      // Handle 'from' animation
      if (props.from) {
        return gsap.from(ref.current, props.from);
      }
      
      // Handle 'to' animation
      if (props.to) {
        return gsap.to(ref.current, props.to);
      }
      
      // Handle timeline
      if (props.timeline) {
        const timeline = gsap.timeline(props.timelineOptions || {});
        
        // Process each animation in the timeline
        props.timeline.forEach(anim => {
          if (anim.from) {
            timeline.from(ref.current, anim.from);
          } else if (anim.to) {
            timeline.to(ref.current, anim.to);
          }
        });
        
        return timeline;
      }
      
      return null;
    } catch (error) {
      console.warn('GSAP animation creation failed:', error);
      return null;
    }
  };
  
  // Helper to create a Web Animation API animation
  const createWebAnimation = (props = {}) => {
    if (!isWebAnimationAvailable || !ref.current) return null;
    
    try {
      const element = ref.current;
      
      // Convert GSAP props to Web Animation API format
      const convertGSAPToWebAnimation = (gsapProps) => {
        const { 
          x, y, rotation, scale, scaleX, scaleY, opacity, 
          duration, delay, ease, repeat, yoyo,
          ...rest
        } = gsapProps;
        
        // Build keyframes
        const keyframe = {};
        
        // Handle transform properties
        let transform = '';
        if (x !== undefined) transform += `translateX(${x}px) `;
        if (y !== undefined) transform += `translateY(${y}px) `;
        if (rotation !== undefined) transform += `rotate(${rotation}deg) `;
        if (scale !== undefined) transform += `scale(${scale}) `;
        if (scaleX !== undefined) transform += `scaleX(${scaleX}) `;
        if (scaleY !== undefined) transform += `scaleY(${scaleY}) `;
        
        if (transform) keyframe.transform = transform.trim();
        if (opacity !== undefined) keyframe.opacity = opacity;
        
        // Handle other CSS properties by converting camelCase to kebab-case
        Object.entries(rest).forEach(([key, value]) => {
          // Skip non-CSS properties
          if (['onComplete', 'onStart', 'onUpdate'].includes(key)) return;
          
          // Convert camelCase to kebab-case
          const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          keyframe[kebabKey] = value;
        });
        
        return keyframe;
      };
      
      // Convert GSAP ease to Web Animation API easing
      const convertEase = (gsapEase) => {
        const easingMap = {
          'none': 'linear',
          'power1.in': 'ease-in',
          'power1.out': 'ease-out',
          'power1.inOut': 'ease-in-out',
          'power2.in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
          'power2.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          'power2.inOut': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          'power3.in': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
          'power3.out': 'cubic-bezier(0.23, 1, 0.32, 1)',
          'power3.inOut': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          'power4.in': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
          'power4.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          'power4.inOut': 'cubic-bezier(0.77, 0, 0.175, 1)',
          'expo.in': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          'expo.out': 'cubic-bezier(0.19, 1, 0.22, 1)',
          'expo.inOut': 'cubic-bezier(1, 0, 0, 1)',
          'elastic.in': 'cubic-bezier(0.7, 0, 0.84, 0)',
          'elastic.out': 'cubic-bezier(0.16, 1, 0.3, 1)',
          'elastic.inOut': 'cubic-bezier(0.87, 0, 0.13, 1)',
        };
        
        return easingMap[gsapEase] || 'ease-out';
      };
      
      // Handle 'from' animation
      if (props.from) {
        const { duration = 1, delay = 0, ease = 'power2.out' } = props.from;
        
        const startKeyframe = convertGSAPToWebAnimation(props.from);
        const endKeyframe = {}; // Target state
        
        return element.animate(
          [startKeyframe, endKeyframe],
          { 
            duration: duration * 1000, 
            delay: delay * 1000,
            easing: convertEase(ease),
            fill: 'forwards' 
          }
        );
      }
      
      // Handle 'to' animation
      if (props.to) {
        const { duration = 1, delay = 0, ease = 'power2.out' } = props.to;
        
        const startKeyframe = {}; // Current state
        const endKeyframe = convertGSAPToWebAnimation(props.to);
        
        return element.animate(
          [startKeyframe, endKeyframe],
          { 
            duration: duration * 1000, 
            delay: delay * 1000,
            easing: convertEase(ease),
            fill: 'forwards' 
          }
        );
      }
      
      return null;
    } catch (error) {
      console.warn('Web Animation API animation creation failed:', error);
      return null;
    }
  };
  
  // Helper to create a CSS animation
  const createCSSAnimation = (props = {}) => {
    if (!ref.current) return null;
    
    try {
      const element = ref.current;
      const { from, to, duration = 1, delay = 0, ease = 'power2.out' } = props;
      
      // Convert GSAP ease to CSS ease
      const convertEase = (gsapEase) => {
        const easingMap = {
          'none': 'linear',
          'power1.in': 'ease-in',
          'power1.out': 'ease-out',
          'power1.inOut': 'ease-in-out',
          'power2.in': 'ease-in',
          'power2.out': 'ease-out',
          'power2.inOut': 'ease-in-out',
          'power3.in': 'ease-in',
          'power3.out': 'ease-out',
          'power3.inOut': 'ease-in-out',
          'elastic.in': 'ease-in',
          'elastic.out': 'ease-out',
          'elastic.inOut': 'ease-in-out',
          'expo.in': 'ease-in',
          'expo.out': 'ease-out',
          'expo.inOut': 'ease-in-out',
        };
        
        return easingMap[gsapEase] || 'ease-out';
      };
      
      // Apply initial state if 'from' animation
      if (from) {
        Object.entries(from).forEach(([key, value]) => {
          // Skip animation parameters
          if (['duration', 'delay', 'ease', 'onComplete', 'onStart', 'onUpdate'].includes(key)) {
            return;
          }
          
          // Handle transform properties
          if (['x', 'y', 'rotation', 'scale', 'scaleX', 'scaleY'].includes(key)) {
            let transform = element.style.transform || '';
            
            if (key === 'x') transform += ` translateX(${value}px)`;
            if (key === 'y') transform += ` translateY(${value}px)`;
            if (key === 'rotation') transform += ` rotate(${value}deg)`;
            if (key === 'scale') transform += ` scale(${value})`;
            if (key === 'scaleX') transform += ` scaleX(${value})`;
            if (key === 'scaleY') transform += ` scaleY(${value})`;
            
            element.style.transform = transform.trim();
            return;
          }
          
          // Handle opacity
          if (key === 'opacity') {
            element.style.opacity = value;
            return;
          }
          
          // Handle other CSS properties by converting camelCase to kebab-case
          const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          element.style[kebabKey] = value;
        });
      }
      
      // Set up transition
      element.style.transition = `all ${duration}s ${convertEase(ease)} ${delay}s`;
      
      // Apply target state for 'to' animation or reset for 'from' animation
      setTimeout(() => {
        if (to) {
          // Apply 'to' properties
          Object.entries(to).forEach(([key, value]) => {
            // Skip animation parameters
            if (['duration', 'delay', 'ease', 'onComplete', 'onStart', 'onUpdate'].includes(key)) {
              return;
            }
            
            // Handle transform properties
            if (['x', 'y', 'rotation', 'scale', 'scaleX', 'scaleY'].includes(key)) {
              let transform = element.style.transform || '';
              
              if (key === 'x') transform += ` translateX(${value}px)`;
              if (key === 'y') transform += ` translateY(${value}px)`;
              if (key === 'rotation') transform += ` rotate(${value}deg)`;
              if (key === 'scale') transform += ` scale(${value})`;
              if (key === 'scaleX') transform += ` scaleX(${value})`;
              if (key === 'scaleY') transform += ` scaleY(${value})`;
              
              element.style.transform = transform.trim();
              return;
            }
            
            // Handle opacity
            if (key === 'opacity') {
              element.style.opacity = value;
              return;
            }
            
            // Handle other CSS properties
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.style[kebabKey] = value;
          });
        } else if (from) {
          // Reset from 'from' animation
          Object.keys(from).forEach(key => {
            // Skip animation parameters
            if (['duration', 'delay', 'ease', 'onComplete', 'onStart', 'onUpdate'].includes(key)) {
              return;
            }
            
            if (['x', 'y', 'rotation', 'scale', 'scaleX', 'scaleY'].includes(key)) {
              element.style.transform = '';
              return;
            }
            
            if (key === 'opacity') {
              element.style.opacity = '';
              return;
            }
            
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.style[kebabKey] = '';
          });
        }
      }, 10);
      
      // Create a fake animation control object
      return {
        _isCSSFallback: true,
        _element: element,
        _timeout: setTimeout(() => {
          if (props.from && props.from.onComplete) {
            props.from.onComplete();
          }
          if (props.to && props.to.onComplete) {
            props.to.onComplete();
          }
        }, (duration + delay) * 1000),
        
        // GSAP-like API
        kill: function() {
          clearTimeout(this._timeout);
          this._element.style.transition = '';
        },
        pause: function() {
          // Not directly supported in CSS
          console.warn('Pause not supported in CSS animation fallback');
        },
        resume: function() {
          // Not directly supported in CSS
          console.warn('Resume not supported in CSS animation fallback');
        },
        reverse: function() {
          // Not directly supported in CSS
          console.warn('Reverse not supported in CSS animation fallback');
        },
        progress: function(value) {
          // Not directly supported in CSS
          console.warn('Progress control not supported in CSS animation fallback');
          return 0;
        },
        timeScale: function() {
          // Not directly supported in CSS
          console.warn('TimeScale not supported in CSS animation fallback');
          return 1;
        }
      };
    } catch (error) {
      console.warn('CSS animation fallback failed:', error);
      return null;
    }
  };
  
  // Main animation creation function with fallbacks
  const animate = (props = {}) => {
    let animation = null;
    
    // Try GSAP first
    if (isGsapAvailable) {
      animation = createGSAPAnimation(props);
      if (animation) {
        const newAnimations = [...activeAnimations, animation];
        setActiveAnimations(newAnimations);
        return animation;
      }
    }
    
    // Try Web Animation API next
    if (isWebAnimationAvailable) {
      animation = createWebAnimation(props);
      if (animation) {
        const newAnimations = [...activeAnimations, animation];
        setActiveAnimations(newAnimations);
        return animation;
      }
    }
    
    // Fall back to CSS
    animation = createCSSAnimation(props);
    if (animation) {
      const newAnimations = [...activeAnimations, animation];
      setActiveAnimations(newAnimations);
    }
    
    return animation;
  };
  
  // Kill all active animations
  const killAll = () => {
    activeAnimations.forEach(animation => {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
      } else if (animation && animation.cancel) {
        animation.cancel();
      }
    });
    
    setActiveAnimations([]);
  };
  
  // Kill animations on unmount
  useEffect(() => {
    return () => {
      killAll();
    };
  }, []);
  
  return {
    animate,
    killAll,
    isGsapAvailable,
    isWebAnimationAvailable,
    getGSAP,
    getScrollTrigger,
    registerScrollTrigger
  };
};

export default useSafeAnimation;