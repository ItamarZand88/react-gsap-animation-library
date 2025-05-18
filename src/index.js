// Main export file for our library

// Export context provider
import { AnimationProvider, useAnimationSettings } from './context/AnimationContext';

// Export hooks
import { useAnimation, useAnimationEffect, useScrollTrigger } from './utils/useAnimation';

// Basic components
import FadeIn from './components/basic/FadeIn.jsx';
import SlideIn from './components/basic/SlideIn.jsx';

// Text components
import TextReveal from './components/text/TextReveal.jsx';

// Interactive components
import AnimatedButton from './components/interactive/AnimatedButton.jsx';

// Register GSAP plugins
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Main library version
const version = '2.0.0';

// Library info
const info = {
  name: 'react-gsap-animation-library',
  version,
  description: 'A comprehensive React component library that leverages GSAP for animations with official GSAP-React integration',
  author: 'Itamar Zand',
  license: 'MIT',
  repository: 'https://github.com/ItamarZand88/react-gsap-animation-library'
};

// Safe GSAP initialization
if (typeof window !== 'undefined') {
  try {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  } catch (error) {
    console.warn('Failed to register GSAP plugins:', error.message);
  }
}

// Export components
export {
  // Context provider
  AnimationProvider,
  useAnimationSettings,
  
  // Hooks
  useAnimation,
  useAnimationEffect,
  useScrollTrigger,
  
  // Basic components
  FadeIn,
  SlideIn,
  
  // Text components
  TextReveal,
  
  // Interactive components
  AnimatedButton,
  
  // Library info
  version,
  info
};

// Default export
export default {
  // Context provider
  AnimationProvider,
  useAnimationSettings,
  
  // Hooks
  useAnimation,
  useAnimationEffect,
  useScrollTrigger,
  
  // Basic components
  FadeIn,
  SlideIn,
  
  // Text components
  TextReveal,
  
  // Interactive components
  AnimatedButton,
  
  // Library info
  version,
  info
};