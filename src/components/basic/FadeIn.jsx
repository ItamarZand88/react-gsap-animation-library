import React, { useRef, useState, useEffect } from 'react';
import useSafeAnimation from '../../utils/useSafeAnimation';
import { useAnimationSettings } from '../../context/AnimationContext';
import { injectCSSKeyframes } from '../../utils/fallbacks';

/**
 * FadeIn component for creating fade in animations with multiple fallback mechanisms
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} props.ease - Easing function
 * @param {number} props.stagger - Stagger delay for multiple children
 * @param {Object} props.from - Initial animation properties
 * @param {string} props.direction - Fade direction ('up', 'down', 'left', 'right', 'none')
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const FadeIn = ({ 
  children, 
  duration = 0.8, 
  delay = 0, 
  threshold = 0.2,
  ease = "power3.out",
  stagger = 0.1,
  from = {},
  direction = 'up',
  trigger = 'scroll', // 'scroll', 'load', 'none', 'hover', 'click'
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
    disableScrollAnimations,
    defaultDuration,
    defaultEase,
    defaultDelay,
    defaultThreshold
  } = useAnimationSettings();
  
  // Use safe animation hook
  const { animate, isGsapAvailable } = useSafeAnimation(elementRef);
  
  // Determine if we have multiple children to animate
  const childrenArray = React.Children.toArray(children);
  const hasMultipleChildren = childrenArray.length > 1;
  
  // Inject CSS keyframes for fallback
  useEffect(() => {
    injectCSSKeyframes();
  }, []);
  
  // Get direction-based animation properties
  const getDirectionalFrom = () => {
    const base = { opacity: 0 };
    
    switch (direction) {
      case 'up':
        return { ...base, y: 30 };
      case 'down':
        return { ...base, y: -30 };
      case 'left':
        return { ...base, x: 30 };
      case 'right':
        return { ...base, x: -30 };
      case 'none':
        return base;
      default:
        return { ...base, y: 30 };
    }
  };
  
  // Merge default 'from' with directional and custom props
  const getAnimationProps = () => {
    const directionalFrom = getDirectionalFrom();
    
    return {
      from: {
        ...directionalFrom,
        ...from,
        duration,
        delay,
        ease,
        stagger: hasMultipleChildren ? stagger : 0,
        onStart,
        onComplete: () => {
          setAnimationState({ hasAnimated: true, isAnimating: false });
          onComplete();
        }
      }
    };
  };
  
  // Play animation
  const playAnimation = () => {
    // Skip if disabled or already animated/animating
    if (disableAllAnimations || animationState.hasAnimated || animationState.isAnimating) return;
    
    setAnimationState({ ...animationState, isAnimating: true });
    onStart();
    
    // Determine targets for animation
    const targets = hasMultipleChildren ? elementRef.current.children : elementRef.current;
    
    // Animate with fallbacks
    animate(getAnimationProps(), targets);
  };
  
  // Reset animation
  const resetAnimation = () => {
    if (disableAllAnimations) return;
    
    setAnimationState({ hasAnimated: false, isAnimating: false });
  };
  
  // Set up animation based on trigger type
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
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
      
      // Use IntersectionObserver as the universal solution
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            playAnimation();
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
    };
  }, [trigger, threshold, disableAllAnimations, disableScrollAnimations]);
  
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
  };
  
  const componentProps = {
    ref: elementRef,
    className: `react-gsap-fadein ${className}`,
    style: combinedStyle,
    'data-animation-state': animationState.hasAnimated ? 'completed' : (animationState.isAnimating ? 'running' : 'initial'),
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

export default FadeIn;