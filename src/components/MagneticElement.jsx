import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MagneticElement = ({
  children,
  strength = 0.5,
  damping = 0.1,
  radius = 100,
  className = '',
  style = {}
}) => {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  const centerX = useRef(0);
  const centerY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Get element dimensions and position
    const updateCenter = () => {
      const rect = element.getBoundingClientRect();
      centerX.current = rect.left + rect.width / 2;
      centerY.current = rect.top + rect.height / 2;
    };
    
    updateCenter();
    
    // Update center on resize
    window.addEventListener('resize', updateCenter);
    window.addEventListener('scroll', updateCenter);
    
    // Magnetic effect - track mouse position
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate distance from mouse to element center
      const distX = clientX - centerX.current;
      const distY = clientY - centerY.current;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Only apply effect if mouse is within radius
      if (distance < radius) {
        // Calculate strength based on distance
        const power = (radius - distance) / radius;
        
        // Set target position
        targetX.current = distX * power * strength;
        targetY.current = distY * power * strength;
        
        // Start animation if not already running
        if (!animationRef.current) {
          animatePosition();
        }
      } else {
        // Set target back to 0
        targetX.current = 0;
        targetY.current = 0;
      }
    };
    
    // Animation loop for smooth movement
    const animatePosition = () => {
      // Apply damping for smoother motion
      const currentX = parseFloat(gsap.getProperty(element, "x") || 0);
      const currentY = parseFloat(gsap.getProperty(element, "y") || 0);
      
      const dx = targetX.current - currentX;
      const dy = targetY.current - currentY;
      
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        gsap.set(element, { x: targetX.current, y: targetY.current });
        animationRef.current = null;
        return;
      }
      
      gsap.set(element, {
        x: currentX + dx * damping,
        y: currentY + dy * damping
      });
      
      animationRef.current = requestAnimationFrame(animatePosition);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('scroll', updateCenter);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [strength, damping, radius]);

  const defaultStyle = {
    display: 'inline-block',
    ...style
  };

  return (
    <div ref={elementRef} className={className} style={defaultStyle}>
      {children}
    </div>
  );
};

export default MagneticElement;