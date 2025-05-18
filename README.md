# React GSAP Animation Library

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![React](https://img.shields.io/badge/React-16.8%2B-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive and easy-to-use React animation library built on top of GSAP (GreenSock Animation Platform) that provides beautiful, performant animations with minimal setup.

## Features

- 🚀 **Simple to use**: Just wrap your components with our animation components
- ⚙️ **Customizable**: Extensive options for customizing animations
- 📱 **Responsive**: Works great on all device sizes
- 🔄 **Scroll-based animations**: Trigger animations as elements enter the viewport
- 🐞 **Fallback support**: CSS animations fallback when GSAP isn't available
- 🔌 **Zero dependencies**: No external dependencies (GSAP is a peer dependency)
- 📦 **Lightweight**: Only import what you need

## Installation

```bash
npm install react-gsap-animation-library gsap
# or
yarn add react-gsap-animation-library gsap
```

> Note: This library uses GSAP as a peer dependency to avoid version conflicts and reduce bundle size.

## Quick Start

```jsx
import React from 'react';
import { FadeIn, SlideIn, AnimatedButton } from 'react-gsap-animation-library';

function App() {
  return (
    <div className="app">
      <FadeIn duration={1} delay={0.2}>
        <h1>Hello Animation World!</h1>
      </FadeIn>
      
      <SlideIn direction="right" distance={100}>
        <p>This text slides in from the right</p>
      </SlideIn>
      
      <AnimatedButton>Click Me!</AnimatedButton>
    </div>
  );
}
```

## Components

The library includes the following components:

### Basic Animation Components

#### `FadeIn`

Fades in elements as they enter the viewport.

```jsx
<FadeIn 
  duration={0.8} 
  delay={0} 
  threshold={0.2}
  trigger="scroll" // 'scroll', 'load', or 'none'
>
  <h2>I will fade in!</h2>
</FadeIn>
```

#### `SlideIn`

Slides elements in from a specified direction.

```jsx
<SlideIn 
  direction="left" // 'left', 'right', 'top', 'bottom'
  distance={100} 
  duration={0.8}
  trigger="scroll"
>
  <div>I slide in from the left!</div>
</SlideIn>
```

#### `SimpleAnimated`

A basic animated component that uses CSS animations (no GSAP dependency).

```jsx
<SimpleAnimated 
  animation="fade" // 'fade', 'slide-left', 'slide-right', 'slide-up', 'slide-down', 'scale', 'rotate'
  duration={0.5}
  trigger="auto" // 'auto', 'hover', 'click', 'visible'
>
  <p>Simple CSS animation!</p>
</SimpleAnimated>
```

### Interactive Components

#### `AnimatedButton`

A button with hover animation effects.

```jsx
<AnimatedButton 
  duration={0.3}
  hover={{ scale: 1.05 }}
>
  Click Me!
</AnimatedButton>
```

#### `AnimatedCard`

A card component with hover and entrance animations.

```jsx
<AnimatedCard 
  hover={{ y: -10, scale: 1.03 }}
  entrance={{ y: 30, opacity: 0 }}
>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</AnimatedCard>
```

### Text Animation Components

#### `TextReveal`

Reveals text with a mask effect.

```jsx
<TextReveal 
  duration={1}
  direction="right" // 'left', 'right', 'top', 'bottom'
  color="black"
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
>
  This text animates character by character!
</SplitText>
```

### Scroll-Based Components

#### `ParallaxSection`

Creates a parallax effect for its children.

```jsx
<ParallaxSection speed={0.5}>
  <div className="parallax-content">
    Content that moves with parallax effect
  </div>
</ParallaxSection>
```

#### `ScrollTriggeredTimeline`

Creates complex animations tied to scroll position.

```jsx
<ScrollTriggeredTimeline
  animations={[
    { target: '.element1', props: { x: 100 }, position: 0 },
    { target: '.element2', props: { opacity: 1 }, position: 0.5 }
  ]}
>
  <div className="element1">First element</div>
  <div className="element2">Second element</div>
</ScrollTriggeredTimeline>
```

### Effect Components

#### `ScrollProgress`

Shows scroll progress as a bar at the top of the page.

```jsx
<ScrollProgress 
  height="5px" 
  color="#ff0000"
/>
```

#### `MagneticElement`

Creates a magnetic effect, pulling elements toward the cursor.

```jsx
<MagneticElement strength={0.5}>
  <button>Magnetic Button</button>
</MagneticElement>
```

#### `AnimatedCursor`

Customizes the cursor with animated effects.

```jsx
<AnimatedCursor 
  color="#ff0000"
  size={20}
/>
```

## Advanced Usage

### Using Hooks

The library provides several hooks for more control over animations:

#### `useAnimation`

```jsx
import { hooks } from 'react-gsap-animation-library';
const { useAnimation } = hooks;

function MyComponent() {
  const { ref, play, reset, isAnimating } = useAnimation({
    type: 'fade',
    duration: 0.5,
    trigger: 'none' // Manual trigger
  });
  
  return (
    <div>
      <div ref={ref}>This element will animate</div>
      <button onClick={play}>Play Animation</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

#### `useInView`

```jsx
import { hooks } from 'react-gsap-animation-library';
const { useInView } = hooks;

function MyComponent() {
  const { ref, isInView } = useInView({
    threshold: 0.5,
    onEnter: () => console.log('Element entered viewport')
  });
  
  return (
    <div ref={ref} style={{ opacity: isInView ? 1 : 0 }}>
      I'll become visible when in view
    </div>
  );
}
```

### Using Utilities

#### Animation Functions

```jsx
import { animations } from 'react-gsap-animation-library';

// Later in your code
animations.fadeIn(element, { duration: 1 });
animations.slideIn(element, { direction: 'left', distance: 100 });
```

#### Easing Functions

```jsx
import { easings } from 'react-gsap-animation-library';

// Use in GSAP animations
gsap.to(element, {
  x: 100,
  ease: easings.softBack
});
```

## Server-Side Rendering (SSR)

The library is compatible with server-side rendering frameworks like Next.js. When used in SSR environments, animations are properly deferred until the client-side hydration is complete.

## Fallback Behavior

If GSAP is not available, the library will automatically fallback to CSS-based animations for core functionality. This ensures that your animations will still work, even if there are issues loading GSAP.

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
