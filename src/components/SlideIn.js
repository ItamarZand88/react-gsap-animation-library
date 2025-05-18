import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SlideIn = ({ 
  children, 
  direction = 'left', 
  duration = 0.8, 
  delay = 0,
  threshold = 0.2,
  distance = 100,
  ease = "power3.out" 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    // Set initial position based on direction
    let from = { opacity: 0 };
    
    switch(direction) {
      case 'left':
        from.x = -distance;
        break;
      case 'right':
        from.x = distance;
        break;
      case 'top':
        from.y = -distance;
        break;
      case 'bottom':
        from.y = distance;
        break;
      default:
        from.x = -distance;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: "play none none none"
      }
    });

    tl.from(element, {
      ...from,
      duration,
      delay,
      ease,
      clearProps: "all"
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [children, direction, duration, delay, threshold, distance, ease]);

  return (
    <div ref={elementRef}>
      {children}
    </div>
  );
};

export default SlideIn;