import React, { createContext, useContext, useState, useEffect } from 'react';
import { canUseGSAP, canUseWebAnimation, canUseScrollTrigger, canUseIntersectionObserver } from '../utils/fallbacks';

/**
 * Default animation settings
 */
const defaultAnimationSettings = {
  // Feature detection
  gsapAvailable: false,
  webAnimationAvailable: false,
  scrollTriggerAvailable: false,
  intersectionObserverAvailable: false,
  
  // Global animation settings
  defaultDuration: 0.8,
  defaultEase: 'power3.out',
  defaultDelay: 0,
  defaultStagger: 0.1,
  defaultThreshold: 0.2,
  
  // Global flags
  disableAllAnimations: false,
  preferCSS: false, // When true, use CSS even if GSAP is available
  disableScrollAnimations: false,
  
  // Animation quality settings (for performance)
  animationQuality: 'high', // 'low', 'medium', 'high'
};

/**
 * Animation Context
 */
const AnimationContext = createContext(defaultAnimationSettings);

/**
 * Animation Provider Component
 * Provides global animation settings and feature detection
 */
export const AnimationProvider = ({ children, settings = {} }) => {
  // Merge default settings with user settings
  const [animationSettings, setAnimationSettings] = useState({
    ...defaultAnimationSettings,
    ...settings
  });
  
  // Detect available features on mount
  useEffect(() => {
    const gsapAvailable = canUseGSAP();
    const webAnimationAvailable = canUseWebAnimation();
    const scrollTriggerAvailable = canUseScrollTrigger();
    const intersectionObserverAvailable = canUseIntersectionObserver();
    
    setAnimationSettings(prevSettings => ({
      ...prevSettings,
      gsapAvailable,
      webAnimationAvailable,
      scrollTriggerAvailable,
      intersectionObserverAvailable
    }));
  }, []);
  
  // Update settings method
  const updateSettings = (newSettings) => {
    setAnimationSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };
  
  // Adjust animation quality based on device performance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for low-end devices
      const isLowEndDevice = () => {
        // Check for battery API and low battery
        if ('getBattery' in navigator) {
          navigator.getBattery().then(battery => {
            if (battery.level < 0.2 && !battery.charging) {
              updateSettings({ animationQuality: 'low' });
            }
          }).catch(() => {});
        }
        
        // Check for device memory API (Chrome only)
        if ('deviceMemory' in navigator) {
          if (navigator.deviceMemory < 4) {
            updateSettings({ animationQuality: 'low' });
          } else if (navigator.deviceMemory < 8) {
            updateSettings({ animationQuality: 'medium' });
          }
        }
        
        // Check for reduced motion preference
        if (typeof window.matchMedia === 'function') {
          const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
          if (motionQuery.matches) {
            updateSettings({ 
              disableAllAnimations: true,
              disableScrollAnimations: true
            });
          }
          
          // Listen for changes
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
      };
      
      isLowEndDevice();
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