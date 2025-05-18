import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useAnimationSettings } from '../../context/AnimationContext';

/**
 * TextReveal component for creating text reveal animations with mask effects
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to reveal
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {string} props.direction - Reveal direction ('left', 'right', 'top', 'bottom')
 * @param {string} props.backgroundColor - Background color for the reveal mask
 * @param {string} props.textColor - Text color
 * @param {string} props.maskStyle - Additional style for the mask ('solid', 'gradient', 'split')
 * @param {string} props.trigger - Animation trigger type ('scroll', 'load', 'none', 'hover', 'click')
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {function} props.onStart - Callback when animation starts
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const TextReveal = ({
  children,
  duration = 1.2,
  delay = 0,
  ease = "power4.inOut",
  direction = 'left',
  backgroundColor = '#000',
  textColor = 'inherit',
  maskStyle = 'solid',
  trigger = 'scroll',
  threshold = 0.2,
  onStart = () => {},
  onComplete = () => {},
  className = '',
  style = {},
  ...otherProps
}) => {
  // References to DOM elements
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);
  
  const { disableAllAnimations, disableScrollAnimations } = useAnimationSettings();
  
  // Use GSAP's React hook
  const { contextSafe } = useGSAP(() => {
    if (!containerRef.current || !textRef.current || !maskRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      // Make text visible and hide mask
      gsap.set(textRef.current, { opacity: 1 });
      gsap.set(maskRef.current, { display: 'none' });
      return;
    }
    
    // Only set up automatic animations for load and scroll triggers
    if (trigger !== 'load' && trigger !== 'scroll') return;
    
    // Set initial states
    gsap.set(textRef.current, { opacity: 0 });
    
    // Determine animation properties based on direction and style
    const isHorizontal = direction === 'left' || direction === 'right';
    
    // Create a timeline for the animation sequence
    const tl = gsap.timeline({
      paused: trigger === 'scroll',
      onStart,
      onComplete
    });
    
    // Set up mask animation based on maskStyle
    if (maskStyle === 'split') {
      // Split reveal: translate the mask out instead of scaling
      tl.to(maskRef.current, {
        [isHorizontal ? 'x' : 'y']: isHorizontal ? 
          (direction === 'left' ? '100%' : '-100%') : 
          (direction === 'top' ? '100%' : '-100%'),
        duration: duration * 0.6,
        ease
      });
    } else {
      // Scale reveal: shrink the mask in the appropriate direction
      tl.to(maskRef.current, {
        [isHorizontal ? 'scaleX' : 'scaleY']: 0,
        duration: duration * 0.6,
        ease,
        transformOrigin: 
          direction === 'left' ? 'right center' :
          direction === 'right' ? 'left center' :
          direction === 'top' ? 'center bottom' :
          'center top'
      });
    }
    
    // Fade in text slightly before mask is fully gone
    tl.to(textRef.current, {
      opacity: 1,
      duration: duration * 0.4,
      ease: 'power2.out'
    }, '-=0.25'); // Start a bit before the mask animation completes
    
    // Set up scroll trigger if needed
    if (trigger === 'scroll' && !disableScrollAnimations) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `top bottom-=${threshold * 100}%`,
        onEnter: () => tl.play()
      });
    } else if (trigger === 'load') {
      // Play immediately for load trigger
      tl.play();
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      if (trigger === 'scroll') {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === containerRef.current)
          .forEach(st => st.kill());
      }
    };
  }, { 
    scope: containerRef,
    dependencies: [
      duration, 
      delay, 
      ease, 
      direction, 
      maskStyle,
      trigger, 
      threshold, 
      disableAllAnimations, 
      disableScrollAnimations
    ]
  });
  
  // Play animation function for manual triggers
  const playAnimation = contextSafe(() => {
    if (disableAllAnimations || !containerRef.current || !textRef.current || !maskRef.current) return;
    
    // Reset to initial state
    gsap.set(textRef.current, { opacity: 0 });
    gsap.set(maskRef.current, { 
      display: 'block',
      scaleX: direction === 'left' || direction === 'right' ? 1 : undefined,
      scaleY: direction === 'top' || direction === 'bottom' ? 1 : undefined,
      x: 0,
      y: 0
    });
    
    // Create a new timeline
    const tl = gsap.timeline({
      onStart,
      onComplete: () => {
        onComplete();
        gsap.set(maskRef.current, { display: 'none' });
      }
    });
    
    // Determine animation properties
    const isHorizontal = direction === 'left' || direction === 'right';
    
    // Add mask animation
    if (maskStyle === 'split') {
      tl.to(maskRef.current, {
        [isHorizontal ? 'x' : 'y']: isHorizontal ? 
          (direction === 'left' ? '100%' : '-100%') : 
          (direction === 'top' ? '100%' : '-100%'),
        duration: duration * 0.6,
        ease
      });
    } else {
      tl.to(maskRef.current, {
        [isHorizontal ? 'scaleX' : 'scaleY']: 0,
        duration: duration * 0.6,
        ease,
        transformOrigin: 
          direction === 'left' ? 'right center' :
          direction === 'right' ? 'left center' :
          direction === 'top' ? 'center bottom' :
          'center top'
      });
    }
    
    // Add text reveal
    tl.to(textRef.current, {
      opacity: 1,
      duration: duration * 0.4,
      ease: 'power2.out'
    }, '-=0.25');
    
    // Play the timeline
    tl.play();
  });
  
  // Get mask styles based on direction and maskStyle
  const getMaskStyles = () => {
    // Base styles
    const baseStyles = {
      position: 'absolute',
      background: backgroundColor,
      zIndex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    
    // Direction-specific transform origin
    const transformOrigin = 
      direction === 'left' ? 'right center' :
      direction === 'right' ? 'left center' :
      direction === 'top' ? 'center bottom' : 'center top';
    
    // Mask style variations
    if (maskStyle === 'gradient') {
      const gradientDirection = 
        direction === 'left' ? 'to right' :
        direction === 'right' ? 'to left' :
        direction === 'top' ? 'to bottom' : 'to top';
        
      return {
        ...baseStyles,
        transformOrigin,
        background: `linear-gradient(${gradientDirection}, ${backgroundColor} 0%, ${backgroundColor}CC 70%, ${backgroundColor}00 100%)`
      };
    }
    
    return {
      ...baseStyles,
      transformOrigin
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
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    ...style
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`react-gsap-textreveal ${className}`}
      style={containerStyle}
      {...getEventHandlers()}
      {...otherProps}
    >
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
          ? children({ play: playAnimation }) 
          : children
        }
      </div>
    </div>
  );
};

export default TextReveal;