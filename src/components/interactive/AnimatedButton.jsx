import React, { useRef, useState, useEffect } from 'react';
import useSafeAnimation from '../../utils/useSafeAnimation';
import { useAnimationSettings } from '../../context/AnimationContext';
import { injectCSSKeyframes } from '../../utils/fallbacks';

/**
 * AnimatedButton component for creating animated button effects
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.effect - Button animation effect ('ripple', 'shine', 'pulse', 'scale', 'fill')
 * @param {string} props.effectColor - Color of the button effect
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.ease - Easing function
 * @param {string} props.trigger - Animation trigger type ('hover', 'click', 'none')
 * @param {function} props.onClick - Callback when button is clicked
 * @param {function} props.onMouseEnter - Callback when mouse enters button
 * @param {function} props.onMouseLeave - Callback when mouse leaves button
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 * @param {boolean} props.asChild - Whether to render a button or use children as the button
 */
const AnimatedButton = ({
  children,
  effect = 'ripple',
  effectColor = 'rgba(255, 255, 255, 0.4)',
  duration = 0.6,
  delay = 0,
  ease = "power2.out",
  trigger = 'hover',
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  className = '',
  style = {},
  asChild = false,
  ...otherProps
}) => {
  // References to DOM elements
  const buttonRef = useRef(null);
  const effectRef = useRef(null);
  
  // Animation state
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    mousePosition: { x: 0, y: 0 }
  });
  
  // Get global animation settings
  const {
    disableAllAnimations
  } = useAnimationSettings();
  
  // Use safe animation hook
  const { animate, isGsapAvailable } = useSafeAnimation(buttonRef);
  
  // Inject CSS keyframes for fallback
  useEffect(() => {
    injectCSSKeyframes();
  }, []);
  
  // Initialize effect element for certain animations
  useEffect(() => {
    if (['ripple', 'shine'].includes(effect) && buttonRef.current && !effectRef.current) {
      const effectElement = document.createElement('span');
      effectElement.className = `animated-button-effect ${effect}-effect`;
      effectElement.style.position = 'absolute';
      
      if (effect === 'ripple') {
        effectElement.style.borderRadius = '50%';
        effectElement.style.backgroundColor = effectColor;
        effectElement.style.transform = 'scale(0)';
        effectElement.style.pointerEvents = 'none';
        effectElement.style.zIndex = '1';
      } else if (effect === 'shine') {
        effectElement.style.position = 'absolute';
        effectElement.style.top = '0';
        effectElement.style.left = '-100%';
        effectElement.style.width = '60%';
        effectElement.style.height = '100%';
        effectElement.style.background = `linear-gradient(to right, transparent 0%, ${effectColor} 50%, transparent 100%)`;
        effectElement.style.transform = 'skewX(-25deg)';
        effectElement.style.pointerEvents = 'none';
        effectElement.style.zIndex = '1';
      }
      
      buttonRef.current.style.position = 'relative';
      buttonRef.current.style.overflow = 'hidden';
      buttonRef.current.appendChild(effectElement);
      effectRef.current = effectElement;
    }
    
    return () => {
      // Clean up effect element on unmount
      if (effectRef.current && buttonRef.current) {
        try {
          buttonRef.current.removeChild(effectRef.current);
        } catch (e) {
          // Element might have already been removed
        }
      }
    };
  }, [effect, effectColor]);
  
  // Handle mouse position tracking for ripple effect
  const handleMousePosition = (e) => {
    if (!buttonRef.current || !['ripple'].includes(effect)) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAnimationState(prev => ({
      ...prev,
      mousePosition: { x, y }
    }));
  };
  
  // Play animations
  const playAnimation = (e) => {
    if (disableAllAnimations || animationState.isAnimating) return;
    
    setAnimationState(prev => ({ ...prev, isAnimating: true }));
    
    // Different animations based on effect type
    switch (effect) {
      case 'ripple':
        playRippleEffect(e);
        break;
      case 'shine':
        playShineEffect();
        break;
      case 'pulse':
        playPulseEffect();
        break;
      case 'scale':
        playScaleEffect();
        break;
      case 'fill':
        playFillEffect();
        break;
      default:
        // Do nothing for unknown effects
        setAnimationState(prev => ({ ...prev, isAnimating: false }));
    }
  };
  
  // Ripple effect animation
  const playRippleEffect = (e) => {
    if (!effectRef.current || !buttonRef.current) return;
    
    // Get click/mouse position
    let x, y;
    if (e) {
      const rect = buttonRef.current.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      // Default to center for non-event triggers
      const rect = buttonRef.current.getBoundingClientRect();
      x = rect.width / 2;
      y = rect.height / 2;
    }
    
    // Calculate ripple size (should be larger than the button)
    const size = Math.max(buttonRef.current.offsetWidth, buttonRef.current.offsetHeight) * 2;
    
    // Position the ripple element
    effectRef.current.style.left = `${x - size / 2}px`;
    effectRef.current.style.top = `${y - size / 2}px`;
    effectRef.current.style.width = `${size}px`;
    effectRef.current.style.height = `${size}px`;
    
    // Animate the ripple
    animate({
      to: {
        opacity: [0, 0.2, 0],
        scale: [0, 1],
        duration,
        ease,
        onComplete: () => {
          setAnimationState(prev => ({ ...prev, isAnimating: false }));
        }
      }
    }, effectRef.current);
  };
  
  // Shine effect animation
  const playShineEffect = () => {
    if (!effectRef.current) return;
    
    animate({
      to: {
        left: '100%',
        duration,
        ease,
        onComplete: () => {
          // Reset position
          if (effectRef.current) {
            effectRef.current.style.left = '-100%';
          }
          setAnimationState(prev => ({ ...prev, isAnimating: false }));
        }
      }
    }, effectRef.current);
  };
  
  // Pulse effect animation
  const playPulseEffect = () => {
    animate({
      to: {
        scale: 1.05,
        duration: duration / 2,
        ease: 'power1.out',
        onComplete: () => {
          // Return to normal size
          animate({
            to: {
              scale: 1,
              duration: duration / 2,
              ease: 'power1.in',
              onComplete: () => {
                setAnimationState(prev => ({ ...prev, isAnimating: false }));
              }
            }
          }, buttonRef.current);
        }
      }
    }, buttonRef.current);
  };
  
  // Scale effect animation
  const playScaleEffect = () => {
    animate({
      to: {
        scale: 0.95,
        duration: duration / 2,
        ease: 'power2.out',
        onComplete: () => {
          // Return to normal size
          animate({
            to: {
              scale: 1,
              duration: duration / 2,
              ease: 'elastic.out(1, 0.3)',
              onComplete: () => {
                setAnimationState(prev => ({ ...prev, isAnimating: false }));
              }
            }
          }, buttonRef.current);
        }
      }
    }, buttonRef.current);
  };
  
  // Fill effect animation (using background-color)
  const playFillEffect = () => {
    const originalBg = getComputedStyle(buttonRef.current).backgroundColor;
    
    animate({
      to: {
        backgroundColor: effectColor,
        duration,
        ease,
        onComplete: () => {
          // Only reset if we're not still hovering
          if (trigger !== 'hover') {
            animate({
              to: {
                backgroundColor: originalBg,
                duration,
                ease,
                onComplete: () => {
                  setAnimationState(prev => ({ ...prev, isAnimating: false }));
                }
              }
            }, buttonRef.current);
          } else {
            setAnimationState(prev => ({ ...prev, isAnimating: false }));
          }
        }
      }
    }, buttonRef.current);
  };
  
  // Reset animation (especially useful for hover effects)
  const resetAnimation = () => {
    if (disableAllAnimations) return;
    
    // For hoverable effects, we need to reset when mouse leaves
    if (trigger === 'hover') {
      switch (effect) {
        case 'fill':
          // Reset fill color
          const originalBg = window.getComputedStyle(buttonRef.current).getPropertyValue('background-color');
          animate({
            to: {
              backgroundColor: originalBg,
              duration,
              ease,
              onComplete: () => {
                setAnimationState(prev => ({ ...prev, isAnimating: false }));
              }
            }
          }, buttonRef.current);
          break;
          
        default:
          // Most effects auto-reset already
          setAnimationState(prev => ({ ...prev, isAnimating: false }));
      }
    }
  };
  
  // Handle click event
  const handleClick = (e) => {
    if (trigger === 'click') {
      playAnimation(e);
    }
    onClick(e);
  };
  
  // Handle mouse enter event
  const handleMouseEnter = (e) => {
    handleMousePosition(e);
    if (trigger === 'hover') {
      playAnimation(e);
    }
    onMouseEnter(e);
  };
  
  // Handle mouse leave event
  const handleMouseLeave = (e) => {
    if (trigger === 'hover') {
      resetAnimation();
    }
    onMouseLeave(e);
  };
  
  // Handle mouse move event (for updating ripple position)
  const handleMouseMove = (e) => {
    handleMousePosition(e);
  };
  
  // Combined props for rendering
  const combinedStyle = {
    ...style,
    position: 'relative',
    overflow: 'hidden'
  };
  
  const componentProps = {
    ref: buttonRef,
    className: `react-gsap-animated-button ${effect}-effect ${className}`,
    style: combinedStyle,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: effect === 'ripple' ? handleMouseMove : undefined,
    'data-effect': effect,
    'data-animation-state': animationState.isAnimating ? 'running' : 'idle',
    ...otherProps
  };
  
  // Render either as a button or wrap the children
  if (asChild) {
    return React.cloneElement(
      React.Children.only(children), 
      componentProps
    );
  }
  
  return (
    <button {...componentProps}>
      {children}
    </button>
  );
};

export default AnimatedButton;