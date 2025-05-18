import React from 'react';
import { 
  ScrollTriggeredTimeline, 
  ParallaxSection, 
  ScrollProgress, 
  AnimatedBackground,
  AnimatedList
} from '../src';

const AdvancedExample = () => {
  return (
    <div className="example-container">
      {/* Fixed scroll progress indicator */}
      <ScrollProgress 
        type="bar" 
        position="top" 
        color="#e74c3c" 
        backgroundColor="rgba(0,0,0,0.1)" 
        size={4}
        fixed={true}
        showPercentage={true}
        percentagePosition="end"
      />
      
      {/* Header section */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Advanced Animation Examples</h1>
        <p style={{ fontSize: '20px', maxWidth: '600px' }}>
          Scroll down to see advanced GSAP animations including parallax effects, 
          scroll-triggered timelines, and animated backgrounds.
        </p>
      </section>
      
      {/* Parallax Section */}
      <ParallaxSection
        backgroundImage="https://source.unsplash.com/random/1920x1080/?landscape"
        speed={0.5}
        height="80vh"
        overlay={true}
        overlayColor="rgba(0, 0, 0, 0.6)"
      >
        <div style={{ color: 'white', textAlign: 'center', maxWidth: '800px', padding: '20px' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Parallax Section</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6 }}>
            This section features a parallax background effect. As you scroll, the background moves 
            at a different speed than the content, creating a sense of depth. This technique is often 
            used to create immersive scrolling experiences on modern websites.
          </p>
        </div>
      </ParallaxSection>
      
      {/* Animated Background */}
      <section style={{ padding: '80px 20px' }}>
        <AnimatedBackground
          pattern="dots"
          color="rgba(52, 152, 219, 0.2)"
          backgroundColor="#f9f9f9"
          density={20}
          speed={1}
          interactive={true}
          style={{ padding: '60px 20px', borderRadius: '12px' }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Animated Background</h2>
            <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '30px' }}>
              This component creates an interactive animated background. Move your mouse 
              over the area to see how the dots react to your cursor. This can be used to 
              create engaging sections that respond to user interaction.
            </p>
            
            <AnimatedList stagger={0.1}>
              <div style={{ 
                padding: '15px 20px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                marginBottom: '15px',
                textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3>Interactive Elements</h3>
                <p>Backgrounds that respond to user mouse movements create an engaging experience.</p>
              </div>
              
              <div style={{ 
                padding: '15px 20px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                marginBottom: '15px',
                textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3>Customizable Patterns</h3>
                <p>Choose from dots, waves, grid, or noise patterns to match your design.</p>
              </div>
              
              <div style={{ 
                padding: '15px 20px', 
                backgroundColor: 'white', 
                borderRadius: '8px',
                textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3>Performance Optimized</h3>
                <p>Animations are optimized for smooth performance across devices.</p>
              </div>
            </AnimatedList>
          </div>
        </AnimatedBackground>
      </section>
      
      {/* ScrollTriggeredTimeline */}
      <ScrollTriggeredTimeline
        scrub={1}
        pin={true}
        start="top top"
        end="+=100%"
        style={{ height: '100vh', backgroundColor: '#333', color: 'white' }}
      >
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Scroll-Triggered Timeline</h2>
          <p style={{ fontSize: '18px', maxWidth: '600px', lineHeight: 1.6 }}>
            This section is pinned to the viewport as you scroll. The ScrollTriggeredTimeline component
            allows you to create complex animations that progress as the user scrolls through the section.
            This is perfect for storytelling or step-by-step explanations.
          </p>
          
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '16px', opacity: 0.7 }}>
              Continue scrolling to release this pinned section
            </p>
          </div>
        </div>
      </ScrollTriggeredTimeline>
      
      {/* Multi-section with ScrollProgress */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center' }}>
            Section Progress Indicator
          </h2>
          
          <div style={{ 
            position: 'relative',
            padding: '30px',
            border: '1px solid #eee',
            borderRadius: '12px',
            marginBottom: '40px'
          }}>
            <ScrollProgress 
              type="circle"
              position="right"
              color="#27ae60" 
              size={3}
              fixed={false}
              showPercentage={true}
              style={{ top: '20px', right: '20px' }}
            />
            
            <h3 style={{ marginBottom: '20px' }}>Circular Progress Indicator</h3>
            <p style={{ marginBottom: '15px' }}>
              The ScrollProgress component can be used in circle mode to show progress through a specific section.
            </p>
            <p style={{ marginBottom: '15px' }}>
              As you scroll through this section, watch how the circle fills to indicate your progress.
            </p>
            <p style={{ marginBottom: '15px' }}>
              This can be helpful for long-form content like articles or tutorials, giving users a visual
              indication of how far they've progressed through the content.
            </p>
            <p>
              The component is highly customizable, allowing you to change its appearance and behavior
              to match your design requirements.
            </p>
          </div>
          
          <div style={{ 
            position: 'relative',
            padding: '30px',
            border: '1px solid #eee',
            borderRadius: '12px'
          }}>
            <ScrollProgress 
              type="dots"
              position="right"
              color="#e74c3c" 
              backgroundColor="#f5f5f5"
              size={4}
              fixed={false}
              showPercentage={false}
            />
            
            <h3 style={{ marginBottom: '20px' }}>Dot Progress Indicator</h3>
            <p style={{ marginBottom: '15px' }}>
              The ScrollProgress component can also display progress as a series of dots.
            </p>
            <p style={{ marginBottom: '15px' }}>
              This style is particularly useful for indicating progress through a multi-step
              process or a guided tutorial.
            </p>
            <p style={{ marginBottom: '15px' }}>
              The dots will fill in as you scroll through this section, providing a clear
              visual representation of your progress.
            </p>
            <p>
              By combining these different progress indicators with your content, you can
              create a more engaging and informative user experience.
            </p>
          </div>
        </div>
      </section>
      
      {/* Final section */}
      <section style={{ 
        height: '50vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Explore and Experiment</h2>
        <p style={{ fontSize: '18px', maxWidth: '600px' }}>
          These examples showcase just a few of the many possibilities with our React-GSAP Animation Library.
          Combine different components and customize their properties to create unique and engaging animations
          for your projects.
        </p>
      </section>
    </div>
  );
};

export default AdvancedExample;