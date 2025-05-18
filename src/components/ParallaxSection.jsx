import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = ({
  children,
  backgroundImage,
  speed = 0.5,
  overlay = true,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  height = '50vh',
  style = {}
}) => {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const background = backgroundRef.current;
    
    // Set initial state
    gsap.set(background, { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1
    });
    
    // Calculate the amount to move - slower speed means less movement
    const yPercent = -speed * 100;
    
    gsap.to(background, {
      yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [backgroundImage, speed]);

  const sectionStyle = {
    position: 'relative',
    height,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const overlayStyle = overlay ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: overlayColor,
    zIndex: -1
  } : {};

  const contentStyle = {
    position: 'relative',
    zIndex: 1
  };

  return (
    <div ref={sectionRef} style={sectionStyle}>
      <div ref={backgroundRef}></div>
      {overlay && <div style={overlayStyle}></div>}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;