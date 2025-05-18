import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedList = ({
  children,
  stagger = 0.1,
  duration = 0.5,
  from = { opacity: 0, y: 30 },
  threshold = 0.2,
  delay = 0,
  ease = "power3.out"
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const items = Array.from(list.children);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: list,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: "play none none none"
      }
    });

    tl.from(items, {
      ...from,
      duration,
      stagger,
      delay,
      ease,
      clearProps: "all"
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === list) {
          trigger.kill();
        }
      });
    };
  }, [children, stagger, duration, from, threshold, delay, ease]);

  return (
    <div ref={listRef}>
      {children}
    </div>
  );
};

export default AnimatedList;