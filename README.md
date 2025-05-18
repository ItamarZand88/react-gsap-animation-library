# React-GSAP Animation Library

A comprehensive React component library that leverages GSAP for animations. This library provides ready-to-use, animated UI components that can be easily integrated into any React project.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Installation

```bash
npm install react-gsap-animation-library gsap
```

Make sure to install GSAP as a peer dependency, as it's required for all animations to work.

## Features

- 🚀 **15+ Ready-to-use Animation Components** – Just import and use
- 🎭 **Scroll-triggered Animations** – Elements animate as they enter the viewport
- 🧩 **Interactive Components** – Magnetic elements, animated cursors, and more
- 📝 **Text Animation** – Reveal, split, and animate text in various ways
- 🖼️ **Animated Backgrounds** – Create dynamic, interactive backgrounds
- 📊 **Scroll Progress Indicators** – Show scroll progress in various styles
- 🧰 **Animation Utilities** – Reusable animation functions and hooks

## Components

### Basic Animation Components

#### FadeIn

Fades in children elements when they enter the viewport.

```jsx
import { FadeIn } from 'react-gsap-animation-library';

<FadeIn 
  duration={0.8} 
  delay={0} 
  threshold={0.2}
  ease="power3.out"
  stagger={0}
  from={{ opacity: 0, y: 30 }}
>
  <h1>Hello World</h1>
  <p>This content will fade in when scrolled into view.</p>
</FadeIn>
```

#### SlideIn

Slides in elements from a specified direction when they enter the viewport.

```jsx
import { SlideIn } from 'react-gsap-animation-library';

<SlideIn
  direction="left" // 'left', 'right', 'top', 'bottom'
  duration={0.8}
  delay={0}
  threshold={0.2}
  distance={100}
  ease="power3.out"
>
  <div>This content will slide in from the left.</div>
</SlideIn>
```

For a complete list of components and detailed documentation, see the [Components Documentation](#) section below.

## Utility Hooks

The library provides several custom React hooks to help with animations:

```jsx
import { useScrollAnimation, useGsapAnimation } from 'react-gsap-animation-library';
import { animations } from 'react-gsap-animation-library/utils/animations';

// For scroll-triggered animations
const MyComponent = () => {
  const elementRef = useScrollAnimation({
    animation: 'fadeIn',
    duration: 1,
    threshold: 0.3
  });
  
  return <div ref={elementRef}>Scrolling reveals this element</div>;
};

// For applying animation presets
const MyOtherComponent = () => {
  const elementRef = useGsapAnimation(animations.pulse, { duration: 0.8 });
  
  return <div ref={elementRef}>This element can be animated</div>;
};
```

## Examples

Check out the [examples](https://github.com/ItamarZand88/react-gsap-animation-library/tree/main/examples) directory for comprehensive usage examples:

- **Basic Examples**: Core animation components
- **Text Examples**: Text animation components
- **Interactive Examples**: Interactive animation components
- **Advanced Examples**: Scroll-triggered and complex animations

To run the examples:

```bash
git clone https://github.com/ItamarZand88/react-gsap-animation-library.git
cd react-gsap-animation-library
npm install
# Create an example app that imports components from the examples folder
```

## Components Documentation

### Basic Animation Components

- **FadeIn**: Fade in elements as they enter the viewport
- **SlideIn**: Slide in elements from different directions
- **AnimatedButton**: Buttons with hover and click animations
- **AnimatedCard**: Cards with hover effects (lift, 3D, glow)
- **AnimatedList**: Animate list items in sequence

### Text Animation Components

- **TextReveal**: Reveal text with a masking effect
- **SplitText**: Split and animate text by characters, words, or lines
- **AnimatedCounter**: Animate counting from one number to another
- **Marquee**: Create an infinite scrolling text effect

### Advanced Animation Components

- **ParallaxSection**: Create sections with parallax background effects
- **ScrollTriggeredTimeline**: Complex animations triggered by scroll position
- **MagneticElement**: Elements that are attracted to the cursor
- **AnimatedCursor**: Custom animated cursor with trails
- **AnimatedBackground**: Animated canvas backgrounds with patterns
- **ScrollProgress**: Progress indicators for scroll position

### Utility Functions and Hooks

- **animations**: Reusable animation presets
- **easings**: Custom easing functions
- **hooks**: React hooks for GSAP animations

## Browser Support

This library uses modern JavaScript features and GSAP. It is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## Dependencies

- React 16.8.0 or higher
- GSAP 3.0.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
