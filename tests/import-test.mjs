/**
 * Basic script to test if the library can be imported correctly.
 * 
 * Run this script after building the library with:
 * node tests/import-test.mjs
 */

async function runTest() {
  try {
    // Import library dynamically
    const lib = await import('../dist/index.esm.js');
    
    // Check if the components exist
    const components = [
      'FadeIn',
      'SlideIn',
      'AnimatedButton',
      'AnimatedCard',
      'AnimatedList',
      'TextReveal',
      'ParallaxSection',
      'SplitText',
      'AnimatedCounter',
      'Marquee',
      'ScrollTriggeredTimeline',
      'MagneticElement',
      'AnimatedCursor',
      'AnimatedBackground',
      'ScrollProgress'
    ];
    
    const utilities = [
      'animations',
      'easings',
      'hooks'
    ];
    
    // Check components
    console.log('Checking components...');
    let allComponentsExist = true;
    for (const component of components) {
      if (typeof lib[component] === 'undefined') {
        console.error(`❌ Component "${component}" is missing!`);
        allComponentsExist = false;
      } else {
        console.log(`✅ Component "${component}" exists.`);
      }
    }
    
    // Check utilities
    console.log('\nChecking utilities...');
    let allUtilitiesExist = true;
    for (const utility of utilities) {
      if (typeof lib[utility] === 'undefined') {
        console.error(`❌ Utility "${utility}" is missing!`);
        allUtilitiesExist = false;
      } else {
        console.log(`✅ Utility "${utility}" exists.`);
      }
    }
    
    // Final result
    console.log('\n--- TEST RESULTS ---');
    if (allComponentsExist && allUtilitiesExist) {
      console.log('✅ ALL TESTS PASSED: Library exports all expected components and utilities.');
    } else {
      console.error('❌ TESTS FAILED: Some components or utilities are missing!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ ERROR: Failed to import the library!');
    console.error(error);
    process.exit(1);
  }
}

runTest();