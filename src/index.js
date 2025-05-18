// Main export file for our library

// Basic components
import FadeIn from './components/basic/FadeIn.jsx';
import SlideIn from './components/basic/SlideIn.jsx';
import SimpleAnimated from './components/basic/SimpleAnimated.jsx';

// Text components
import TextReveal from './components/text/TextReveal.jsx';
import SplitText from './components/SplitText.jsx';
import AnimatedCounter from './components/AnimatedCounter.jsx';
import Marquee from './components/Marquee.jsx';

// Interactive components
import AnimatedButton from './components/interactive/AnimatedButton.jsx';
import AnimatedCard from './components/AnimatedCard.jsx';
import AnimatedList from './components/AnimatedList.jsx';

// Effects components
import ParallaxSection from './components/ParallaxSection.jsx';
import ScrollTriggeredTimeline from './components/ScrollTriggeredTimeline.jsx';
import MagneticElement from './components/MagneticElement.jsx';
import AnimatedCursor from './components/AnimatedCursor.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';

// Export utility functions and hooks
import { useAnimationSettings, AnimationProvider } from './context/AnimationContext.js';
import useSafeAnimation from './utils/useSafeAnimation.js';
import * as animations from './utils/animations.js';
import * as easings from './utils/easings.js';
import * as fallbacks from './utils/fallbacks.js';
import * as hooks from './utils/hooks.js';

// Main library version
const version = '1.0.2';

// Library info
const info = {
  name: 'react-gsap-animation-library',
  version,
  description: 'A comprehensive React component library that leverages GSAP for animations with fallbacks',
  author: 'Itamar Zand',
  license: 'MIT',
  repository: 'https://github.com/ItamarZand88/react-gsap-animation-library'
};

// Safe GSAP initialization
let gsapInitialized = false;
try {
  // This will only execute on the client-side
  if (typeof window !== 'undefined') {
    const gsap = window.gsap || (typeof require === 'function' && require('gsap'));
    const ScrollTrigger = window.ScrollTrigger || (typeof require === 'function' && require('gsap/ScrollTrigger'));
    
    if (gsap && ScrollTrigger && !gsapInitialized) {
      gsap.registerPlugin(ScrollTrigger);
      gsapInitialized = true;
    }
  }
} catch (error) {
  // GSAP not available, will fallback to CSS animations
  console.warn('GSAP initialization failed, falling back to CSS animations:', error.message);
}

// Export components
export {
  // Context providers
  AnimationProvider,
  useAnimationSettings,
  
  // Basic components
  FadeIn,
  SlideIn,
  SimpleAnimated,
  
  // Text components
  TextReveal,
  SplitText,
  AnimatedCounter,
  Marquee,
  
  // Interactive components
  AnimatedButton,
  AnimatedCard,
  AnimatedList,
  
  // Effects components
  ParallaxSection,
  ScrollTriggeredTimeline,
  MagneticElement,
  AnimatedCursor,
  AnimatedBackground,
  ScrollProgress,
  
  // Utilities
  useSafeAnimation,
  animations,
  easings,
  fallbacks,
  hooks,
  
  // Library info
  version,
  info
};

// Default export
export default {
  // Context providers
  AnimationProvider,
  useAnimationSettings,
  
  // Basic components
  FadeIn,
  SlideIn,
  SimpleAnimated,
  
  // Text components
  TextReveal,
  SplitText,
  AnimatedCounter,
  Marquee,
  
  // Interactive components
  AnimatedButton,
  AnimatedCard,
  AnimatedList,
  
  // Effects components
  ParallaxSection,
  ScrollTriggeredTimeline,
  MagneticElement,
  AnimatedCursor,
  AnimatedBackground,
  ScrollProgress,
  
  // Utilities
  useSafeAnimation,
  animations,
  easings,
  fallbacks,
  hooks,
  
  // Library info
  version,
  info
};