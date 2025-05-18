/**
 * Animation utility functions
 * These functions provide a simpler way to create GSAP animations
 * New implementation using GSAP's recommended patterns
 */

import gsap from 'gsap';

/**
 * Create a fade in animation
 * 
 * @param {HTMLElement|string} element - DOM element or selector
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Animation delay in seconds
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.direction - Fade direction ('up', 'down', 'left', 'right', 'none')
 * @param {number} options.distance - Distance to animate from in pixels (for directional fades)
 * @param {Function} options.onComplete - Callback function when animation completes
 * @returns {gsap.core.Tween} The GSAP animation object
 */
export const fadeIn = (element, options = {}) => {
  const { 
    duration = 0.8, 
    delay = 0, 
    ease = 'power3.out',
    direction = 'up',
    distance = 30,
    onComplete
  } = options;
  
  // Set up from properties based on direction
  const from = { opacity: 0 };
  
  if (direction === 'up') from.y = distance;
  else if (direction === 'down') from.y = -distance;
  else if (direction === 'left') from.x = -distance;
  else if (direction === 'right') from.x = distance;
  
  // Create and return the animation
  return gsap.from(element, {
    ...from,
    duration,
    delay,
    ease,
    onComplete,
    clearProps: 'all'
  });
};

/**
 * Create a fade out animation
 * 
 * @param {HTMLElement|string} element - DOM element or selector
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Animation delay in seconds
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.direction - Fade direction ('up', 'down', 'left', 'right', 'none')
 * @param {number} options.distance - Distance to animate to in pixels (for directional fades)
 * @param {Function} options.onComplete - Callback function when animation completes
 * @returns {gsap.core.Tween} The GSAP animation object
 */
export const fadeOut = (element, options = {}) => {
  const { 
    duration = 0.8, 
    delay = 0, 
    ease = 'power3.out',
    direction = 'down',
    distance = 30,
    onComplete
  } = options;
  
  // Set up to properties based on direction
  const to = { opacity: 0 };
  
  if (direction === 'up') to.y = -distance;
  else if (direction === 'down') to.y = distance;
  else if (direction === 'left') to.x = -distance;
  else if (direction === 'right') to.x = distance;
  
  // Create and return the animation
  return gsap.to(element, {
    ...to,
    duration,
    delay,
    ease,
    onComplete
  });
};

/**
 * Create a slide animation
 * 
 * @param {HTMLElement|string} element - DOM element or selector
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Animation delay in seconds
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.direction - Slide direction ('up', 'down', 'left', 'right')
 * @param {number} options.distance - Distance to animate from in pixels
 * @param {boolean} options.fade - Whether to fade in while sliding
 * @param {Function} options.onComplete - Callback function when animation completes
 * @returns {gsap.core.Tween} The GSAP animation object
 */
export const slideIn = (element, options = {}) => {
  const { 
    duration = 0.8, 
    delay = 0, 
    ease = 'power3.out',
    direction = 'up',
    distance = 100,
    fade = true,
    onComplete
  } = options;
  
  // Set up from properties based on direction
  const from = fade ? { opacity: 0 } : {};
  
  if (direction === 'up') from.y = distance;
  else if (direction === 'down') from.y = -distance;
  else if (direction === 'left') from.x = -distance;
  else if (direction === 'right') from.x = distance;
  
  // Create and return the animation
  return gsap.from(element, {
    ...from,
    duration,
    delay,
    ease,
    onComplete,
    clearProps: 'all'
  });
};

/**
 * Create a text reveal animation
 * 
 * @param {Object} elements - Object containing DOM elements
 * @param {HTMLElement} elements.container - Container element
 * @param {HTMLElement} elements.text - Text element to reveal
 * @param {HTMLElement} elements.mask - Mask element
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.delay - Animation delay in seconds
 * @param {string} options.ease - GSAP easing function
 * @param {string} options.direction - Reveal direction ('left', 'right', 'top', 'bottom')
 * @param {string} options.maskStyle - Mask style ('solid', 'gradient', 'split')
 * @param {Function} options.onComplete - Callback function when animation completes
 * @returns {gsap.core.Timeline} The GSAP timeline
 */
export const textReveal = (elements, options = {}) => {
  const { 
    duration = 1.2, 
    delay = 0, 
    ease = 'power4.inOut',
    direction = 'left',
    maskStyle = 'solid',
    onComplete
  } = options;
  
  const { container, text, mask } = elements;
  
  if (!container || !text || !mask) {
    console.error('textReveal: All elements (container, text, mask) are required');
    return null;
  }
  
  // Create a timeline
  const tl = gsap.timeline({
    delay,
    onComplete
  });
  
  // Determine properties based on direction and style
  const isHorizontal = direction === 'left' || direction === 'right';
  
  // Set initial states
  gsap.set(text, { opacity: 0 });
  
  if (maskStyle === 'split') {
    // Split reveal animation (mask moves out)
    tl.to(mask, {
      [isHorizontal ? 'x' : 'y']: isHorizontal ? 
        (direction === 'left' ? '100%' : '-100%') : 
        (direction === 'top' ? '100%' : '-100%'),
      duration: duration * 0.6,
      ease
    });
  } else {
    // Scale reveal animation (mask shrinks)
    tl.to(mask, {
      [isHorizontal ? 'scaleX' : 'scaleY']: 0,
      duration: duration * 0.6,
      ease,
      transformOrigin: 
        direction === 'left' ? 'right center' :
        direction === 'right' ? 'left center' :
        direction === 'top' ? 'center bottom' :
        'center top'
    });
  }
  
  // Fade in text slightly before mask is fully gone
  tl.to(text, {
    opacity: 1,
    duration: duration * 0.4,
    ease: 'power2.out'
  }, '-=0.25');
  
  return tl;
};

export default {
  fadeIn,
  fadeOut,
  slideIn,
  textReveal
};