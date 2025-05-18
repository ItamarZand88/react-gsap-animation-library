# React-GSAP Animation Library

A comprehensive React component library that leverages GSAP for animations. This library provides ready-to-use, animated UI components that can be easily integrated into any React project.

## Installation

```bash
npm install react-gsap-animation-library gsap
```

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

### Interactive Components

#### AnimatedButton

A button with hover and click animations.

```jsx
import { AnimatedButton } from 'react-gsap-animation-library';

<AnimatedButton
  onClick={() => console.log('Button clicked!')}
  className="my-button"
  hoverScale={1.05}
  clickScale={0.95}
  duration={0.3}
  style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white' }}
>
  Click Me
</AnimatedButton>
```

#### AnimatedCard

A card component with hover animations.

```jsx
import { AnimatedCard } from 'react-gsap-animation-library';

<AnimatedCard
  hoverEffect="3d" // 'lift', '3d', 'glow', or 'none'
  duration={0.3}
  hoverScale={1.03}
  tiltAmount={10} // For 3D effect
  style={{ padding: '20px', backgroundColor: 'white' }}
>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</AnimatedCard>
```

#### AnimatedList

A component to animate list items in sequence.

```jsx
import { AnimatedList } from 'react-gsap-animation-library';

<AnimatedList
  stagger={0.1}
  duration={0.5}
  from={{ opacity: 0, y: 30 }}
  threshold={0.2}
  delay={0}
  ease="power3.out"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedList>
```

#### TextReveal

A component that reveals text with a masking effect.

```jsx
import { TextReveal } from 'react-gsap-animation-library';

<TextReveal
  duration={1}
  delay={0}
  threshold={0.2}
  ease="power3.out"
  color="black"
  fontSize="24px"
  fontWeight="bold"
  lineHeight="1.5"
  textAlign="center"
>
  This text will be revealed with a masking effect.
</TextReveal>
```

### Text Animation Components

#### SplitText

A component that splits text and animates each character, word, or line.

```jsx
import { SplitText } from 'react-gsap-animation-library';

<SplitText
  type="chars" // 'chars', 'words', or 'lines'
  animation="fadeIn" // 'fadeIn', 'stagger', 'wave', 'random'
  duration={0.5}
  stagger={0.03}
  delay={0}
  threshold={0.2}
  ease="power3.out"
  color="black"
>
  This text will be split and animated.
</SplitText>
```

## Utility Hooks

### useGsapAnimation

A hook for applying GSAP animations to elements.

```jsx
import { useGsapAnimation } from 'react-gsap-animation-library/utils/hooks';
import { animations } from 'react-gsap-animation-library/utils/animations';

const MyComponent = () => {
  const elementRef = useGsapAnimation(animations.pulse, { duration: 0.8 });
  
  return <div ref={elementRef}>Animated element</div>;
};
```

### useScrollAnimation

A hook for creating scroll-triggered animations.

```jsx
import { useScrollAnimation } from 'react-gsap-animation-library/utils/hooks';

const MyComponent = () => {
  const elementRef = useScrollAnimation({
    animation: 'fadeIn',
    duration: 1,
    threshold: 0.3
  });
  
  return <div ref={elementRef}>Scrolling reveals this element</div>;
};
```

### useGsapTimeline

A hook for creating and managing GSAP timelines.

```jsx
import { useGsapTimeline } from 'react-gsap-animation-library/utils/hooks';
import { useRef, useEffect } from 'react';

const MyComponent = () => {
  const elementRef = useRef(null);
  const timelineRef = useGsapTimeline({
    scrollTrigger: {
      trigger: elementRef.current,
      start: 'top center'
    }
  });
  
  useEffect(() => {
    if (elementRef.current && timelineRef.current) {
      timelineRef.current.from(elementRef.current, {
        opacity: 0,
        y: 50,
        duration: 1
      });
    }
  }, []);
  
  return <div ref={elementRef}>Timeline animated element</div>;
};
```

## Animation Utilities

The library provides reusable animation presets and custom easing functions:

```jsx
import { animations, easings } from 'react-gsap-animation-library';

// Use animation presets
animations.fadeIn(element, { duration: 0.8, delay: 0.2 });
animations.bounceIn(element);
animations.slideIn(element, { direction: 'left' });
animations.pulse(element);

// Use custom easing functions
gsap.to(element, {
  y: 100,
  ease: easings.bounceOut,
  duration: 1
});
```

## Browser Support

This library uses modern JavaScript features and GSAP. It is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## Dependencies

- React 16.8.0 or higher
- GSAP 3.0.0 or higher

## License

MIT