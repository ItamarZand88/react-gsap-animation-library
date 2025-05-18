import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Marquee = ({
  children,
  direction = 'left',
  speed = 50, // pixels per second
  pauseOnHover = true,
  spacing = 20,
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const contentRef = useRef(null);
  const cloneRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const content = contentRef.current;
    const clone = cloneRef.current;
    
    // Determine animation direction
    const isHorizontal = direction === 'left' || direction === 'right';
    const property = isHorizontal ? 'x' : 'y';
    
    // Clone the content
    clone.innerHTML = content.innerHTML;
    
    // Measure content
    const measure = isHorizontal ? content.offsetWidth : content.offsetHeight;
    const totalDistance = measure + spacing;
    
    // Set starting positions
    gsap.set(track, { display: 'flex', flexDirection: isHorizontal ? 'row' : 'column' });
    
    // Set initial position
    if (direction === 'left' || direction === 'up') {
      gsap.set([content, clone], { [property]: 0 });
    } else {
      gsap.set(content, { [property]: -totalDistance });
      gsap.set(clone, { [property]: 0 });
    }
    
    // Calculate duration based on speed
    const duration = totalDistance / speed;
    
    // Create the animation
    const createAnimation = () => {
      // Clear any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      if (direction === 'left') {
        animationRef.current = gsap.to([content, clone], {
          x: -totalDistance,
          ease: 'none',
          repeat: -1,
          duration,
          modifiers: {
            x: (x) => {
              return (parseFloat(x) % totalDistance) + 'px';
            }
          }
        });
      } else if (direction === 'right') {
        animationRef.current = gsap.to([content, clone], {
          x: totalDistance,
          ease: 'none',
          repeat: -1,
          duration,
          modifiers: {
            x: (x) => {
              return (parseFloat(x) % totalDistance) + 'px';
            }
          }
        });
      } else if (direction === 'up') {
        animationRef.current = gsap.to([content, clone], {
          y: -totalDistance,
          ease: 'none',
          repeat: -1,
          duration,
          modifiers: {
            y: (y) => {
              return (parseFloat(y) % totalDistance) + 'px';
            }
          }
        });
      } else if (direction === 'down') {
        animationRef.current = gsap.to([content, clone], {
          y: totalDistance,
          ease: 'none',
          repeat: -1,
          duration,
          modifiers: {
            y: (y) => {
              return (parseFloat(y) % totalDistance) + 'px';
            }
          }
        });
      }
    };
    
    createAnimation();
    
    // Pause on hover if enabled
    if (pauseOnHover) {
      container.addEventListener('mouseenter', () => {
        if (animationRef.current) {
          animationRef.current.pause();
        }
      });
      
      container.addEventListener('mouseleave', () => {
        if (animationRef.current) {
          animationRef.current.play();
        }
      });
    }
    
    // Handle resize
    const handleResize = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      createAnimation();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [direction, speed, pauseOnHover, spacing, children]);

  const containerStyle = {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    ...style
  };

  const trackStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: direction === 'left' || direction === 'right' ? '200%' : '100%',
    height: direction === 'up' || direction === 'down' ? '200%' : '100%',
    display: 'flex',
    flexDirection: direction === 'left' || direction === 'right' ? 'row' : 'column'
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: direction === 'left' || direction === 'right' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <div ref={trackRef} style={trackStyle}>
        <div ref={contentRef} style={contentStyle}>
          {children}
        </div>
        <div ref={cloneRef} style={contentStyle}></div>
      </div>
    </div>
  );
};

export default Marquee;