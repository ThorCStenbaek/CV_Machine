import React, { useState, useRef, useEffect } from 'react';

const Hint = ({ children, hintText }) => {
  const [showHint, setShowHint] = useState(false);
  const [hintPosition, setHintPosition] = useState('left');
  const hintTimeoutRef = useRef(null);

  const handleMouseEnter = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    setHintPosition(mouseX < rect.width / 2 ? 'left' : 'right');

    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(true);
    }, 1000); // Show hint after 1 second
  };

  const handleMouseLeave = () => {
    clearTimeout(hintTimeoutRef.current);
    setShowHint(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showHint && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            [hintPosition]: '0%',
            transform: hintPosition === 'right' ? 'translateX(-100%)' : 'translateX(0)',
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid black',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          {hintText}
        </div>
      )}
    </div>
  );
};

export default Hint;
