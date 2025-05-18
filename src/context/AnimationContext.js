import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  try {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
  } catch (error) {
    console.warn("GSAP plugin registration failed:", error);
  }
}

// For server-side rendering
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Default animation settings
 */
const defaultAnimationSettings = {
  // Global animation settings
  defaultDuration: 0.8,
  defaultEase: 'power3.out',
  defaultDelay: 0,
  defaultStagger: 0.1,
  
  // Global flags
  disableAllAnimations: false,
  disableScrollAnimations: false,
  
  // Animation quality settings
  animationQuality: 'high', // 'low', 'medium', 'high'
};

/**
 * Animation Context
 */
const AnimationContext = createContext(defaultAnimationSettings);

/**
 * Animation Provider Component
 * Provides global animation settings
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {Object} props.settings - Custom animation settings
 * @returns {JSX.Element} Provider component
 */
export const AnimationProvider = ({ children, settings = {} }) => {
  // Merge default settings with user settings
  const [animationSettings, setAnimationSettings] = useState({
    ...defaultAnimationSettings,
    ...settings
  });
  
  // Update settings method
  const updateSettings = (newSettings) => {
    setAnimationSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };
  
  // Initialize GSAP with the user's settings
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Register GSAP plugins
        gsap.registerPlugin(useGSAP, ScrollTrigger);
        
        // Set GSAP defaults based on settings
        gsap.defaults({
          ease: animationSettings.defaultEase,
          duration: animationSettings.defaultDuration,
          overwrite: 'auto'
        });
      } catch (error) {
        console.warn("GSAP initialization failed:", error);
      }
    }
  }, [
    animationSettings.defaultEase,
    animationSettings.defaultDuration
  ]);
  
  // Detect user's motion preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for reduced motion preference
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        updateSettings({ 
          disableAllAnimations: true,
          disableScrollAnimations: true
        });
      }
      
      // Listen for changes to preference
      const handleMotionChange = (e) => {
        updateSettings({ 
          disableAllAnimations: e.matches,
          disableScrollAnimations: e.matches
        });
      };
      
      try {
        // Modern approach
        motionQuery.addEventListener('change', handleMotionChange);
        return () => motionQuery.removeEventListener('change', handleMotionChange);
      } catch (err) {
        try {
          // Legacy approach
          motionQuery.addListener(handleMotionChange);
          return () => motionQuery.removeListener(handleMotionChange);
        } catch (e) {
          // Fallback - no listeners
        }
      }
    }
  }, []);
  
  // Check for battery status to optimize animations on low battery
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        navigator.getBattery().then(battery => {
          if (battery.level < 0.2 && !battery.charging) {
            updateSettings({ animationQuality: 'low' });
          }
          
          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2 && !battery.charging) {
              updateSettings({ animationQuality: 'low' });
            } else if (battery.level > 0.5 || battery.charging) {
              updateSettings({ animationQuality: 'high' });
            }
          });
        });
      } catch (e) {
        console.warn("Battery status detection failed:", e);
      }
    }
  }, []);
  
  // Construct the context value
  const contextValue = {
    ...animationSettings,
    updateSettings
  };
  
  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

/**
 * Hook to use animation settings
 * @returns {Object} Animation settings and update function
 */
export const useAnimationSettings = () => {
  const context = useContext(AnimationContext);
  
  if (context === undefined) {
    throw new Error('useAnimationSettings must be used within an AnimationProvider');
  }
  
  return context;
};

export default AnimationContext;