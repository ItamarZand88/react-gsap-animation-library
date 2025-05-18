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
      disableAllAnimations: false,     // Disable all animations completely
      animationQuality: 'high'         // 'low', 'medium', 'high'
    }}>
      {/* Your app content */}
    </AnimationProvider>
  );
}

// Access settings in any component
function MyComponent() {
  const { 
    disableAllAnimations,
    updateSettings 
  } = useAnimationSettings();
  
  // Toggle animations on/off
  const toggleAnimations = () => {
    updateSettings({ disableAllAnimations: !disableAllAnimations });
  };
  
  return (
    <div>
      <button onClick={toggleAnimations}>
        {disableAllAnimations ? 'Enable' : 'Disable'} Animations
      </button>
    </div>
  );
}
```

## Components

### Basic Animation Components

#### `FadeIn`

Fades in elements with directional options.

```jsx
<FadeIn 
  duration={0.8} 
  delay={0} 
  threshold={0.2}
  direction="up" // 'up', 'down', 'left', 'right', 'none'
  trigger="scroll" // 'scroll', 'load', 'none', 'hover', 'click'
  onComplete={() => console.log('Animation completed')}
>
  <h2>I will fade in!</h2>
</FadeIn>
```

#### `SlideIn`

Slides elements in from a specified direction with optional bounce effect.

```jsx
<SlideIn 
  direction="left" // 'left', 'right', 'up', 'down'
  distance={100} 
  duration={0.8}
  bounce={true}
  fade={true} // Fade in while sliding
  trigger="scroll"
>
  <div>I slide in from the left!</div>
</SlideIn>
```

### Text Animation Components

#### `TextReveal`

Reveals text with customizable mask effects.

```jsx
<TextReveal 
  duration={1.2}
  direction="left" // 'left', 'right', 'top', 'bottom'
  backgroundColor="#000"
  textColor="inherit"
  maskStyle="solid" // 'solid', 'gradient', 'split'
  trigger="scroll"
>
  This text will be revealed dramatically!
</TextReveal>
```

### Interactive Components

#### `AnimatedButton`

A button with various animation effects.

```jsx
<AnimatedButton 
  effect="ripple" // 'ripple', 'shine', 'pulse', 'scale', 'fill'
  effectColor="rgba(255, 255, 255, 0.4)"
  duration={0.6}
  asChild={false} // Set to true to use children as the button
>
  Click Me!
</AnimatedButton>

// Using as a wrapper for custom elements
<AnimatedButton effect="shine" asChild={true}>
  <div className="custom-button">
    Custom Element
  </div>
</AnimatedButton>
```

## Hooks

### `useAnimation`

Wrapper around GSAP's `useGSAP` hook for consistent API:

```jsx
import { useAnimation } from 'react-gsap-animation-library';
import gsap from 'gsap';

function MyComponent() {
  const { contextSafe } = useAnimation(() => {
    gsap.to('.element', { opacity: 1, duration: 1 });
  }, { 
    scope: containerRef,
    dependencies: [someProp],
    revertOnUpdate: true
  });
  
  // Create context-safe event handlers
  const handleClick = contextSafe(() => {
    gsap.to('.element', { scale: 1.2 });
  });
  
  return (
    <div ref={containerRef}>
      <button onClick={handleClick}>Animate</button>
      <div className="element">Content</div>
    </div>
  );
}
```

### `useAnimationEffect`

Simplified hook for common animation patterns:

```jsx
import { useAnimationEffect } from 'react-gsap-animation-library';

function MyComponent() {
  const { ref, contextSafe } = useAnimationEffect({
    animation: (containerRef) => {
      gsap.from(containerRef.current, { opacity: 0, y: 30 });
    },
    dependencies: [someProp],
    revertOnUpdate: true
  });
  
  return <div ref={ref}>Animated content</div>;
}
```

### `useScrollTrigger`

Helper hook for ScrollTrigger animations:

```jsx
import { useScrollTrigger } from 'react-gsap-animation-library';
import { useRef } from 'react';

function MyComponent() {
  const triggerRef = useRef(null);
  const animation = gsap.timeline();
  
  animation.to('.element', { opacity: 1, y: 0 });
  
  useScrollTrigger({
    trigger: triggerRef,
    animation: animation,
    start: "top center",
    markers: true,
    scrub: 0.5,
    pin: true,
    onEnter: () => console.log('Entered view')
  });
  
  return (
    <div ref={triggerRef}>
      <div className="element">Scroll-animated content</div>
    </div>
  );
}
```

## Render Props Pattern

All components support a render props pattern for more control:

```jsx
<FadeIn>
  {({ play }) => (
    <div>
      <h2>Manual control</h2>
      <button onClick={play}>Trigger Animation</button>
    </div>
  )}
</FadeIn>
```

## Accessibility

The library respects the user's accessibility preferences:

- Automatically detects and respects the `prefers-reduced-motion` setting
- Adapts to low-end devices and low battery scenarios
- Allows complete disabling of animations via context
- Provides sensible defaults for a better user experience

## Server-Side Rendering (SSR)

The library is compatible with server-side rendering frameworks like Next.js. All components properly handle SSR environments by:

1. Detecting the environment and avoiding client-only code on the server
2. Properly initializing animations after hydration
3. Respecting user preferences like reduced motion

## Browser Support

- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: 11+
- IE: Not supported

## Migration from v1.x

See the [Migration Guide](MIGRATION.md) for detailed instructions on upgrading from version 1.x.

## License

MIT © Itamar Zand

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ItamarZand88/react-gsap-animation-library/issues).

---

Built with GSAP and ❤️ by [Itamar Zand](https://github.com/ItamarZand88)