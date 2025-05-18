import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FadeIn = ({ 
  children, 
  duration = 0.8, 
  delay = 0, 
  threshold = 0.2,
  ease = "power3.out",
  stagger = 0,
  from = { opacity: 0, y: 30 } 
}) => {
  const elementRef = useRef(null);
  const childrenArray = React.Children.toArray(children);
  const hasMultipleChildren = childrenArray.length > 1;

  useEffect(() => {
    const element = elementRef.current;
    const targets = hasMultipleChildren ? element.children : element;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: "play none none none"
      }
    });

    tl.from(targets, {
      ...from,
      duration,
      delay,
      ease,
      stagger: hasMultipleChildren ? stagger : 0,
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
  }, [children, duration, delay, threshold, ease, stagger, from, hasMultipleChildren]);

  return (
    <div ref={elementRef} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default FadeIn;