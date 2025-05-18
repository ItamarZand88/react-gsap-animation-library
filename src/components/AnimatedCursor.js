import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const AnimatedCursor = ({
  size = 20,
  color = 'rgba(0, 0, 0, 0.5)',
  hoverColor = 'rgba(0, 0, 0, 0.8)',
  hoverScale = 1.5,
  hoverSelectors = ['a', 'button', 'input', '.clickable'],
  mixBlendMode = '',
  speed = 0.1,
  trailLength = 0,
  trailSpacing = 10,
  cursorStyle = {}
}) => {
  const cursorRef = useRef(null);
  const cursorTrailRefs = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Set initial position off-screen
    mousePosition.current = { x: -100, y: -100 };
    cursorPosition.current = { x: -100, y: -100 };
    
    // Create cursor trails if needed
    if (trailLength > 0) {
      for (let i = 0; i < trailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.width = `${size * (1 - i * 0.1)}px`;
        trail.style.height = `${size * (1 - i * 0.1)}px`;
        trail.style.backgroundColor = color;
        trail.style.borderRadius = '50%';
        trail.style.position = 'fixed';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = 9999 - i;
        trail.style.opacity = 1 - i * (0.7 / trailLength);
        trail.style.transform = 'translate(-50%, -50%)';
        trail.style.mixBlendMode = mixBlendMode;
        
        document.body.appendChild(trail);
        cursorTrailRefs.current.push(trail);
      }
    }
    
    // Update mouse position on move
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    // Handle hover states
    const handleElementHover = () => {
      setHovering(true);
    };
    
    const handleElementLeave = () => {
      setHovering(false);
    };
    
    // Add hover listeners to all matching elements
    const addHoverListeners = () => {
      const elements = document.querySelectorAll(hoverSelectors.join(', '));
      elements.forEach(el => {
        el.addEventListener('mouseenter', handleElementHover);
        el.addEventListener('mouseleave', handleElementLeave);
      });
      
      return elements;
    };
    
    const elements = addHoverListeners();
    
    // Animate cursor position
    const animateCursor = () => {
      // Smooth cursor follow with easing
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * speed;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * speed;
      
      // Apply to cursor
      gsap.set(cursor, {
        x: cursorPosition.current.x,
        y: cursorPosition.current.y,
        backgroundColor: hovering ? hoverColor : color,
        width: hovering ? size * hoverScale : size,
        height: hovering ? size * hoverScale : size
      });
      
      // Apply to trails with delay
      if (trailLength > 0) {
        // Store positions history for trail
        const trailPositions = [{ ...cursorPosition.current }];
        
        cursorTrailRefs.current.forEach((trail, index) => {
          const delay = (index + 1) * trailSpacing;
          
          // Wait until we have enough position history
          if (trailPositions.length > delay) {
            const pos = trailPositions[trailPositions.length - delay - 1];
            
            gsap.set(trail, {
              x: pos.x,
              y: pos.y,
              backgroundColor: hovering ? hoverColor : color,
              width: hovering ? size * (1 - index * 0.1) * hoverScale : size * (1 - index * 0.1),
              height: hovering ? size * (1 - index * 0.1) * hoverScale : size * (1 - index * 0.1)
            });
          }
        });
      }
      
      animationRef.current = requestAnimationFrame(animateCursor);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animateCursor);
    
    // Re-add listeners when elements change
    const mutationObserver = new MutationObserver(() => {
      // Clean up old listeners
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
      
      // Add new listeners
      addHoverListeners();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      mutationObserver.disconnect();
      
      // Clean up hover listeners
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
      
      // Remove cursor trails
      cursorTrailRefs.current.forEach(trail => {
        if (trail && document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      });
    };
  }, [size, color, hoverColor, hoverScale, hoverSelectors.join(','), mixBlendMode, speed, trailLength, trailSpacing]);

  const defaultCursorStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.2s, height 0.2s, background-color 0.2s',
    mixBlendMode,
    ...cursorStyle
  };

  return (
    <>
      <style>
        {`
          /* Hide default cursor */
          body {
            cursor: none;
          }
          
          /* Make sure the cursor works over images */
          img, svg, video {
            pointer-events: none;
          }
        `}
      </style>
      <div ref={cursorRef} style={defaultCursorStyle} />
    </>
  );
};

export default AnimatedCursor;