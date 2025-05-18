import React from 'react';
import { FadeIn, SlideIn, AnimatedButton, AnimatedCard } from '../src';

const BasicExample = () => {
  return (
    <div className="example-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Basic Animation Examples</h1>

      <section style={{ marginBottom: '60px' }}>
        <h2>FadeIn Component</h2>
        <p style={{ marginBottom: '20px' }}>Elements fade in as they enter the viewport.</p>
        
        <FadeIn delay={0.2} duration={0.8}>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>This content fades in</h3>
            <p>This entire block will fade in when it enters the viewport.</p>
          </div>
        </FadeIn>
        
        <FadeIn stagger={0.1}>
          <div style={{ padding: '15px', backgroundColor: '#e9f5ff', borderRadius: '8px', marginBottom: '10px' }}>
            Item 1 - These items fade in with a stagger effect
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e9f5ff', borderRadius: '8px', marginBottom: '10px' }}>
            Item 2 - Each one appears after the previous one
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e9f5ff', borderRadius: '8px', marginBottom: '10px' }}>
            Item 3 - Creating a sequence of animations
          </div>
        </FadeIn>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>SlideIn Component</h2>
        <p style={{ marginBottom: '20px' }}>Elements slide in from different directions.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <SlideIn direction="left" distance={50}>
            <div style={{ padding: '20px', backgroundColor: '#f0f8e8', borderRadius: '8px', height: '100%' }}>
              <h3>Left Slide</h3>
              <p>This slides in from the left side.</p>
            </div>
          </SlideIn>
          
          <SlideIn direction="right" distance={50}>
            <div style={{ padding: '20px', backgroundColor: '#f8e8f0', borderRadius: '8px', height: '100%' }}>
              <h3>Right Slide</h3>
              <p>This slides in from the right side.</p>
            </div>
          </SlideIn>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <SlideIn direction="top" distance={50}>
            <div style={{ padding: '20px', backgroundColor: '#e8f0f8', borderRadius: '8px', height: '100%' }}>
              <h3>Top Slide</h3>
              <p>This slides in from the top.</p>
            </div>
          </SlideIn>
          
          <SlideIn direction="bottom" distance={50}>
            <div style={{ padding: '20px', backgroundColor: '#f8f0e8', borderRadius: '8px', height: '100%' }}>
              <h3>Bottom Slide</h3>
              <p>This slides in from the bottom.</p>
            </div>
          </SlideIn>
        </div>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>AnimatedButton Component</h2>
        <p style={{ marginBottom: '30px' }}>Buttons with hover and click animations.</p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <AnimatedButton
            style={{
              padding: '12px 25px',
              backgroundColor: '#4a89dc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            hoverScale={1.05}
            clickScale={0.95}
            onClick={() => alert('Button clicked!')}
          >
            Hover Me
          </AnimatedButton>
          
          <AnimatedButton
            style={{
              padding: '12px 25px',
              backgroundColor: '#e8537a',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            hoverScale={1.1}
            clickScale={0.9}
            onClick={() => alert('Button clicked!')}
          >
            Bigger Effect
          </AnimatedButton>
          
          <AnimatedButton
            style={{
              padding: '12px 25px',
              backgroundColor: 'transparent',
              color: '#333',
              border: '2px solid #333',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            hoverScale={1.03}
            clickScale={0.97}
            onClick={() => alert('Button clicked!')}
          >
            Outlined Style
          </AnimatedButton>
        </div>
      </section>

      <section>
        <h2>AnimatedCard Component</h2>
        <p style={{ marginBottom: '30px' }}>Cards with different hover effects.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <AnimatedCard
            hoverEffect="lift"
            style={{ padding: '25px', backgroundColor: 'white' }}
          >
            <h3 style={{ marginBottom: '15px' }}>Lift Effect</h3>
            <p>This card lifts up on hover with a subtle shadow.</p>
          </AnimatedCard>
          
          <AnimatedCard
            hoverEffect="3d"
            style={{ padding: '25px', backgroundColor: 'white' }}
          >
            <h3 style={{ marginBottom: '15px' }}>3D Effect</h3>
            <p>This card has a 3D tilt effect that follows your cursor.</p>
          </AnimatedCard>
          
          <AnimatedCard
            hoverEffect="glow"
            style={{ padding: '25px', backgroundColor: 'white' }}
          >
            <h3 style={{ marginBottom: '15px' }}>Glow Effect</h3>
            <p>This card has a subtle glow effect on hover.</p>
          </AnimatedCard>
        </div>
      </section>
    </div>
  );
};

export default BasicExample;