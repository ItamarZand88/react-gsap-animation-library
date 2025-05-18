// Main export file for our library
import FadeIn from './components/FadeIn.js';
import SlideIn from './components/SlideIn.js';
import AnimatedButton from './components/AnimatedButton.js';
import AnimatedCard from './components/AnimatedCard.js';
import AnimatedList from './components/AnimatedList.js';
import TextReveal from './components/TextReveal.js';
import ParallaxSection from './components/ParallaxSection.js';
import SplitText from './components/SplitText.js';
import AnimatedCounter from './components/AnimatedCounter.js';
import Marquee from './components/Marquee.js';
import ScrollTriggeredTimeline from './components/ScrollTriggeredTimeline.js';
import MagneticElement from './components/MagneticElement.js';
import AnimatedCursor from './components/AnimatedCursor.js';
import AnimatedBackground from './components/AnimatedBackground.js';
import ScrollProgress from './components/ScrollProgress.js';

// Export utility functions and hooks
import * as animations from './utils/animations.js';
import * as easings from './utils/easings.js';
import * as hooks from './utils/hooks.js';

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
  
  // Utilities
  animations,
  easings,
  hooks
};