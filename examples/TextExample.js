import React from 'react';
import { TextReveal, SplitText, AnimatedCounter, Marquee } from '../src';

const TextExample = () => {
  return (
    <div className="example-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Text Animation Examples</h1>

      <section style={{ marginBottom: '60px' }}>
        <h2>TextReveal Component</h2>
        <p style={{ marginBottom: '30px' }}>Reveals text with a masking effect.</p>
        
        <div style={{ marginBottom: '30px' }}>
          <TextReveal
            duration={1.2}
            color="#333"
            fontSize="28px"
            fontWeight="bold"
            lineHeight="1.3"
          >
            This text is revealed with a mask effect
          </TextReveal>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <TextReveal
            duration={1.5}
            delay={0.5}
            color="#e74c3c"
            fontSize="24px"
            fontWeight="bold"
          >
            With a longer delay
          </TextReveal>
        </div>
        
        <div>
          <TextReveal
            duration={2}
            color="#3498db"
            fontSize="20px"
          >
            And slower reveal duration
          </TextReveal>
        </div>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>SplitText Component</h2>
        <p style={{ marginBottom: '30px' }}>Splits and animates text by characters, words, or lines.</p>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px' }}>Character Animation</h3>
          <SplitText
            type="chars"
            animation="fadeIn"
            stagger={0.03}
            color="#333"
          >
            This text animates each character
          </SplitText>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px' }}>Word Animation</h3>
          <SplitText
            type="words"
            animation="stagger"
            stagger={0.08}
            color="#e74c3c"
          >
            Each word animates one after another
          </SplitText>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px' }}>Wave Animation</h3>
          <SplitText
            type="chars"
            animation="wave"
            duration={0.7}
            color="#3498db"
          >
            This text has a wave-like animation effect
          </SplitText>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '10px' }}>Random Animation</h3>
          <SplitText
            type="chars"
            animation="random"
            duration={0.8}
            color="#27ae60"
          >
            Characters appear with random rotations
          </SplitText>
        </div>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>AnimatedCounter Component</h2>
        <p style={{ marginBottom: '30px' }}>Animates counting from one number to another.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div>
            <AnimatedCounter
              start={0}
              end={1250}
              duration={2.5}
              separator=","
              style={{ fontSize: '36px', fontWeight: 'bold', color: '#3498db' }}
            />
            <p style={{ marginTop: '10px' }}>Happy Customers</p>
          </div>
          
          <div>
            <AnimatedCounter
              start={0}
              end={98.5}
              duration={2}
              decimals={1}
              suffix="%"
              style={{ fontSize: '36px', fontWeight: 'bold', color: '#27ae60' }}
            />
            <p style={{ marginTop: '10px' }}>Satisfaction Rate</p>
          </div>
          
          <div>
            <AnimatedCounter
              start={0}
              end={42}
              duration={1.5}
              prefix="+"
              style={{ fontSize: '36px', fontWeight: 'bold', color: '#e74c3c' }}
            />
            <p style={{ marginTop: '10px' }}>Countries Served</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Marquee Component</h2>
        <p style={{ marginBottom: '30px' }}>Creates an infinite scrolling text effect.</p>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '10px' }}>Horizontal Marquee</h3>
          <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
            <Marquee
              direction="left"
              speed={50}
              pauseOnHover={true}
              style={{ height: '60px' }}
            >
              <div style={{ display: 'flex', gap: '50px', padding: '0 25px', height: '100%', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>Breaking News</span>
                <span>New animation library released</span>
                <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>Featured Update</span>
                <span>Performance improvements and new components added</span>
                <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>Coming Soon</span>
                <span>Advanced 3D animation capabilities</span>
              </div>
            </Marquee>
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '10px' }}>Vertical Marquee</h3>
          <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
            <Marquee
              direction="up"
              speed={30}
              pauseOnHover={true}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '15px', textAlign: 'center' }}>
                <div>Animation libraries are essential for modern UIs</div>
                <div>GSAP provides powerful animation capabilities</div>
                <div>React components make reusability easy</div>
                <div>Smooth animations improve user experience</div>
                <div>Customizable animations for any project</div>
                <div>Performance optimized for all devices</div>
              </div>
            </Marquee>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextExample;