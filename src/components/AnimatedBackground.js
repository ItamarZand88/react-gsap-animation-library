import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = ({
  children,
  pattern = 'dots', // 'dots', 'waves', 'grid', 'noise'
  color = 'rgba(0, 0, 0, 0.1)',
  backgroundColor = 'white',
  density = 20,
  speed = 1,
  interactive = true,
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to match container
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse position for interactive effects
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    // Animation setup based on pattern
    let animate;
    let items = [];
    
    switch(pattern) {
      case 'dots':
        // Create dots
        const dotCount = Math.ceil((canvas.width * canvas.height) / (10000 / density));
        for (let i = 0; i < dotCount; i++) {
          items.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed
          });
        }
        
        animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          items.forEach(dot => {
            // Update position
            dot.x += dot.vx;
            dot.y += dot.vy;
            
            // Bounce off edges
            if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
            if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
            
            // Interactive effect - move away from cursor
            if (interactive) {
              const dx = mousePosition.current.x - dot.x;
              const dy = mousePosition.current.y - dot.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 60) {
                const angle = Math.atan2(dy, dx);
                const pushX = Math.cos(angle) * (60 - distance) * 0.02;
                const pushY = Math.sin(angle) * (60 - distance) * 0.02;
                
                dot.x -= pushX;
                dot.y -= pushY;
              }
            }
            
            // Draw dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          });
          
          animationRef.current = requestAnimationFrame(animate);
        };
        break;
        
      case 'waves':
        const waveCount = Math.ceil(canvas.height / (100 / density));
        const waves = [];
        
        for (let i = 0; i < waveCount; i++) {
          waves.push({
            y: (canvas.height / waveCount) * i + Math.random() * 20,
            amplitude: Math.random() * 10 + 5,
            frequency: Math.random() * 0.01 + 0.01,
            offset: Math.random() * 1000
          });
        }
        
        animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          waves.forEach(wave => {
            // Update offset
            wave.offset += speed * 0.05;
            
            // Draw wave
            ctx.beginPath();
            ctx.moveTo(0, wave.y);
            
            for (let x = 0; x < canvas.width; x += 5) {
              const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
              ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            
            ctx.fillStyle = color;
            ctx.fill();
          });
          
          animationRef.current = requestAnimationFrame(animate);
        };
        break;
        
      case 'grid':
        const cellSize = Math.floor(50 / (density / 10));
        
        animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const time = Date.now() * 0.001 * speed;
          
          // Draw grid
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          
          // Vertical lines
          for (let x = 0; x <= canvas.width; x += cellSize) {
            const offsetX = Math.sin(time + x * 0.01) * 5;
            
            ctx.beginPath();
            ctx.moveTo(x + offsetX, 0);
            ctx.lineTo(x + offsetX, canvas.height);
            ctx.stroke();
          }
          
          // Horizontal lines
          for (let y = 0; y <= canvas.height; y += cellSize) {
            const offsetY = Math.cos(time + y * 0.01) * 5;
            
            ctx.beginPath();
            ctx.moveTo(0, y + offsetY);
            ctx.lineTo(canvas.width, y + offsetY);
            ctx.stroke();
          }
          
          animationRef.current = requestAnimationFrame(animate);
        };
        break;
        
      case 'noise':
        animate = () => {
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          const data = imageData.data;
          
          const time = Date.now() * 0.0001 * speed;
          const scale = density / 10;
          
          // Parse the color to get RGB values
          const colorMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          let r, g, b, a = 1;
          
          if (colorMatch) {
            [, r, g, b, a] = colorMatch;
            r = parseInt(r);
            g = parseInt(g);
            b = parseInt(b);
            a = a ? parseFloat(a) : 1;
          } else {
            r = g = b = 0;
          }
          
          // Background
          const bgMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          let bgR, bgG, bgB;
          
          if (bgMatch) {
            [, bgR, bgG, bgB] = bgMatch;
            bgR = parseInt(bgR);
            bgG = parseInt(bgG);
            bgB = parseInt(bgB);
          } else {
            bgR = bgG = bgB = 255;
          }
          
          for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
              const noise = Math.random();
              const index = (y * canvas.width + x) * 4;
              
              // Simplex noise would be better here, but this is a simple demo
              const noiseValue = Math.sin(x / scale + time) * Math.cos(y / scale + time) * 0.5 + 0.5;
              
              // Mix noise with background color
              data[index] = bgR + (r - bgR) * noiseValue * a;
              data[index + 1] = bgG + (g - bgG) * noiseValue * a;
              data[index + 2] = bgB + (b - bgB) * noiseValue * a;
              data[index + 3] = 255;
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          animationRef.current = requestAnimationFrame(animate);
        };
        break;
        
      default:
        // Default to dots
        animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          animationRef.current = requestAnimationFrame(animate);
        };
    }
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, color, backgroundColor, density, speed, interactive]);

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;