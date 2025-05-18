import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAnimationSettings } from '../../context/AnimationContext';

/**
 * TypingText component for creating typing text animations
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} props.text - Text to type or array of texts to type in sequence
 * @param {number} props.typingSpeed - Typing speed in characters per second
 * @param {number} props.deleteSpeed - Delete speed in characters per second
 * @param {number} props.delayBetweenTexts - Delay between texts in seconds (when text is an array)
 * @param {number} props.startDelay - Delay before typing starts in seconds
 * @param {boolean} props.cursorBlink - Whether to blink the cursor
 * @param {string} props.cursorChar - Character to use as cursor
 * @param {string} props.cursorColor - Color of the cursor
 * @param {string} props.trigger - Animation trigger type ('load', 'scroll', 'none')
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {number} props.loop - Number of times to loop the animation (Infinity for infinite)
 * @param {function} props.onComplete - Callback when animation completes
 * @param {string} props.className - Additional CSS class names
 * @param {Object} props.style - Custom styles
 */
const TypingText = ({
  text = '',
  typingSpeed = 10,
  deleteSpeed = 5,
  delayBetweenTexts = 1.5,
  startDelay = 0.5,
  cursorBlink = true,
  cursorChar = '|',
  cursorColor = 'inherit',
  trigger = 'load',
  threshold = 0.2,
  loop = 0,
  onComplete = () => {},
  className = '',
  style = {},
  ...otherProps
}) => {
  // Get reference to the DOM element
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  
  const { disableAllAnimations, disableScrollAnimations } = useAnimationSettings();
  
  // Convert text to array if it's a string
  const textArray = Array.isArray(text) ? text : [text];
  
  // UseGSAP hook
  useGSAP(() => {
    if (!containerRef.current || !textRef.current || !cursorRef.current) return;
    
    // Skip if animations disabled
    if (disableAllAnimations || (trigger === 'scroll' && disableScrollAnimations)) {
      // Just show the full text
      textRef.current.textContent = textArray[textArray.length - 1] || '';
      cursorRef.current.style.opacity = 0;
      return;
    }
    
    // Only set up automatic animations for load and scroll triggers
    if (trigger !== 'load' && trigger !== 'scroll') return;
    
    const typeText = (index = 0, charIndex = 0, isDeleting = false) => {
      const currentText = textArray[index % textArray.length] || '';
      
      if (!isDeleting && charIndex <= currentText.length) {
        // Typing
        textRef.current.textContent = currentText.substring(0, charIndex);
        charIndex++;
        
        gsap.delayedCall(1 / typingSpeed, () => {
          typeText(index, charIndex, isDeleting);
        });
      } else if (isDeleting && charIndex >= 0) {
        // Deleting
        textRef.current.textContent = currentText.substring(0, charIndex);
        charIndex--;
        
        gsap.delayedCall(1 / deleteSpeed, () => {
          typeText(index, charIndex, isDeleting);
        });
      } else if (!isDeleting && charIndex > currentText.length) {
        // Finished typing, wait before deleting
        if (textArray.length > 1 || loop !== 0) {
          gsap.delayedCall(delayBetweenTexts, () => {
            typeText(index, charIndex, true);
          });
        } else {
          // Only one text and no loop, we're done
          if (typeof onComplete === 'function') onComplete();
        }
      } else if (isDeleting && charIndex < 0) {
        // Finished deleting, move to next text
        const nextIndex = index + 1;
        
        if (nextIndex < textArray.length || (loop === Infinity || nextIndex < textArray.length * (loop + 1))) {
          gsap.delayedCall(startDelay, () => {
            typeText(nextIndex, 0, false);
          });
        } else {
          // Finished all texts and loops
          if (typeof onComplete === 'function') onComplete();
        }
      }
    };
    
    // Set up cursor blinking
    if (cursorBlink) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true
      });
    }
    
    // Start typing after delay
    gsap.delayedCall(startDelay, () => {
      typeText(0, 0, false);
    });
    
    // Set up scroll trigger if needed
    if (trigger === 'scroll') {
      const timeline = gsap.timeline({ paused: true });
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: `top bottom-=${threshold * 100}%`,
        onEnter: () => timeline.play()
      });
    }
    
    return () => {
      // Clear all delayed calls and animations
      gsap.killTweensOf(textRef.current);
      gsap.killTweensOf(cursorRef.current);
      
      // Clear any ScrollTrigger instances
      if (trigger === 'scroll') {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === containerRef.current)
          .forEach(st => st.kill());
      }
    };
  }, { 
    scope: containerRef,
    dependencies: [
      JSON.stringify(textArray),
      typingSpeed,
      deleteSpeed,
      delayBetweenTexts,
      startDelay,
      cursorBlink,
      trigger,
      threshold,
      loop,
      disableAllAnimations,
      disableScrollAnimations
    ]
  });
  
  // Cursor styles
  const cursorStyle = {
    color: cursorColor,
    display: 'inline-block',
    marginLeft: '0.1em',
    fontWeight: 'normal'
  };
  
  return (
    <div 
      ref={containerRef}
      className={`react-gsap-typing-text ${className}`}
      style={style}
      {...otherProps}
    >
      <span ref={textRef}></span>
      <span ref={cursorRef} style={cursorStyle}>{cursorChar}</span>
    </div>
  );
};

export default TypingText;