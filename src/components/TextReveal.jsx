import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({
  children,
  duration = 1,
  delay = 0,
  threshold = 0.2,
  ease = "power3.out",
  staggerChildren = 0.05,
  color = 'black',
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  className = ''
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const mask = maskRef.current;
    
    // Setup initial state
    gsap.set(mask, { width: '0%' });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: "play none none none"
      }
    });

    tl.to(mask, {
      width: '100%',
      duration,
      delay,
      ease
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [duration, delay, threshold, ease]);

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block'
  };

  const textStyle = {
    visibility: 'hidden',
    fontSize,
    fontWeight,
    lineHeight,
    textAlign,
    color
  };

  const maskStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: '100%',
    overflow: 'hidden'
  };

  const revealedTextStyle = {
    ...textStyle,
    visibility: 'visible',
    color
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <div ref={textRef} style={textStyle}>
        {children}
      </div>
      <div ref={maskRef} style={maskStyle}>
        <div style={revealedTextStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TextReveal;