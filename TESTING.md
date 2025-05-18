# Testing the Library Locally

This guide provides instructions on how to test your React-GSAP Animation Library locally before publishing to npm.

## Method 1: Using `npm link`

The `npm link` command creates a symbolic link between your local project and another local project. This is useful for testing unpublished packages locally.

### Step 1: Link the Library

In the library root directory:

```bash
# Build the library first
npm run build

# Create a global link
npm link
```

### Step 2: Create a Test React App

```bash
# Create a new React app in a different directory
npx create-react-app test-gsap-library

# Navigate to the test app directory
cd test-gsap-library
```

### Step 3: Link to Your Library in the Test App

```bash
# Link to your global package
npm link react-gsap-animation-library

# Install GSAP (as it's a peer dependency)
npm install gsap
```

### Step 4: Use Your Library in the Test App

Edit `src/App.js` in your test app:

```jsx
import React from 'react';
import { FadeIn, SlideIn, AnimatedButton } from 'react-gsap-animation-library';

function App() {
  return (
    <div className="App" style={{ padding: '40px' }}>
      <h1>Testing React-GSAP Animation Library</h1>
      
      <h2>FadeIn Component</h2>
      <FadeIn>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
          This should fade in when the page loads
        </div>
      </FadeIn>
      
      <h2>SlideIn Component</h2>
      <SlideIn direction="right">
        <div style={{ padding: '20px', backgroundColor: '#e0e0f0', marginBottom: '20px' }}>
          This should slide in from the right
        </div>
      </SlideIn>
      
      <h2>AnimatedButton Component</h2>
      <AnimatedButton
        style={{
          padding: '10px 20px',
          backgroundColor: '#4a89dc',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </AnimatedButton>
    </div>
  );
}

export default App;
```

### Step 5: Start the Test App

```bash
npm start
```

## Method 2: Using `yalc`

`yalc` is more reliable than `npm link` in some cases and works well with modern build tools.

### Step 1: Install `yalc` Globally

```bash
npm install -g yalc
```

### Step 2: Publish the Library Locally

In the library root directory:

```bash
# Build the library
npm run build

# Publish to local yalc store
yalc publish
```

### Step 3: Add the Library to Your Test App

```bash
# Navigate to your test app
cd ../test-gsap-library

# Add the library from yalc
yalc add react-gsap-animation-library

# Install GSAP
npm install gsap
```

### Step 4: Update the Test App When You Make Changes

After making changes to your library:

```bash
# In library directory
npm run build
yalc push

# This will automatically update all projects using this package via yalc
```

## Method 3: Using a Local `package.json` Reference

### Step 1: In Your Test App's `package.json`

```json
{
  "dependencies": {
    "react-gsap-animation-library": "file:../path/to/your/library",
    "gsap": "^3.12.2"
  }
}
```

### Step 2: Install Dependencies

```bash
npm install
```

## Troubleshooting

### Common Issues:

1. **React Version Conflicts**: If you get errors about React versions, you might need to set up your library to use the same React instance as your test app:

   ```jsx
   // In your library's rollup.config.js
   external: ['react', 'react-dom', 'gsap'],
   ```

2. **Missing Peer Dependencies**: Make sure to install all peer dependencies in your test app.

3. **Build Issues**: Ensure your library is built before testing.

4. **Hot Reloading Issues**: When using `npm link`, changes in your library might not trigger hot reloading. You may need to manually rebuild and restart your test app.

5. **Path Issues**: Make sure the paths in your imports are correct.

### Debugging Tips:

- Check the console for errors
- Verify that your components are being exported correctly
- Test simple components first before testing more complex ones
- Make sure GSAP is properly installed and imported