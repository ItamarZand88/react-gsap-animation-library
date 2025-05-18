import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({
  start = 0,
  end,
  duration = 2,
  delay = 0,
  threshold = 0.5,
  ease = "power1.inOut",
  prefix = '',
  suffix = '',
  separator = ',',
  decimals = 0,
  className = '',
  style = {}
}) => {
  const counterRef = useRef(null);
  const [count, setCount] = useState(start);
  const [triggered, setTriggered] = useState(false);
  
  // Format number with separator and decimals
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value).replace(/,/g, separator);
  };

  useEffect(() => {
    const counter = counterRef.current;
    
    const updateCount = (value) => {
      setCount(value);
    };
    
    const trigger = ScrollTrigger.create({
      trigger: counter,
      start: `top bottom-=${threshold * 100}%`,
      onEnter: () => {
        if (!triggered) {
          setTriggered(true);
          
          gsap.to({ value: start }, {
            value: end,
            duration,
            delay,
            ease,
            onUpdate: function() {
              updateCount(this.targets()[0].value);
            }
          });
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [start, end, duration, delay, threshold, ease, triggered]);

  return (
    <div 
      ref={counterRef}
      className={className}
      style={style}
    >
      {prefix}{formatNumber(count)}{suffix}
    </div>
  );
};

export default AnimatedCounter;