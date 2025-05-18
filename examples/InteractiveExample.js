import React, { useState } from 'react';
import { 
  MagneticElement, 
  AnimatedCursor, 
  AnimatedButton 
} from '../src';
import { useGsapAnimation } from '../src/utils/hooks';
import { animations } from '../src/utils/animations';

const InteractiveExample = () => {
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('pulse');
  
  const animatedElementRef = useGsapAnimation((element, options) => {
    return animations[currentAnimation](element, options);
  }, { duration: 0.8 });
  
  const toggleCursor = () => {
    setShowCustomCursor(!showCustomCursor);
  };
  
  const animationOptions = [
    'pulse', 'shake', 'bounceIn', 'rotateIn', 'fadeIn', 'slideIn'
  ];

  return (
    <div className="example-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {showCustomCursor && (
        <AnimatedCursor 
          size={15}
          color="rgba(52, 152, 219, 0.6)"
          hoverColor="rgba(52, 152, 219, 0.9)"
          hoverScale={2}
          trailLength={5}
          speed={0.15}
        />
      )}
      
      <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Interactive Animation Examples</h1>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>MagneticElement Component</h2>
        <p style={{ marginBottom: '30px' }}>Elements that are attracted to your cursor.</p>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <MagneticElement
            strength={0.6}
            radius={150}
          >
            <div style={{ 
              padding: '20px 40px', 
              backgroundColor: '#3498db', 
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '18px',
              display: 'inline-block'
            }}>
              Move your cursor near me
            </div>
          </MagneticElement>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticElement
            strength={0.8}
            radius={100}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#e74c3c', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Strong
            </div>
          </MagneticElement>
          
          <MagneticElement
            strength={0.4}
            radius={120}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#9b59b6', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Medium
            </div>
          </MagneticElement>
          
          <MagneticElement
            strength={0.2}
            radius={150}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#2ecc71', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Subtle
            </div>
          </MagneticElement>
        </div>
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2>Animation Gallery</h2>
        <p style={{ marginBottom: '30px' }}>
          Different animation effects applied to an element using the animation utilities.
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div ref={animatedElementRef} style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#3498db',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            margin: '0 auto'
          }}>
            {currentAnimation}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {animationOptions.map((animation) => (
            <AnimatedButton
              key={animation}
              style={{
                padding: '8px 16px',
                backgroundColor: currentAnimation === animation ? '#e74c3c' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentAnimation(animation)}
            >
              {animation}
            </AnimatedButton>
          ))}
        </div>
      </section>
      
      <section>
        <h2>Custom Cursor</h2>
        <p style={{ marginBottom: '30px' }}>
          Replace the default cursor with a customized animated cursor.
        </p>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>
            {showCustomCursor 
              ? 'Custom cursor is enabled. Notice how it reacts when hovering over buttons.' 
              : 'Enable the custom cursor to see it in action.'}
          </p>
          
          <AnimatedButton
            style={{
              padding: '12px 30px',
              backgroundColor: showCustomCursor ? '#e74c3c' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={toggleCursor}
          >
            {showCustomCursor ? 'Disable' : 'Enable'} Custom Cursor
          </AnimatedButton>
          
          {showCustomCursor && (
            <div style={{ 
              marginTop: '40px', 
              padding: '20px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Interactive Elements</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#9b59b6', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Hover Me
                </button>
                
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#2ecc71', 
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Link Example
                </a>
                
                <div 
                  className="clickable"
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#f39c12', 
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Custom Element
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InteractiveExample;