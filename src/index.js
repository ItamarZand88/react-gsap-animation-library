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