import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const AnimatedCard = ({
  children,
  className = '',
  style = {},
  hoverEffect = 'lift', // 'lift', '3d', 'glow', or 'none'
  duration = 0.3,
  hoverScale = 1.03,
  tiltAmount = 10 // For 3D effect
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    
    // Cleanup function
    return () => {
      gsap.killTweensOf(card);
    };
  }, []);

  const handleMouseEnter = (e) => {
    const card = cardRef.current;
    
    switch(hoverEffect) {
      case 'lift':
        gsap.to(card, {
          scale: hoverScale,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
          duration,
          ease: "power2.out"
        });
        break;
      
      case '3d':
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate rotation based on mouse position relative to card center
        const rotateY = ((mouseX - cardCenterX) / (cardRect.width / 2)) * tiltAmount;
        const rotateX = -((mouseY - cardCenterY) / (cardRect.height / 2)) * tiltAmount;
        
        gsap.to(card, {
          rotateY: rotateY,
          rotateX: rotateX,
          transformPerspective: 1000,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
          scale: 1.05,
          duration,
          ease: "power2.out"
        });
        break;
      
      case 'glow':
        gsap.to(card, {
          boxShadow: '0 0 20px rgba(114, 226, 252, 0.5)',
          duration,
          ease: "power2.out"
        });
        break;
        
      default:
        break;
    }
  };

  const handleMouseMove = (e) => {
    if (hoverEffect === '3d') {
      const card = cardRef.current;
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate rotation based on mouse position relative to card center
      const rotateY = ((mouseX - cardCenterX) / (cardRect.width / 2)) * tiltAmount;
      const rotateX = -((mouseY - cardCenterY) / (cardRect.height / 2)) * tiltAmount;
      
      gsap.to(card, {
        rotateY: rotateY,
        rotateX: rotateX,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      duration,
      ease: "power2.inOut"
    });
  };

  const defaultStyle = {
    borderRadius: '8px',
    transition: `box-shadow ${duration}s ease`,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    ...style
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={defaultStyle}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;