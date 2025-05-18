import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAnimationSettings } from '../../context/AnimationContext';

/**
 * AnimatedButton component with various interaction effects using GSAP
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.effect - Animation effect ('ripple', 'shine', 'pulse', 'scale', 'fill')
 * @param {string} props.effectColor - Color of the animation effect
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.ease - GSAP easing function
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.asChild - Whether to apply props to children instead of creating a button
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const AnimatedButton = ({
  children,
  effect = 'ripple',
  effectColor = 'rgba(255, 255, 255, 0.4)',
  duration = 0.6,
  ease = "power2.out",
  onClick = () => {},
  className = '',
  style = {},
  asChild = false,
  ...otherProps
}) => {
  const buttonRef = useRef(null);
  const effectRef = useRef(null);
  const { disableAllAnimations } = useAnimationSettings();
  
  // Initialize GSAP context and get contextSafe function
  const { contextSafe } = useGSAP(() => {
    if (disableAllAnimations) return;
    
    // Create effect element for certain effects
    if (['ripple', 'shine'].includes(effect) && buttonRef.current && !effectRef.current) {
      const effectElement = document.createElement('span');
      effectElement.className = `animated-button-effect ${effect}-effect`;
      
      if (effect === 'ripple') {
        Object.assign(effectElement.style, {
          position: 'absolute',
          borderRadius: '50%',
          backgroundColor: effectColor,
          transform: 'scale(0)',
          pointerEvents: 'none',
          zIndex: '1'
        });
      } else if (effect === 'shine') {
        Object.assign(effectElement.style, {
          position: 'absolute',
          top: '0',
          left: '-100%',
          width: '60%',
          height: '100%',
          background: `linear-gradient(to right, transparent 0%, ${effectColor} 50%, transparent 100%)`,
          transform: 'skewX(-25deg)',
          pointerEvents: 'none',
          zIndex: '1'
        });
      }
      
      buttonRef.current.style.position = 'relative';
      buttonRef.current.style.overflow = 'hidden';
      buttonRef.current.appendChild(effectElement);
      effectRef.current = effectElement;
    }
    
    return () => {
      // Clean up effect element
      if (effectRef.current && buttonRef.current) {
        try {
          buttonRef.current.removeChild(effectRef.current);
          effectRef.current = null;
        } catch (e) {
          // Element might have been removed already
        }
      }
    };
  }, { 
    scope: buttonRef,
    dependencies: [effect, effectColor, disableAllAnimations] 
  });
  
  // Ripple effect animation
  const createRippleEffect = contextSafe((e) => {
    if (disableAllAnimations || !buttonRef.current || !effectRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e ? (e.clientX - rect.left) : rect.width / 2;
    const y = e ? (e.clientY - rect.top) : rect.height / 2;
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Position the ripple element
    gsap.set(effectRef.current, {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      opacity: 0.5,
      scale: 0
    });
    
    // Animate the ripple
    gsap.to(effectRef.current, {
      scale: 1,
      opacity: 0,
      duration,
      ease
    });
  });
  
  // Shine effect animation
  const createShineEffect = contextSafe(() => {
    if (disableAllAnimations || !effectRef.current) return;
    
    gsap.fromTo(effectRef.current, 
      { left: '-100%' },
      { 
        left: '100%', 
        duration, 
        ease,
        onComplete: () => {
          gsap.set(effectRef.current, { left: '-100%' });
        }
      }
    );
  });
  
  // Pulse effect animation
  const createPulseEffect = contextSafe(() => {
    if (disableAllAnimations || !buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: duration / 2,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: duration / 2,
          ease: 'power1.in'
        });
      }
    });
  });
  
  // Scale effect animation
  const createScaleEffect = contextSafe(() => {
    if (disableAllAnimations || !buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: duration / 3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: duration / 2,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  });
  
  // Fill effect animation
  const createFillEffect = contextSafe(() => {
    if (disableAllAnimations || !buttonRef.current) return;
    
    const originalBg = window.getComputedStyle(buttonRef.current).backgroundColor;
    
    gsap.to(buttonRef.current, {
      backgroundColor: effectColor,
      duration,
      ease,
      onComplete: () => {
        gsap.to(buttonRef.current, {
          backgroundColor: originalBg,
          duration,
          ease
        });
      }
    });
  });
  
  // Combined click handler
  const handleClick = contextSafe((e) => {
    if (disableAllAnimations) {
      onClick(e);
      return;
    }
    
    // Apply effect based on type
    switch (effect) {
      case 'ripple':
        createRippleEffect(e);
        break;
      case 'shine':
        createShineEffect();
        break;
      case 'pulse':
        createPulseEffect();
        break;
      case 'scale':
        createScaleEffect();
        break;
      case 'fill':
        createFillEffect();
        break;
      default:
        // No effect
    }
    
    // Call the provided onClick handler
    onClick(e);
  });
  
  // Combined props for rendering
  const componentProps = {
    ref: buttonRef,
    className: `react-gsap-button ${effect}-button ${className}`,
    onClick: handleClick,
    style: {
      position: 'relative',
      overflow: 'hidden',
      ...style
    },
    ...otherProps
  };
  
  // Render either as a button or wrap children
  if (asChild && React.Children.count(children) === 1) {
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