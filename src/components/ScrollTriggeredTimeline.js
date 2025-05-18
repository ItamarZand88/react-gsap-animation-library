import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollTriggeredTimeline = ({
  children,
  scrub = true,
  pin = true,
  start = "top top",
  end = "+=100%",
  markers = false,
  anticipatePin = 0,
  snap = null,
  id = "",
  className = "",
  style = {},
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  onUpdate
}) => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    
    // Create a timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start,
        end,
        scrub: scrub === true ? 1 : scrub,
        pin,
        anticipatePin,
        markers,
        id,
        snap,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack,
        onUpdate
      }
    });
    
    // Store the timeline for child components to reference
    timelineRef.current = tl;
    
    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [scrub, pin, start, end, markers, anticipatePin, snap, id, onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate]);

  // Provide the timeline to children if they need it
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { timeline: timelineRef.current });
    }
    return child;
  });

  return (
    <div ref={sectionRef} className={className} style={style}>
      {childrenWithProps}
    </div>
  );
};

export default ScrollTriggeredTimeline;