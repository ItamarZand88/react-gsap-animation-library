# React GSAP Animation Library

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-16.8%2B-61DAFB)
![GSAP](https://img.shields.io/badge/GSAP-3.12%2B-88CE02)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive React animation library leveraging GSAP's official React integration (`useGSAP`) for optimal performance and developer experience. This library provides beautiful, performant animations with minimal setup and proper cleanup.

## Features

- 🚀 **Official GSAP React Integration** - Uses `@gsap/react` for optimal performance
- ⚙️ **Robust Animation Context** - Global settings with accessibility features
- 📱 **Context-Safe Event Handlers** - Proper GSAP context association for event handlers
- 🔄 **Scroll-Based Animations** - Integrated with GSAP's ScrollTrigger
- 🐞 **Clean Unmounting** - Proper cleanup of animations on component unmount
- 🧩 **Independent Components** - Each component works without depending on others
- 🎛️ **Central Configuration** - Global animation settings through context
- 🌐 **SSR Support** - Proper functioning in server-side rendering environments

## What's New in Version 2.0.0

This major update brings significant improvements:

- Integration with the official `@gsap/react` package
- Enhanced GSAP context management for proper cleanup
- Improved animation performance and code organization
- Better accessibility support including reduced motion preferences
- Simplified API with more powerful features
- New components like `TypingText` for typewriter effects

## Installation

```bash
npm install react-gsap-animation-library gsap @gsap/react
# or
yarn add react-gsap-animation-library gsap @gsap/react
```

## Quick Start

```jsx
import React from 'react';
import { 
  AnimationProvider, 
  FadeIn, 
  SlideIn, 
  TextReveal,
  TypingText,
  AnimatedButton 
} from 'react-gsap-animation-library';

function App() {
  return (
    <AnimationProvider>
      <div className="app">
        <FadeIn duration={1} delay={0.2} direction="up">
          <h1>Hello Animation World!</h1>
        </FadeIn>
        
        <SlideIn direction="right" distance={100} bounce={true}>
          <p>This text slides in from the right with a bounce effect</p>
        </SlideIn>
        
        <TextReveal 
          direction="left" 
          backgroundColor="#3498db" 
          maskStyle="gradient"
        >
          Revealing text with a mask effect
        </TextReveal>
        
        <TypingText 
          text={["Hello!", "Welcome to React GSAP Animation Library", "Try it now!"]} 
          typingSpeed={15}
          loop={Infinity}
        />
        
        <AnimatedButton effect="ripple" effectColor="rgba(255, 255, 255, 0.5)">
          Click Me!
        </AnimatedButton>
      </div>
    </AnimationProvider>
  );
}
```

## Global Animation Settings

The library provides a context provider for global animation settings:

```jsx
import { AnimationProvider, useAnimationSettings } from 'react-gsap-animation-library';

function App() {
  return (
    <AnimationProvider settings={{
      defaultDuration: 0.8,        // Default animation duration
      defaultEase: 'power3.out',   // Default easing function
      disableScrollAnimations: false,  // Disable all scroll-triggered animations
      disableAllAnimations: false,     // Disable all animations
      respectReducedMotion: true,      // Respect prefers-reduced-motion setting
      lowPowerMode: false              // Reduce animation complexity for battery savings
    }}>
      <YourApp />
    </AnimationProvider>
  );
}

// Access settings in any component
function MyComponent() {
  const { 
    disableAllAnimations,
    defaultDuration,
    updateSettings
  } = useAnimationSettings();
  
  // You can update settings programmatically
  const disableAnimations = () => {
    updateSettings({ disableAllAnimations: true });
  };
  
  return (
    <div>
      <button onClick={disableAnimations}>Disable Animations</button>
    </div>
  );
}
```

## Core Components

### FadeIn

Fade in elements with optional directional movement.

```jsx
<FadeIn 
  direction="up"        // 'up', 'down', 'left', 'right', 'none'
  duration={0.8}        // Animation duration in seconds
  delay={0.2}           // Delay before animation starts
  distance={30}         // Movement distance in pixels
  ease="power3.out"     // GSAP easing function
  trigger="load"        // 'load', 'scroll', 'none' (manual control)
  threshold={0.1}       // Viewport threshold for scroll animations
  stagger={0.1}         // Stagger delay for child elements
  onComplete={() => {}} // Callback when animation completes
>
  <div>Content to animate</div>
</FadeIn>
```

### SlideIn

Slide elements into view with optional bounce effect.

```jsx
<SlideIn 
  direction="left"       // 'up', 'down', 'left', 'right'
  duration={0.8}         // Animation duration in seconds
  delay={0}              // Delay before animation starts
  distance={100}         // Movement distance in pixels
  ease="power2.out"      // GSAP easing function
  bounce={true}          // Add bounce effect
  bounceIntensity={0.3}  // Strength of bounce (0-1)
  trigger="scroll"       // 'load', 'scroll', 'none' (manual control)
  threshold={0.2}        // Viewport threshold for scroll animations
>
  <div>Sliding content</div>
</SlideIn>
```

### TextReveal

Reveal text with a mask effect.

```jsx
<TextReveal 
  direction="left"          // 'left', 'right', 'top', 'bottom'
  duration={1.2}            // Animation duration in seconds
  delay={0.1}               // Delay before animation starts
  ease="power4.inOut"       // GSAP easing function
  backgroundColor="#3498db" // Mask color
  textColor="#ffffff"       // Text color
  maskStyle="solid"         // 'solid', 'gradient', 'split'
  trigger="scroll"          // 'load', 'scroll', 'none' (manual control)
  threshold={0.3}           // Viewport threshold for scroll animations
>
  Text to reveal with mask effect
</TextReveal>
```

### TypingText

Create typewriter-like text animations.

```jsx
<TypingText 
  text="Single text to type"  // String or array of strings to type
  // text={["First text", "Second text"]}  // Multiple texts
  typingSpeed={10}            // Characters per second
  deleteSpeed={5}             // Delete speed (for multiple texts)
  delayBetweenTexts={1.5}     // Delay between different texts
  startDelay={0.5}            // Initial delay before typing starts
  cursorBlink={true}          // Enable cursor blinking
  cursorChar="|"              // Character to use as cursor
  cursorColor="inherit"       // Cursor color
  trigger="load"              // 'load', 'scroll', 'none' (manual control)
  loop={0}                    // Number of loops (0 = no loop, Infinity = infinite)
/>
```

### AnimatedButton

Enhanced button with hover and click animations.

```jsx
<AnimatedButton 
  effect="scale"              // 'scale', 'ripple', 'glow', 'magnetic'
  duration={0.3}              // Animation duration
  effectColor="rgba(255,255,255,0.5)" // Effect color for ripple/glow
  hoverScale={1.05}           // Scale on hover
  clickScale={0.95}           // Scale on click
  ease="power2.out"           // Easing function
  className="custom-button"   // Additional class names
  style={{}}                  // Custom inline styles
  onClick={() => {}}          // Click handler
>
  Click Me!
</AnimatedButton>
```

## Custom Hooks

### useAnimation

Create GSAP animations with proper context handling:

```jsx
import { useAnimation } from 'react-gsap-animation-library';

function MyComponent() {
  const elementRef = useRef(null);
  
  // Create a GSAP animation with proper context
  const { tween, timeline, add, contextSafe } = useAnimation();
  
  useEffect(() => {
    // Create a tween - automatically cleaned up on unmount
    tween(elementRef.current, {
      x: 100,
      duration: 1,
      ease: 'power2.out'
    });
    
    // Or create a timeline
    const tl = timeline();
    tl.to(elementRef.current, { x: 100, duration: 1 })
      .to(elementRef.current, { y: 50, duration: 0.5 });
    
    // Make event handlers context-safe
    const onHover = contextSafe(() => {
      tween(elementRef.current, { scale: 1.2, duration: 0.3 });
    });
    
    elementRef.current.addEventListener('mouseenter', onHover);
    
    // Event listeners using contextSafe are automatically cleaned up
  }, []);
  
  return <div ref={elementRef}>Animated element</div>;
}
```

### useAnimationEffect

Simplified API for common effects:

```jsx
import { useAnimationEffect } from 'react-gsap-animation-library';

function MyComponent() {
  const elementRef = useRef(null);
  
  // Apply a predefined animation effect
  useAnimationEffect(elementRef, {
    effect: 'fadeIn',     // 'fadeIn', 'fadeOut', 'slideIn', etc.
    direction: 'up',      // Direction for effects that support it
    duration: 0.8,        // Duration in seconds
    delay: 0.2,           // Delay in seconds
    trigger: 'scroll',    // 'load', 'scroll', 'none'
    threshold: 0.2        // Viewport threshold for scroll
  });
  
  return <div ref={elementRef}>Element with effects</div>;
}
```

### useScrollTrigger

Create scroll-based animations:

```jsx
import { useScrollTrigger } from 'react-gsap-animation-library';

function MyScrollAnimation() {
  const elementRef = useRef(null);
  
  // Create a ScrollTrigger animation
  useScrollTrigger(elementRef, {
    animation: (target) => ({
      opacity: 1,
      y: 0,
      duration: 1
    }),
    initial: { opacity: 0, y: 50 },   // Initial state
    scrub: true,                      // Animate with scroll position
    start: 'top 80%',                 // ScrollTrigger start position
    end: 'bottom 20%',                // ScrollTrigger end position
    markers: false,                   // Show markers (debug)
    pin: false,                       // Pin element during animation
    toggleActions: 'play none none reverse'  // ScrollTrigger toggle actions
  });
  
  return <div ref={elementRef}>Scroll-animated content</div>;
}
```

## Advanced Usage

### Staggered Animations

```jsx
import { FadeIn } from 'react-gsap-animation-library';

function StaggeredItems() {
  return (
    <FadeIn 
      stagger={0.1} 
      childClassName="stagger-item"
      direction="up"
      distance={20}
    >
      <div className="stagger-item">Item 1</div>
      <div className="stagger-item">Item 2</div>
      <div className="stagger-item">Item 3</div>
      <div className="stagger-item">Item 4</div>
    </FadeIn>
  );
}
```

### Combined Animations

```jsx
import { useAnimation } from 'react-gsap-animation-library';

function CombinedEffects() {
  const containerRef = useRef(null);
  const { timeline } = useAnimation();
  
  useEffect(() => {
    const tl = timeline();
    
    tl.from(containerRef.current, { opacity: 0, duration: 1 })
      .from('.title', { y: 50, opacity: 0, duration: 0.5 }, '-=0.5')
      .from('.content', { scale: 0.9, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.button', { y: 20, opacity: 0, duration: 0.3 }, '-=0.2');
  }, []);
  
  return (
    <div ref={containerRef}>
      <h1 className="title">Combined Animations</h1>
      <p className="content">Content with sequential animation</p>
      <button className="button">Animated Button</button>
    </div>
  );
}
```

## Browser Support

- Chrome 60+
- Firefox 54+
- Safari 10.1+
- Edge 15+
- iOS Safari 10.3+
- Android Browser 67+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
