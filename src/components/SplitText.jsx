import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  children,
  type = 'chars', // 'chars', 'words', or 'lines'
  animation = 'fadeIn', // 'fadeIn', 'stagger', 'wave', 'random'
  duration = 0.5,
  stagger = 0.03,
  delay = 0,
  threshold = 0.2,
  ease = "power3.out",
  color,
  wrapperClassName = '',
  elementClassName = ''
}) => {
  const containerRef = useRef(null);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (!children || typeof children !== 'string') return;
    
    let splitElements = [];
    
    if (type === 'chars') {
      splitElements = children.split('');
    } else if (type === 'words') {
      splitElements = children.split(' ');
    } else if (type === 'lines') {
      splitElements = children.split('\\n');
    }
    
    setElements(splitElements);
  }, [children, type]);

  useEffect(() => {
    if (elements.length === 0) return;
    
    const container = containerRef.current;
    const childElements = container.children;
    
    let from = {};
    
    switch(animation) {
      case 'fadeIn':
        from = { opacity: 0, y: 20 };
        break;
      case 'stagger':
        from = { opacity: 0, y: 30 };
        break;
      case 'wave':
        from = { opacity: 0, y: 20, rotation: 10 };
        break;
      case 'random':
        from = { opacity: 0, scale: 0, rotation: () => Math.random() * 60 - 30 };
        break;
      default:
        from = { opacity: 0 };
    }
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: "play none none none"
      }
    });
    
    if (animation === 'wave') {
      // Wave animation requires special staggering
      tl.from(childElements, {
        ...from,
        duration,
        delay,
        ease,
        stagger: {
          amount: elements.length * 0.08,
          from: "start",
          ease: "sine.inOut"
        },
        clearProps: "all"
      });
    } else {
      tl.from(childElements, {
        ...from,
        duration,
        stagger,
        delay,
        ease,
        clearProps: "all"
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [elements, animation, duration, stagger, delay, threshold, ease]);

  const getWrapper = () => {
    switch(type) {
      case 'chars':
        return 'span';
      case 'words':
        return 'span';
      case 'lines':
        return 'div';
      default:
        return 'span';
    }
  };

  const getElementStyle = () => {
    let style = { display: 'inline-block' };
    
    if (color) {
      style.color = color;
    }
    
    if (type === 'words') {
      style.marginRight = '0.25em';
    }
    
    return style;
  };

  const Wrapper = getWrapper();
  const elementStyle = getElementStyle();

  return (
    <div ref={containerRef} className={wrapperClassName}>
      {elements.map((element, index) => (
        <Wrapper 
          key={index} 
          className={elementClassName}
          style={elementStyle}
        >
          {element}
          {type === 'words' && index < elements.length - 1 ? ' ' : ''}
        </Wrapper>
      ))}
    </div>
  );
};

export default SplitText;