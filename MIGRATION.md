# Migration Guide: v1.x to v2.0.0

This guide will help you migrate from react-gsap-animation-library v1.x to v2.0.0.

## Major Changes

Version 2.0.0 brings significant improvements:

- Complete integration with GSAP's official React hooks (`@gsap/react`)
- Optimized component organization with a folder structure
- Removal of the CSS and Web Animation API fallbacks in favor of a GSAP-first approach
- More powerful and customizable components
- Enhanced accessibility features
- New components like `TypingText` for typewriter effects

## Installation Changes

1. Add the GSAP React package as a dependency:

```bash
npm install @gsap/react
# or
yarn add @gsap/react
```

2. Update to the latest version of the library:

```bash
npm install react-gsap-animation-library@2.0.0
# or
yarn add react-gsap-animation-library@2.0.0
```

## Required Code Changes

### 1. Wrap Your App with AnimationProvider

```jsx
// Before
import { FadeIn, SlideIn } from 'react-gsap-animation-library';

function App() {
  return (
    <div>
      <FadeIn>Content</FadeIn>
    </div>
  );
}

// After
import { AnimationProvider, FadeIn } from 'react-gsap-animation-library';

function App() {
  return (
    <AnimationProvider>
      <div>
        <FadeIn>Content</FadeIn>
      </div>
    </AnimationProvider>
  );
}
```

### 2. Update Import Paths

Components are now organized in categories:

```jsx
// Before
import { 
  FadeIn, 
  SlideIn, 
  TextReveal, 
  AnimatedButton 
} from 'react-gsap-animation-library';

// After - no change in the imports, but the components are organized differently internally
import { 
  FadeIn, 
  SlideIn, 
  TextReveal, 
  AnimatedButton,
  TypingText    // New component
} from 'react-gsap-animation-library';
```

### 3. Prop Name Changes

Some props have been renamed for consistency:

```jsx
// Before
<FadeIn 
  from={{ opacity: 0, y: 30 }}
  stagger={0.1}
>
  <div>Item 1</div>
  <div>Item 2</div>
</FadeIn>

// After
<FadeIn 
  direction="up" // Instead of from={{ opacity: 0, y: 30 }}
  stagger={0.1}
>
  <div>Item 1</div>
  <div>Item 2</div>
</FadeIn>
```

```jsx
// Before
<AnimatedButton 
  hover={{ scale: 1.1 }}
>
  Click me
</AnimatedButton>

// After
<AnimatedButton 
  effect="scale" // Instead of hover
>
  Click me
</AnimatedButton>
```

### 4. Event Handler Changes

If you were using manual animation controls, you'll need to update your code to use contextSafe:

```jsx
// Before
function MyComponent() {
  const handleClick = () => {
    // Direct GSAP animation
    gsap.to('.element', { opacity: 1 });
  };
  
  return <button onClick={handleClick}>Animate</button>;
}

// After
import { useAnimation } from 'react-gsap-animation-library';

function MyComponent() {
  const containerRef = useRef(null);
  const { contextSafe } = useAnimation({
    scope: containerRef
  });
  
  const handleClick = contextSafe(() => {
    gsap.to('.element', { opacity: 1 });
  });
  
  return (
    <div ref={containerRef}>
      <button onClick={handleClick}>Animate</button>
      <div className="element">Content</div>
    </div>
  );
}
```

## Component-Specific Changes

### FadeIn Component

```jsx
// Before
<FadeIn 
  from={{ opacity: 0, y: 30 }}
  trigger="scroll"
>
  Content
</FadeIn>

// After
<FadeIn 
  direction="up" // 'up', 'down', 'left', 'right', 'none'
  trigger="scroll"
>
  Content
</FadeIn>
```

### SlideIn Component

```jsx
// Before
<SlideIn 
  from={{ x: -100 }}
  trigger="scroll"
>
  Content
</SlideIn>

// After
<SlideIn 
  direction="right"
  distance={100}
  bounce={true} // New feature
  trigger="scroll"
>
  Content
</SlideIn>
```

### TextReveal Component

```jsx
// Before
<TextReveal 
  direction="left"
  backgroundColor="#000"
>
  Text Content
</TextReveal>

// After
<TextReveal 
  direction="left"
  backgroundColor="#000"
  maskStyle="gradient" // New feature: 'solid', 'gradient', 'split'
>
  Text Content
</TextReveal>
```

### AnimatedButton Component

```jsx
// Before
<AnimatedButton hover={{ scale: 1.1 }}>
  Click Me
</AnimatedButton>

// After
<AnimatedButton 
  effect="scale" // 'ripple', 'shine', 'pulse', 'scale', 'fill'
  effectColor="rgba(255, 255, 255, 0.4)"
>
  Click Me
</AnimatedButton>
```

### New TypingText Component

```jsx
// New in v2.0.0
import { TypingText } from 'react-gsap-animation-library';

// Single text
<TypingText 
  text="This is a typing text animation"
  typingSpeed={10}
  cursorBlink={true}
/>

// Multiple text sequences with loop
<TypingText 
  text={["First sentence", "Second sentence", "Third sentence"]}
  typingSpeed={10}
  deleteSpeed={5}
  delayBetweenTexts={1.5}
  loop={Infinity}
/>
```

## Hooks Usage

### Using Animation Hooks

```jsx
// Before
import { hooks } from 'react-gsap-animation-library';
const { useAnimation } = hooks;

function MyComponent() {
  const { ref, play } = useAnimation({
    type: 'fade',
    duration: 0.5
  });
  
  return (
    <div ref={ref}>
      <button onClick={play}>Animate</button>
    </div>
  );
}

// After
import { useAnimation } from 'react-gsap-animation-library';
import gsap from 'gsap';

function MyComponent() {
  const containerRef = useRef(null);
  
  const { contextSafe } = useAnimation({
    scope: containerRef
  });
  
  const play = contextSafe(() => {
    gsap.from(containerRef.current, { 
      opacity: 0,
      duration: 0.5
    });
  });
  
  return (
    <div ref={containerRef}>
      <button onClick={play}>Animate</button>
    </div>
  );
}
```

### New Hook: useAnimationEffect

```jsx
// New in v2.0.0
import { useAnimationEffect } from 'react-gsap-animation-library';
import { useRef } from 'react';

function MyComponent() {
  const elementRef = useRef(null);
  
  // Apply predefined animation effect
  useAnimationEffect(elementRef, {
    effect: 'fadeIn',    // Predefined effect
    direction: 'up',     
    duration: 0.8,       
    trigger: 'scroll'    // Trigger on scroll
  });
  
  return <div ref={elementRef}>Content with animation effect</div>;
}
```

### New Hook: useScrollTrigger

```jsx
// New in v2.0.0
import { useScrollTrigger } from 'react-gsap-animation-library';
import { useRef } from 'react';

function MyScrollComponent() {
  const elementRef = useRef(null);
  
  // Create scroll-based animation
  useScrollTrigger(elementRef, {
    animation: (target) => ({
      opacity: 1,
      y: 0,
      duration: 1
    }),
    initial: { opacity: 0, y: 50 },
    start: 'top 80%',     // When to start animation
    scrub: true          // Animation follows scroll position
  });
  
  return <div ref={elementRef}>Scroll-animated content</div>;
}
```

## Accessibility Features

Version 2.0.0 introduces improved accessibility support:

```jsx
// Global settings in AnimationProvider
<AnimationProvider settings={{
  respectReducedMotion: true,  // Respect prefers-reduced-motion setting
  lowPowerMode: true           // Reduce animation complexity on low power
}}>
  <App />
</AnimationProvider>

// Access settings anywhere
import { useAnimationSettings } from 'react-gsap-animation-library';

function AccessibilityControls() {
  const { 
    disableAllAnimations, 
    updateSettings 
  } = useAnimationSettings();
  
  return (
    <button onClick={() => updateSettings({ disableAllAnimations: true })}>
      Turn off animations
    </button>
  );
}
```

## Additional Resources

- [GSAP React Documentation](https://gsap.com/docs/react)
- [React GSAP Animation Library Documentation](https://github.com/ItamarZand88/react-gsap-animation-library/blob/main/README.md)

If you encounter any issues during migration, please [open an issue](https://github.com/ItamarZand88/react-gsap-animation-library/issues) on GitHub.
