import React, { useRef, useState, useEffect } from 'react';
import useSafeAnimation from '../../utils/useSafeAnimation';
import { useAnimationSettings } from '../../context/AnimationContext';
import { injectCSSKeyframes } from '../../utils/fallbacks';

/**
 * TextReveal component for creating text reveal animations with multiple fallback mechanisms
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to reveal
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {string} props.ease - Easing function
 * @param {string} props.direction - Reveal direction ('left', 'right', 'top', 'bottom')
 * @param {string} props.backgroundColor - Background color for the reveal mask
 * @param {string} props.textColor - Text color
 * @param {string} props.maskStyle - Additional style for the mask ('solid', 'gradient', 'split')
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const TextReveal = ({
  children,
  duration = 1.2,
  delay = 0,
  threshold = 0.2,
  ease = "power4.inOut",
  direction = 'left',
  backgroundColor = '#000',
  textColor = 'inherit',
  maskStyle = 'solid',
  trigger = 'scroll',
  onStart = () => {},
  onComplete = () => {},
  className = '',
  style = {},
  ...otherProps
}) => {
  // Get references to DOM elements
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);
  
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
  
  // Use safe animation hook
  const { animate, isGsapAvailable } = useSafeAnimation(containerRef);
  
  // Inject CSS keyframes for fallback
  useEffect(() => {
    injectCSSKeyframes();
  }, []);
  
  // Get mask styles based on direction and maskStyle
  const getMaskStyles = () => {
    // Base styles
    const baseStyles = {
      position: 'absolute',
      background: backgroundColor,
      zIndex: 1
    };
    
    // Direction-specific styles
    let directionStyles = {};
    switch (direction) {
      case 'left':
        directionStyles = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'scaleX(1)',
          transformOrigin: 'right'
        };
        break;
      case 'right':
        directionStyles = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'scaleX(1)',
          transformOrigin: 'left'
        };
        break;
      case 'top':
        directionStyles = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'scaleY(1)',
          transformOrigin: 'bottom'
        };
        break;
      case 'bottom':
        directionStyles = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'scaleY(1)',
          transformOrigin: 'top'
        };
        break;
      default:
        directionStyles = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          transform: 'scaleX(1)',
          transformOrigin: 'right'
        };
    }
    
    // Mask style variations
    let maskVariationStyles = {};
    switch (maskStyle) {
      case 'gradient':
        const gradientDirection = 
          direction === 'left' ? 'to right' :
          direction === 'right' ? 'to left' :
          direction === 'top' ? 'to bottom' :
          'to top';
        
        maskVariationStyles = {
          background: `linear-gradient(${gradientDirection}, ${backgroundColor} 0%, ${backgroundColor}CC 70%, ${backgroundColor}00 100%)`
        };
        break;
      case 'split':
        // Split mask handled differently in animation
        break;
      default:
        // Solid is default, no additional styles needed
    }
    
    return {
      ...baseStyles,
      ...directionStyles,
      ...maskVariationStyles
    };
  };
  
  // Get text styles
  const getTextStyles = () => {
    return {
      position: 'relative',
      zIndex: 2,
      color: textColor,
      opacity: 0 // Start hidden, will be revealed in animation
    };
  };
  
  // Handle animations with smart fallbacks
  const getAnimationProps = () => {
    const isHorizontal = direction === 'left' || direction === 'right';
    const transformProperty = isHorizontal ? 'scaleX' : 'scaleY';
    const transformTo = 0;
    
    // Standard animation for text and mask
    const textAnimation = {
      opacity: 1,
      duration: duration * 0.6,
      delay: delay + (duration * 0.4), // Start text fade in as mask is almost done
      ease
    };
    
    let maskAnimation;
    if (maskStyle === 'split') {
      // For split style, we move the mask outside instead of scaling it
      maskAnimation = {
        [isHorizontal ? 'x' : 'y']: isHorizontal ? 
          (direction === 'left' ? '100%' : '-100%') : 
          (direction === 'top' ? '100%' : '-100%'),
        duration,
        delay,
        ease
      };
    } else {
      // For regular styles, we scale the mask
      maskAnimation = {
        [transformProperty]: transformTo,
        duration,
        delay,
        ease
      };
    }
    
    return {
      textAnimation,
      maskAnimation
    };
  };
  
  // Play animation
  const playAnimation = () => {
    // Skip if disabled or already animated/animating
    if (disableAllAnimations || animationState.hasAnimated || animationState.isAnimating) return;
    
    setAnimationState({ ...animationState, isAnimating: true });
    onStart();
    
    const { textAnimation, maskAnimation } = getAnimationProps();
    
    // Animate with fallbacks
    const maskAnim = animate({
      to: {
        ...maskAnimation,
        onComplete: () => {
          // Ensure mask is completely gone at the end
          if (maskRef.current) {
            maskRef.current.style.display = 'none';
          }
        }
      }
    }, maskRef.current);
    
    const textAnim = animate({
      to: {
        ...textAnimation,
        onComplete: () => {
          setAnimationState({ hasAnimated: true, isAnimating: false });
          onComplete();
        }
      }
    }, textRef.current);
  };
  
  // Reset animation
  const resetAnimation = () => {
    if (disableAllAnimations) return;
    
    setAnimationState({ hasAnimated: false, isAnimating: false });
    
    // Reset element states
    if (maskRef.current) {
      maskRef.current.style.display = 'block';
      
      // Reset transform based on direction
      const isHorizontal = direction === 'left' || direction === 'right';
      maskRef.current.style.transform = isHorizontal ? 'scaleX(1)' : 'scaleY(1)';
      
      // Reset position for split style
      if (maskStyle === 'split') {
        maskRef.current.style.transform = 'translate(0, 0)';
      }
    }
    
    if (textRef.current) {
      textRef.current.style.opacity = '0';
    }
  };
  
  // Set up animation based on trigger type
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      // Make text visible if animations are disabled
      if (textRef.current) {
        textRef.current.style.opacity = '1';
      }
      if (maskRef.current) {
        maskRef.current.style.display = 'none';
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
      
      observer.observe(containerRef.current);
    }
    
    // Cleanup
    return () => {
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [trigger, threshold, disableAllAnimations, disableScrollAnimations, direction, maskStyle]);
  
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
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    ...style
  };
  
  const componentProps = {
    ref: containerRef,
    className: `react-gsap-textreveal ${className}`,
    style: containerStyle,
    'data-animation-state': animationState.hasAnimated ? 'completed' : (animationState.isAnimating ? 'running' : 'initial'),
    'data-direction': direction,
    'data-mask-style': maskStyle,
    ...getEventHandlers(),
    ...otherProps
  };
  
  return (
    <div {...componentProps}>
      <div 
        ref={maskRef} 
        className="react-gsap-textreveal-mask"
        style={getMaskStyles()}
      />
      <div 
        ref={textRef} 
        className="react-gsap-textreveal-text"
        style={getTextStyles()}
      >
        {typeof children === 'function' 
          ? children({ 
              play: playAnimation, 
              reset: resetAnimation, 
              state: animationState 
            }) 
          : children
        }
      </div>
    </div>
  );
};

export default TextReveal;