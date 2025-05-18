import React, { useRef, useState, useEffect } from 'react';
import { useAnimationSettings } from '../../context/AnimationContext';
import { injectCSSKeyframes, mapEasing } from '../../utils/fallbacks';

/**
 * SimpleAnimated component that uses CSS animations exclusively
 * This component doesn't depend on GSAP at all, making it perfect for simple animations
 * and environments where you want to keep dependencies minimal
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animationType - Type of animation ('fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'zoomIn', 'pulse', 'bounce', 'typewriter')
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} props.ease - Easing function
 * @param {number} props.repeat - Number of times to repeat the animation (use -1 for infinite)
 * @param {boolean} props.yoyo - Whether to reverse the animation for each alternate repeat
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const SimpleAnimated = ({
  children,
  animationType = 'fadeIn',
  duration = 0.8,
  delay = 0,
  threshold = 0.2,
  ease = "power3.out",
  repeat = 0,
  yoyo = false,
  trigger = 'scroll',
  onStart = () => {},
  onComplete = () => {},
  className = '',
  style = {},
  ...otherProps
}) => {
  // Get reference to the DOM element
  const elementRef = useRef(null);
  
  // Animation state
  const [animationState, setAnimationState] = useState({
    hasAnimated: false,
    isAnimating: false
  });
  
  // Get global animation settings
  const {
    disableAllAnimations,
    disableScrollAnimations
  } = useAnimationSettings();
  
  // Inject CSS keyframes for animation
  useEffect(() => {
    injectCSSKeyframes();
  }, []);
  
  // Build animation styles
  const getAnimationStyles = () => {
    return {
      animation: `${animationState.isAnimating ? animationType : 'none'} ${duration}s ${mapEasing(ease)} ${delay}s ${repeat === -1 ? 'infinite' : repeat} ${yoyo ? 'alternate' : 'normal'} both`,
      visibility: animationState.hasAnimated || animationState.isAnimating ? 'visible' : 'hidden'
    };
  };
  
  // Play animation
  const playAnimation = () => {
    // Skip if disabled or already animated/animating
    if (disableAllAnimations || animationState.hasAnimated || animationState.isAnimating) return;
    
    setAnimationState({ ...animationState, isAnimating: true });
    onStart();
    
    // Set up completion listener
    const handleAnimationEnd = () => {
      setAnimationState({ hasAnimated: true, isAnimating: repeat === -1 });
      onComplete();
      
      if (repeat !== -1) {
        elementRef.current.removeEventListener('animationend', handleAnimationEnd);
      }
    };
    
    elementRef.current.addEventListener('animationend', handleAnimationEnd);
  };
  
  // Reset animation
  const resetAnimation = () => {
    if (disableAllAnimations) return;
    
    setAnimationState({ hasAnimated: false, isAnimating: false });
    
    // Remove any event listeners to be safe
    if (elementRef.current) {
      elementRef.current.removeEventListener('animationend', () => {});
    }
  };
  
  // Set up animation based on trigger type
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      // Make content visible if animations are disabled
      if (elementRef.current) {
        elementRef.current.style.visibility = 'visible';
      }
      return;
    }
    
    let observer;
    let timeoutId;
    
    switch (trigger) {
      case 'scroll':
        setupScrollTrigger();
        break;
        
      case 'load':
        // Auto-play after load
        timeoutId = setTimeout(playAnimation, 10);
        break;
        
      case 'none':
        // No auto-play
        break;
    }
    
    // Helper function for scroll trigger setup
    function setupScrollTrigger() {
      if (disableScrollAnimations) return;
      
      // Use IntersectionObserver since we're not using GSAP
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            playAnimation();
            if (repeat === -1) return; // Keep observing for infinite animations
            observer.disconnect();
          }
        },
        { threshold }
      );
      
      observer.observe(elementRef.current);
    }
    
    // Cleanup
    return () => {
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      elementRef.current.removeEventListener('animationend', () => {});
    };
  }, [trigger, threshold, disableAllAnimations, disableScrollAnimations, repeat]);
  
  // Set up event handlers based on trigger type
  const getEventHandlers = () => {
    if (disableAllAnimations) return {};
    
    if (trigger === 'hover') {
      return {
        onMouseEnter: playAnimation,
        onMouseLeave: resetAnimation
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
  const combinedStyle = {
    ...style,
    ...getAnimationStyles()
  };
  
  const componentProps = {
    ref: elementRef,
    className: `react-simple-animated ${animationType} ${className}`,
    style: combinedStyle,
    'data-animation-state': animationState.hasAnimated ? 'completed' : (animationState.isAnimating ? 'running' : 'initial'),
    'data-animation-type': animationType,
    ...getEventHandlers(),
    ...otherProps
  };
  
  return (
    <div {...componentProps}>
      {typeof children === 'function' 
        ? children({ 
            play: playAnimation, 
            reset: resetAnimation, 
            state: animationState 
          }) 
        : children
      }
    </div>
  );
};

export default SimpleAnimated;