// Main export file for our library
import FadeIn from './components/FadeIn';
import SlideIn from './components/SlideIn';
import AnimatedButton from './components/AnimatedButton';
import AnimatedCard from './components/AnimatedCard';
import AnimatedList from './components/AnimatedList';
import TextReveal from './components/TextReveal';
import ParallaxSection from './components/ParallaxSection';
import SplitText from './components/SplitText';
import AnimatedCounter from './components/AnimatedCounter';
import Marquee from './components/Marquee';
import ScrollTriggeredTimeline from './components/ScrollTriggeredTimeline';
import MagneticElement from './components/MagneticElement';
import AnimatedCursor from './components/AnimatedCursor';
import AnimatedBackground from './components/AnimatedBackground';
import ScrollProgress from './components/ScrollProgress';

// Export utility functions and hooks
import * as animations from './utils/animations';
import * as easings from './utils/easings';
import * as hooks from './utils/hooks';

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