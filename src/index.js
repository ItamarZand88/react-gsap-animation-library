// Main export file for our library
import FadeIn from './components/FadeIn.jsx';
import SlideIn from './components/SlideIn.jsx';
import AnimatedButton from './components/AnimatedButton.jsx';
import AnimatedCard from './components/AnimatedCard.jsx';
import AnimatedList from './components/AnimatedList.jsx';
import TextReveal from './components/TextReveal.jsx';
import ParallaxSection from './components/ParallaxSection.jsx';
import SplitText from './components/SplitText.jsx';
import AnimatedCounter from './components/AnimatedCounter.jsx';
import Marquee from './components/Marquee.jsx';
import ScrollTriggeredTimeline from './components/ScrollTriggeredTimeline.jsx';
import MagneticElement from './components/MagneticElement.jsx';
import AnimatedCursor from './components/AnimatedCursor.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SimpleAnimated from './components/SimpleAnimated.jsx';

// Export utility functions and hooks
import * as animations from './utils/animations.js';
import * as easings from './utils/easings.js';
import * as hooks from './utils/hooks.js';

// Main library version
const version = '1.0.1';

// Library info
const info = {
  name: 'react-gsap-animation-library',
  version,
  description: 'A comprehensive React component library that leverages GSAP for animations',
  author: 'Itamar Zand',
  license: 'MIT',
  repository: 'https://github.com/ItamarZand88/react-gsap-animation-library'
};

// Safe GSAP initialization
let gsapInitialized = false;
try {
  // This will only execute on the client-side
  if (typeof window !== 'undefined') {
    const gsap = require('gsap');
    const ScrollTrigger = require('gsap/ScrollTrigger');
    
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
  // Components
  FadeIn,
  SlideIn,
  AnimatedButton,
  AnimatedCard,
  AnimatedList,
  TextReveal,
  ParallaxSection,
  SplitText,
  AnimatedCounter,
  Marquee,
  ScrollTriggeredTimeline,
  MagneticElement,
  AnimatedCursor,
  AnimatedBackground,
  ScrollProgress,
  SimpleAnimated,
  
  // Utilities
  animations,
  easings,
  hooks,
  
  // Library info
  version,
  info
};

// Default export
export default {
  FadeIn,
  SlideIn,
  AnimatedButton,
  AnimatedCard,
  AnimatedList,
  TextReveal,
  ParallaxSection,
  SplitText,
  AnimatedCounter,
  Marquee,
  ScrollTriggeredTimeline,
  MagneticElement,
  AnimatedCursor,
  AnimatedBackground,
  ScrollProgress,
  SimpleAnimated,
  
  animations,
  easings,
  hooks,
  
  version,
  info
};