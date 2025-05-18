# Examples for React-GSAP Animation Library

This directory contains various examples demonstrating how to use the components and utilities provided by the React-GSAP Animation Library.

## Examples Overview

### Basic Components (`BasicExample.js`)

Demonstrates the core animation components:

- **FadeIn**: Elements that fade in as they enter the viewport
- **SlideIn**: Elements that slide in from different directions
- **AnimatedButton**: Buttons with hover and click animations
- **AnimatedCard**: Cards with different hover effects (lift, 3D, glow)

### Text Animations (`TextExample.js`)

Showcases text-related animation components:

- **TextReveal**: Text revealed with a masking effect
- **SplitText**: Splitting and animating text by characters, words, or lines
- **AnimatedCounter**: Animated counting from one number to another
- **Marquee**: Infinite scrolling text in any direction

### Interactive Elements (`InteractiveExample.js`)

Presents interactive animation components:

- **MagneticElement**: Elements that are attracted to your cursor
- **AnimatedCursor**: Custom cursor with hover effects and trailing
- **Animation Utilities**: Demonstrating various animations from the animation utility

### Advanced Scroll Effects (`AdvancedExample.js`)

Demonstrates scroll-based and more complex animations:

- **ParallaxSection**: Sections with parallax background effects
- **ScrollTriggeredTimeline**: Complex animations triggered by scroll position
- **ScrollProgress**: Progress indicators for scroll position (bar, circle, dots)
- **AnimatedBackground**: Animated canvas backgrounds with different patterns

## Running the Examples

To run these examples in a development environment:

1. Clone the repository:
   ```
   git clone https://github.com/ItamarZand88/react-gsap-animation-library.git
   ```

2. Install dependencies:
   ```
   cd react-gsap-animation-library
   npm install
   ```

3. Create a simple React app that imports and renders the examples:
   ```jsx
   import Examples from './examples';
   
   const App = () => {
     return <Examples />;
   };
   
   export default App;
   ```

4. Run the development server:
   ```
   npm start
   ```

## Using the Examples as References

These examples are designed to showcase different ways to use the components and can serve as a reference when implementing animations in your own projects. Feel free to copy and modify the code as needed.

Each example demonstrates:

- The basic usage of components
- Different configuration options
- Combining multiple components
- Common animation patterns

## Note on Dependencies

The examples assume that the GSAP library is installed and properly configured. Make sure that GSAP and its plugins (particularly ScrollTrigger) are included in your project.

## Additional Resources

For more in-depth documentation, refer to:

- The main README file in the repository root
- Code comments within the component files
- The GSAP documentation at [https://greensock.com/docs/](https://greensock.com/docs/)
