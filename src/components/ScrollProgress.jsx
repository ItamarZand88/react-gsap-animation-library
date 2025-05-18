import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = ({
  type = 'bar', // 'bar', 'circle', 'dots'
  position = 'top', // 'top', 'bottom', 'left', 'right'
  color = '#000',
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  size = 5,
  fixed = true,
  showPercentage = false,
  percentagePosition = 'end', // 'start', 'end', 'center'
  className = '',
  style = {}
}) => {
  const progressRef = useRef(null);
  const percentageRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressElement = progressRef.current;
    const percentageElement = percentageRef.current;
    
    // Create ScrollTrigger for tracking scroll progress
    const scrollTrigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const newProgress = Math.round(self.progress * 100);
        setProgress(newProgress);
        
        if (type === 'bar') {
          if (position === 'top' || position === 'bottom') {
            gsap.set(progressElement, { width: `${newProgress}%` });
          } else {
            gsap.set(progressElement, { height: `${newProgress}%` });
          }
        } else if (type === 'circle') {
          const circumference = 2 * Math.PI * (size * 10);
          const dashOffset = circumference * (1 - self.progress);
          gsap.set(progressElement, { strokeDashoffset: dashOffset });
        } else if (type === 'dots') {
          const dots = progressElement.children;
          const activeIndex = Math.floor(self.progress * dots.length);
          
          for (let i = 0; i < dots.length; i++) {
            if (i <= activeIndex) {
              gsap.set(dots[i], { backgroundColor: color });
            } else {
              gsap.set(dots[i], { backgroundColor: backgroundColor });
            }
          }
        }
      }
    });
    
    return () => {
      scrollTrigger.kill();
    };
  }, [type, position, color, backgroundColor, size]);

  // Determine container style based on position and type
  const getContainerStyle = () => {
    const baseStyle = {
      position: fixed ? 'fixed' : 'absolute',
      zIndex: 1000,
      ...style
    };
    
    if (type === 'bar') {
      if (position === 'top') {
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          width: '100%',
          height: `${size}px`,
          backgroundColor
        };
      } else if (position === 'bottom') {
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${size}px`,
          backgroundColor
        };
      } else if (position === 'left') {
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          width: `${size}px`,
          height: '100%',
          backgroundColor
        };
      } else if (position === 'right') {
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          width: `${size}px`,
          height: '100%',
          backgroundColor
        };
      }
    } else if (type === 'circle') {
      const circleSize = size * 20;
      
      if (position === 'top') {
        return {
          ...baseStyle,
          top: '20px',
          right: '20px',
          width: `${circleSize}px`,
          height: `${circleSize}px`
        };
      } else if (position === 'bottom') {
        return {
          ...baseStyle,
          bottom: '20px',
          right: '20px',
          width: `${circleSize}px`,
          height: `${circleSize}px`
        };
      } else if (position === 'left') {
        return {
          ...baseStyle,
          top: '50%',
          left: '20px',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          transform: 'translateY(-50%)'
        };
      } else if (position === 'right') {
        return {
          ...baseStyle,
          top: '50%',
          right: '20px',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          transform: 'translateY(-50%)'
        };
      }
    } else if (type === 'dots') {
      if (position === 'left') {
        return {
          ...baseStyle,
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        };
      } else if (position === 'right') {
        return {
          ...baseStyle,
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        };
      } else {
        return {
          ...baseStyle,
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          gap: '10px'
        };
      }
    }
    
    return baseStyle;
  };

  // Determine progress element style based on type and position
  const getProgressStyle = () => {
    if (type === 'bar') {
      if (position === 'top' || position === 'bottom') {
        return {
          height: '100%',
          width: '0%',
          backgroundColor: color
        };
      } else {
        return {
          width: '100%',
          height: '0%',
          backgroundColor: color,
          position: 'absolute',
          bottom: 0
        };
      }
    }
    
    return {};
  };

  // Get percentage style
  const getPercentageStyle = () => {
    if (type === 'bar') {
      if (position === 'top' || position === 'bottom') {
        if (percentagePosition === 'start') {
          return {
            position: 'absolute',
            left: '10px',
            top: position === 'bottom' ? '-25px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        } else if (percentagePosition === 'end') {
          return {
            position: 'absolute',
            right: '10px',
            top: position === 'bottom' ? '-25px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        } else {
          return {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: position === 'bottom' ? '-25px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        }
      } else {
        if (percentagePosition === 'start') {
          return {
            position: 'absolute',
            top: '10px',
            left: position === 'right' ? '-40px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        } else if (percentagePosition === 'end') {
          return {
            position: 'absolute',
            bottom: '10px',
            left: position === 'right' ? '-40px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        } else {
          return {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: position === 'right' ? '-40px' : '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color
          };
        }
      }
    } else if (type === 'circle') {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '14px',
        fontWeight: 'bold',
        color
      };
    }
    
    return {};
  };

  // Render based on type
  const renderProgress = () => {
    if (type === 'bar') {
      return (
        <>
          <div ref={progressRef} style={getProgressStyle()}></div>
          {showPercentage && (
            <div ref={percentageRef} style={getPercentageStyle()}>
              {progress}%
            </div>
          )}
        </>
      );
    } else if (type === 'circle') {
      const circleSize = size * 10;
      const strokeWidth = size;
      const radius = (circleSize - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      
      return (
        <>
          <svg width="100%" height="100%" viewBox={`0 0 ${circleSize} ${circleSize}`}>
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
            />
            <circle
              ref={progressRef}
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            />
          </svg>
          {showPercentage && (
            <div ref={percentageRef} style={getPercentageStyle()}>
              {progress}%
            </div>
          )}
        </>
      );
    } else if (type === 'dots') {
      // Create 10 dots for progress
      const dots = [];
      for (let i = 0; i < 10; i++) {
        dots.push(
          <div
            key={i}
            style={{
              width: `${size * 2}px`,
              height: `${size * 2}px`,
              borderRadius: '50%',
              backgroundColor: i === 0 ? color : backgroundColor
            }}
          ></div>
        );
      }
      
      return (
        <>
          <div ref={progressRef} style={{ display: 'flex', flexDirection: position === 'left' || position === 'right' ? 'column' : 'row', gap: '10px' }}>
            {dots}
          </div>
          {showPercentage && (
            <div ref={percentageRef} style={getPercentageStyle()}>
              {progress}%
            </div>
          )}
        </>
      );
    }
    
    return null;
  };

  return (
    <div className={className} style={getContainerStyle()}>
      {renderProgress()}
    </div>
  );
};

export default ScrollProgress;