// Reusable animation presets
import { gsap } from 'gsap';
import * as easings from './easings';

// Entry animations
export const fadeIn = (element, options = {}) => {
  const { duration = 0.8, delay = 0, ease = "power3.out", from = { opacity: 0, y: 20 } } = options;
  
  return gsap.from(element, {
    ...from,
    duration,
    delay,
    ease,
    clearProps: "all"
  });
};

export const bounceIn = (element, options = {}) => {
  const { duration = 1, delay = 0, scale = 0.3 } = options;
  
  return gsap.from(element, {
    opacity: 0,
    scale,
    duration,
    delay,
    ease: easings.bounceOut,
    clearProps: "all"
  });
};

export const slideIn = (element, options = {}) => {
  const { duration = 0.8, delay = 0, direction = 'left', distance = 100, ease = "power3.out" } = options;
  
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
  
  return gsap.from(element, {
    ...from,
    duration,
    delay,
    ease,
    clearProps: "all"
  });
};

export const rotateIn = (element, options = {}) => {
  const { duration = 1, delay = 0, rotation = 360, ease = "power2.out" } = options;
  
  return gsap.from(element, {
    opacity: 0,
    rotation,
    scale: 0.5,
    duration,
    delay,
    ease,
    clearProps: "all"
  });
};

// Attention animations
export const pulse = (element, options = {}) => {
  const { duration = 0.5, scale = 1.05 } = options;
  
  return gsap.to(element, {
    scale,
    duration: duration / 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 1
  });
};

export const shake = (element, options = {}) => {
  const { duration = 0.6, distance = 10 } = options;
  
  return gsap.to(element, {
    x: distance,
    duration: duration / 4,
    ease: "power1.inOut",
    yoyo: true,
    repeat: 3
  });
};

// Exit animations
export const fadeOut = (element, options = {}) => {
  const { duration = 0.8, delay = 0, ease = "power3.in", to = { opacity: 0, y: -20 } } = options;
  
  return gsap.to(element, {
    ...to,
    duration,
    delay,
    ease
  });
};

// Hover effects
export const hoverScale = (element, options = {}) => {
  const { scale = 1.05, duration = 0.3 } = options;
  
  const mouseEnterHandler = () => {
    gsap.to(element, {
      scale,
      duration,
      ease: "power2.out"
    });
  };
  
  const mouseLeaveHandler = () => {
    gsap.to(element, {
      scale: 1,
      duration,
      ease: "power2.inOut"
    });
  };
  
  element.addEventListener('mouseenter', mouseEnterHandler);
  element.addEventListener('mouseleave', mouseLeaveHandler);
  
  return {
    cleanup: () => {
      element.removeEventListener('mouseenter', mouseEnterHandler);
      element.removeEventListener('mouseleave', mouseLeaveHandler);
    }
  };
};

export const hoverTilt = (element, options = {}) => {
  const { tiltAmount = 10, duration = 0.3 } = options;
  
  const mouseMoveHandler = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * tiltAmount;
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * tiltAmount;
    
    gsap.to(element, {
      rotateY,
      rotateX,
      transformPerspective: 1000,
      duration: 0.1,
      ease: "power2.out"
    });
  };
  
  const mouseLeaveHandler = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration,
      ease: "power2.inOut"
    });
  };
  
  element.addEventListener('mousemove', mouseMoveHandler);
  element.addEventListener('mouseleave', mouseLeaveHandler);
  
  return {
    cleanup: () => {
      element.removeEventListener('mousemove', mouseMoveHandler);
      element.removeEventListener('mouseleave', mouseLeaveHandler);
    }
  };
};