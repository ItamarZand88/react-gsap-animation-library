# React GSAP Animation Library

![Version](https://img.shields.io/badge/version-1.0.2-blue)
![React](https://img.shields.io/badge/React-16.8%2B-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive and easy-to-use React animation library built on top of GSAP (GreenSock Animation Platform) that provides beautiful, performant animations with multiple fallback layers.

## Features

- 🚀 **Simple to use**: Just wrap your components with our animation components
- ⚙️ **Customizable**: Extensive options for customizing animations
- 📱 **Responsive**: Works great on all device sizes
- 🔄 **Scroll-based animations**: Trigger animations as elements enter the viewport
- 🐞 **Robust fallbacks**: Three layers of fallbacks (GSAP, Web Animations API, CSS animations) 
- 🛡️ **Fault-tolerant**: Smooth operation even when GSAP is unavailable or loading fails
- 📦 **Independent components**: Each component works without depending on others
- 🎛️ **Central configuration**: Global animation settings through context
- 🌐 **SSR Support**: Proper functioning in server-side rendering environments

## Installation

```bash
npm install react-gsap-animation-library gsap
# or
yarn add react-gsap-animation-library gsap
```

> Note: GSAP is a peer dependency, but all components include fallbacks if GSAP isn't available.

## Quick Start

```jsx
import React from 'react';
import { 
  AnimationProvider, 
  FadeIn, 
  SlideIn, 
  AnimatedButton 
} from 'react-gsap-animation-library';

function App() {
  return (
    <AnimationProvider>
      <div className="app">
        <FadeIn duration={1} delay={0.2}>
          <h1>Hello Animation World!</h1>
        </FadeIn>
        
        <SlideIn direction="right" distance={100}>
          <p>This text slides in from the right</p>
        </SlideIn>
        
        <AnimatedButton effect="ripple">Click Me!</AnimatedButton>
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
      defaultDuration: 0.8,
      defaultEase: 'power3.out',
      disableScrollAnimations: false,
      animationQuality: 'high' // 'low', 'medium', 'high'
    }}>
      {/* Your app content */}
    </AnimationProvider>
  );
}

// Access settings in any component
function MyComponent() {
  const { 
    gsapAvailable, 
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

The library includes the following components organized by category:

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
  onStart={() => console.log('Animation started')}
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
  trigger="scroll"
>
  <div>I slide in from the left!</div>
</SlideIn>
```

#### `SimpleAnimated`

A CSS-only animated component (no GSAP dependency).

```jsx
<SimpleAnimated 
  animationType="fadeIn" // 'fadeIn', 'fadeInUp', 'slideInLeft', 'bounce', 'pulse', etc.
  duration={0.5}
  trigger="scroll" // 'scroll', 'load', 'none', 'hover', 'click'
>
  <p>Simple CSS animation!</p>
</SimpleAnimated>
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

#### `SplitText`

Animates individual characters, words, or lines of text.

```jsx
<SplitText 
  type="chars" // 'chars', 'words', 'lines'
  stagger={0.05}
  animation="fadeUp" // 'fade', 'blur', 'slideUp', etc.
>
  This text animates character by character!
</SplitText>
```

### Interactive Components

#### `AnimatedButton`

A button with various animation effects.

```jsx
<AnimatedButton 
  effect="ripple" // 'ripple', 'shine', 'pulse', 'scale', 'fill'
  effectColor="rgba(255, 255, 255, 0.4)"
  duration={0.6}
  trigger="hover" // 'hover', 'click', 'none'
  asChild={false} // Set to true to use children as the button
>
  Click Me!
</AnimatedButton>
```

#### `AnimatedCard`

A card component with hover and entrance animations.

```jsx
<AnimatedCard 
  effect="tilt" // 'tilt', 'lift', 'glow', 'border', 'shadow'
  intensity={0.5}
  entrance={{ y: 30, opacity: 0 }}
>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</AnimatedCard>
```

### Effect Components

#### `ScrollProgress`

Shows scroll progress with customizable styles.

```jsx
<ScrollProgress 
  height="5px" 
  color="#ff0000"
  position="top" // 'top', 'bottom', 'left', 'right'
  indicator={true} // Show section indicators
/>
```

#### `MagneticElement`

Creates a magnetic effect, pulling elements toward the cursor.

```jsx
<MagneticElement 
  strength={0.5}
  radius={100}
  type="attract" // 'attract', 'repel'
  cumulativeEffect={false}
>
  <button>Magnetic Button</button>
</MagneticElement>
```

## Fallback Mechanisms

The library implements three layers of fallbacks:

1. **GSAP (Primary)**: When available, uses GSAP for the best animation quality
2. **Web Animation API (Secondary)**: Falls back to the Web Animation API if GSAP fails
3. **CSS Animations (Tertiary)**: Ultimate fallback to ensure animations always work

These layers are automatically managed, so you don't need to worry about compatibility issues.

## Safe Animation Hook

For custom animations, use the `useSafeAnimation` hook:

```jsx
import { useSafeAnimation } from 'react-gsap-animation-library';

function MyComponent() {
  const elementRef = useRef(null);
  const { animate, isGsapAvailable } = useSafeAnimation(elementRef);
  
  const playAnimation = () => {
    animate({
      from: {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }
    });
  };
  
  return (
    <div>
      <div ref={elementRef}>This element will animate</div>
      <button onClick={playAnimation}>Play Animation</button>
    </div>
  );
}
```

## Server-Side Rendering (SSR)

The library is compatible with server-side rendering frameworks like Next.js. All components properly handle SSR environments by:

1. Detecting the environment and avoiding client-only code on the server
2. Properly initializing animations after hydration
3. Respecting user preferences like reduced motion

## Accessibility

The library respects the user's accessibility preferences:

- Automatically detects and respects the `prefers-reduced-motion` setting
- Adapts to low-end devices and low battery scenarios
- Allows complete disabling of animations via context

## Performance

To ensure good performance, the library:

- Only animates elements when they're visible (using IntersectionObserver)
- Avoids layout thrashing by batching animations
- Provides quality settings for lower-end devices

## Browser Support

- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: 11+
- IE: Not supported

## License

MIT © Itamar Zand

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ItamarZand88/react-gsap-animation-library/issues).

---

Made with ❤️ by [Itamar Zand](https://github.com/ItamarZand88)
