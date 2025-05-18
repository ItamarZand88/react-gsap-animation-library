/**
 * Animation fallback utilities
 * Provides CSS-based fallbacks for common animations when GSAP is not available
 */

/**
 * Creates CSS keyframes animation definitions
 * @returns {string} CSS keyframes rules as a string
 */
export const generateCSSKeyframes = () => {
  return `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translate3d(0, -30px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translate3d(-30px, 0, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translate3d(30px, 0, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes slideInUp {
      from {
        transform: translate3d(0, 100%, 0);
        visibility: visible;
      }
      to {
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes slideInDown {
      from {
        transform: translate3d(0, -100%, 0);
        visibility: visible;
      }
      to {
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        transform: translate3d(-100%, 0, 0);
        visibility: visible;
      }
      to {
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes slideInRight {
      from {
        transform: translate3d(100%, 0, 0);
        visibility: visible;
      }
      to {
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
      }
      50% {
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      from {
        transform: scale3d(1, 1, 1);
      }
      50% {
        transform: scale3d(1.05, 1.05, 1.05);
      }
      to {
        transform: scale3d(1, 1, 1);
      }
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blinkCursor {
      from { border-right-color: rgba(0,0,0,.75); }
      to { border-right-color: transparent; }
    }

    @keyframes reveal {
      from { clip-path: inset(0 100% 0 0); }
      to { clip-path: inset(0 0 0 0); }
    }

    @keyframes revealUp {
      from { clip-path: inset(100% 0 0 0); }
      to { clip-path: inset(0 0 0 0); }
    }

    @keyframes revealDown {
      from { clip-path: inset(0 0 100% 0); }
      to { clip-path: inset(0 0 0 0); }
    }

    @keyframes bounce {
      from, 20%, 53%, 80%, to {
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -30px, 0);
      }
      70% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -15px, 0);
      }
      90% {
        transform: translate3d(0, -4px, 0);
      }
    }

    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }

    @keyframes shine {
      from {
        background-position: -200% 0;
      }
      to {
        background-position: 200% 0;
      }
    }
  `;
};

/**
 * Dynamically injects CSS keyframes into the document head
 * Only injects them once even if called multiple times
 */
export const injectCSSKeyframes = () => {
  // Check if we've already injected keyframes
  if (typeof document !== 'undefined' && !document.getElementById('react-gsap-keyframes')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'react-gsap-keyframes';
    styleElement.textContent = generateCSSKeyframes();
    document.head.appendChild(styleElement);
  }
};

/**
 * Maps GSAP easing functions to CSS equivalents
 * @param {string} gsapEase - GSAP easing function name
 * @returns {string} CSS easing equivalent
 */
export const mapEasing = (gsapEase = 'power2.out') => {
  const easingMap = {
    'none': 'linear',
    'power1.in': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
    'power1.out': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
    'power1.inOut': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
    'power2.in': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
    'power2.out': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    'power2.inOut': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
    'power3.in': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
    'power3.out': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    'power3.inOut': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
    'power4.in': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
    'power4.out': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    'power4.inOut': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
    'back.in': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    'back.out': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
    'back.inOut': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
    'elastic.in': 'cubic-bezier(0.700, 0.000, 0.835, 0.000)',
    'elastic.out': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    'elastic.inOut': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
    'circ.in': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
    'circ.out': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
    'circ.inOut': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
    'expo.in': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
    'expo.out': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    'expo.inOut': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
    'sine.in': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
    'sine.out': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
    'sine.inOut': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
  };
  
  return easingMap[gsapEase] || 'ease-out';
};

/**
 * Gets the CSS animation name for a GSAP-like animation
 * @param {Object} props - Animation properties
 * @returns {string} CSS animation name
 */
export const getAnimationName = (props) => {
  const { x, y, opacity, scale } = props;
  
  if (opacity === 0 && x === undefined && y === undefined && scale === undefined) {
    return 'fadeIn';
  }
  
  if (opacity === 0 && y > 0) {
    return 'fadeInUp';
  }
  
  if (opacity === 0 && y < 0) {
    return 'fadeInDown';
  }
  
  if (opacity === 0 && x > 0) {
    return 'fadeInLeft';
  }
  
  if (opacity === 0 && x < 0) {
    return 'fadeInRight';
  }
  
  if (opacity === 0 && scale !== undefined && scale < 1) {
    return 'zoomIn';
  }
  
  if (y > 50 && opacity === undefined) {
    return 'slideInUp';
  }
  
  if (y < -50 && opacity === undefined) {
    return 'slideInDown';
  }
  
  if (x > 50 && opacity === undefined) {
    return 'slideInLeft';
  }
  
  if (x < -50 && opacity === undefined) {
    return 'slideInRight';
  }
  
  return 'fadeIn'; // Default fallback
};

/**
 * Applies CSS animation styles to an element
 * @param {HTMLElement} element - DOM element to animate
 * @param {Object} props - Animation properties
 */
export const applyCssAnimation = (element, props) => {
  if (!element || !props) return;
  
  const { 
    duration = 0.5, 
    delay = 0, 
    ease = 'power2.out',
    repeat = 0,
    yoyo = false,
    onComplete
  } = props;
  
  // Inject keyframes if needed
  injectCSSKeyframes();
  
  // Get animation name based on properties
  const animationName = getAnimationName(props);
  
  // Map GSAP ease to CSS ease
  const cssEase = mapEasing(ease);
  
  // Set animation properties
  element.style.animation = `${animationName} ${duration}s ${cssEase} ${delay}s ${repeat === -1 ? 'infinite' : repeat} ${yoyo ? 'alternate' : 'normal'} forwards`;
  
  // Handle completion
  if (onComplete && typeof onComplete === 'function') {
    const animationEndHandler = () => {
      onComplete();
      element.removeEventListener('animationend', animationEndHandler);
    };
    
    element.addEventListener('animationend', animationEndHandler);
  }
  
  return {
    element,
    kill: () => {
      element.style.animation = '';
    }
  };
};

/**
 * Creates a test function to check if a feature is available in the current environment
 * @param {Function} testFn - Function that tests feature availability
 * @returns {boolean} Whether the feature is available
 */
export const canUseFeature = (testFn) => {
  try {
    return testFn();
  } catch (e) {
    return false;
  }
};

/**
 * Tests if GSAP is available
 * @returns {boolean} Whether GSAP is available
 */
export const canUseGSAP = () => {
  return canUseFeature(() => {
    return typeof window !== 'undefined' && (
      (window.gsap !== undefined) || 
      (typeof require === 'function' && require('gsap') !== undefined)
    );
  });
};

/**
 * Tests if Web Animation API is available
 * @returns {boolean} Whether Web Animation API is available
 */
export const canUseWebAnimation = () => {
  return canUseFeature(() => {
    return typeof Element !== 'undefined' && 
      typeof Element.prototype.animate === 'function';
  });
};

/**
 * Tests if ScrollTrigger is available
 * @returns {boolean} Whether ScrollTrigger is available
 */
export const canUseScrollTrigger = () => {
  return canUseFeature(() => {
    const gsap = window.gsap || (typeof require === 'function' && require('gsap'));
    return gsap && (
      (gsap.plugins && gsap.plugins.ScrollTrigger) || 
      window.ScrollTrigger || 
      (typeof require === 'function' && require('gsap/ScrollTrigger'))
    );
  });
};

/**
 * Tests if IntersectionObserver is available (as ScrollTrigger fallback)
 * @returns {boolean} Whether IntersectionObserver is available
 */
export const canUseIntersectionObserver = () => {
  return canUseFeature(() => {
    return typeof IntersectionObserver === 'function';
  });
};

export default {
  injectCSSKeyframes,
  mapEasing,
  getAnimationName,
  applyCssAnimation,
  canUseGSAP,
  canUseWebAnimation,
  canUseScrollTrigger,
  canUseIntersectionObserver
};
